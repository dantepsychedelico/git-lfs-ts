'use strict';

import gulp from 'gulp';
import requireDir from 'require-dir';

let env = process.env.NODE_ENV || 'development';

requireDir('./gulp');

gulp.task('clean', (done) => done());

gulp.task('default', gulp.series('clean', env));
