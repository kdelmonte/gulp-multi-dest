# gulp-multi-dest
Just like gulp dest but supports multiple output paths

## Install

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
    .pipe(gulp.dest(['./dist1/js', './dist2/js'], destOptions));
});
```

## TODO
- Write tests! In a rush right now.