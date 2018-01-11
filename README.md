# gulp-multi-dest [![Build Status](https://travis-ci.org/kdelmonte/gulp-multi-dest.svg?branch=master)](https://travis-ci.org/kdelmonte/gulp-multi-dest)
Just like gulp dest but supports multiple output paths

## Install

```
npm install gulp-multi-dest --save-dev
```

## Usage 

```
var gulp = require('gulp');
var multiDest = require('gulp-multi-dest');

var destOptions = {
    mode: 0755
};

gulp.task('copy', function() {
  return gulp.src('./js/*.js')
    .pipe(multiDest(['./dist1/js', './dist2/js'], destOptions));
});
```

## Test

To start the tests run `npm install` and then `npm run test`.
