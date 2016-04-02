# gulp-multi-dest
Just like gulp dest but supports multiple output paths

## Install

[![NPM](https://nodei.co/npm/gulp-multi-dest.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/gulp-multi-dest/)

```
npm install gulp-multi-dest --save
```

## Usage 

```
var gulp - require('gulp');
var multiDest = require('gulp-multi-dest');

var destOptions = {
    mode: 0755
};

gulp.task('copy', function() {
  return gulp.src('./js/*.js')
    .pipe(multiDest(['./dist1/js', './dist2/js'], destOptions));
});
```

## TODO
- Write tests! In a rush right now.
