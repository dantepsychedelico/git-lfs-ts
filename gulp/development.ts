
import gulp from 'gulp';
let $ = require('gulp-load-plugins')();

gulp.task('devServe', () => {
    $.nodemon({
        script: 'app.js',
        ext: 'js',
        env: {
            NODE_ENV: 'development',
            DATABASE: 'sqlite'
        },
        ignore: [
            'node_modules/', 'gulp/'
        ]
    });
});

gulp.task('development', gulp.series('devServe'));
