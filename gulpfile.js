var yamlTranslate = require('./index.js');

var gulp = require('gulp');

var locale = 'language/*.{yml, yaml}';

gulp.task('translate', function() {
    return gulp.src(locale).pipe(yamlTranslate({ clean: true }));
});

gulp.task('watch', function() {
    gulp.watch(locale, ['translate']);
});
