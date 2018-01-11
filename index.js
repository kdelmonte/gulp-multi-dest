/* jshint node: true */
var PLUGIN_NAME = 'gulp-multi-dest';
var through = require('through2');
var gulp = require('gulp');
var async = require('async');

module.exports = function (paths, options) {
	options = options || {};
	var writtenFiles = [];

	if (typeof (paths) === 'string') {
		paths = [paths];
	}

	var dests = paths.map(function (path) {
		return gulp.dest(path, options);
	});

	function writeFileToMultipleDestinations(file, encoding, done) {
		async.each(dests, function (dest, wroteFileToDest) {
			var fileClone = file.clone();
			dest.write(fileClone, function () {
				writtenFiles.push(fileClone);
				wroteFileToDest();
			});
		}, done);
	}

	function flushCreatedFiles(done) {
		var stream = this;
		for(var i = 0; i < writtenFiles.length; i++){
			var file = writtenFiles[i];
			stream.push(file);
		}		
		done();
	}

	return through.obj(writeFileToMultipleDestinations, flushCreatedFiles);
};