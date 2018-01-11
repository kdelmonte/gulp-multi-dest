import promisify from 'promisify-node';
import fs from 'fs';
const access = promisify(fs.access);
import test from 'ava';
import File from 'vinyl';
import pEvent from 'p-event';
import path from 'path';
import mkdirp from 'mkdirp-promise';
import del from 'del';
import multiDest from './index';
import through from 'through2';
import _ from 'lodash';

const testOutputDirectory = './.test-output';

test('write files to all specified locations', async t => {
    const destinations = [
        path.join(testOutputDirectory, 'test1/dest1'),
        path.join(testOutputDirectory, 'test1/dest2')
    ];

    await del(destinations);

    for (let dest of destinations) {
        await mkdirp(dest);
    }

    const fakeFileName = 'test-file.txt';
    const fakeFile = new File({
        cwd: '/home',
        base: '/fake/path',
        path: `/fake/path/${fakeFileName}`,
        contents: new Buffer('test content')
    });

    const pluginStream = multiDest(destinations);
    const finish = pEvent(pluginStream, 'finish');
    pluginStream.end(fakeFile);

    await finish;

    for (let dest of destinations) {
        let filePath = path.join(dest, fakeFileName);
        let err = await access(filePath);
        t.ifError(err, `File ${filePath} was not created`);
    }
});

test('all written files are piped through', async t => {
    const destinations = [
        path.join(testOutputDirectory, 'test2/dest1'),
        path.join(testOutputDirectory, 'test2/dest2')
    ];
    const createdFiles = [];

    await del(destinations);

    for (let dest of destinations) {
        await mkdirp(dest);
    }

    const fakeFileName = 'test-file.txt';
    const fakeFile = new File({
        cwd: '/home',
        base: '/fake/path',
        path: `/fake/path/${fakeFileName}`,
        contents: new Buffer('test content')
    });

    const pluginStream = multiDest(destinations);
    const finish = pEvent(pluginStream, 'finish');

    pluginStream
        .pipe(through.obj(function (file, encoding, done) {
            let transform = this;
            createdFiles.push(file.path);
            transform.push(file);
            done();
        }));
    pluginStream.end(fakeFile);

    await finish;

    t.is(createdFiles.length, 2);

    let filesThatShouldHaveBeenCreated = destinations.map(dest => {
        return path.resolve(path.join(dest, fakeFileName));
    });

    const allFilesWereCreated = _.every(createdFiles, filePath => {
        return _.includes(filesThatShouldHaveBeenCreated, path.resolve(filePath));
    })

    t.is(allFilesWereCreated, true);
});