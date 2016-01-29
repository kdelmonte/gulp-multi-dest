/* jshint node: true */
var PLUGIN_NAME = 'gulp-multi-dest';
var through = require('through2');
var gulp = require('gulp');
var async = require('async');

module.exports = function(paths, options) {
	options = options || {};
	var files = [];

	var dests = paths.map(function(path) {
		return gulp.dest(path, options);
	});

	function writeFilesToMultipleDestinations(file, done) {
		async.each(dests, function(dest, wroteOne) {
			dest.write(file, wroteOne);
		}, done);
	}

	var holdFile = function(file, encoding, done) {
		files.push(file);
		done();
	};

	var flushAllFiles = function(done) {
		var transform = this;

		function outputFiles() {
			files.forEach(function(file) {
				transform.push(file);
			});
			done();
		}

		async.each(files, writeFilesToMultipleDestinations, outputFiles);
	};

	return through.obj(holdFile, flushAllFiles);
};