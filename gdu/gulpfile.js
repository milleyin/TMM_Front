(function() {
  'use strict';
  // gulp的插件
  var gulp = require('gulp');
  var connect = require('gulp-connect');
  var open = require('gulp-open');
  var rename = require('gulp-rename');
  var uglify = require('gulp-uglify');
  var minifyCSS = require('gulp-minify-css');
  var concat = require('gulp-concat');
  var del = require('del');
  // nodejs的模块
  var path = require('path');
  var fs = require('fs');

  console.log('process...', process.env);

  // 声明配置
  var config = {
    // 端口
    host: gulp.env.host || 'localhost',
    port: gulp.env.port || 8080
  };
  // 声明路径
  var paths = {
    root: __dirname + '/',
    src: {
      root: 'src/',
      htmls: 'src/tpls/',
      styles: 'src/styles/',
      scripts: 'src/scripts/'
    },
    dist: {
      root: 'dist/',
      styles: 'dist/styles/',
      scripts: 'dist/scripts'
    }
  };
  /* =================================
    Dist Version
    ================================= */

  /* =================================
    Watch
    ================================= */
  // src  
  gulp.task('src', function() {
    gulp.src([paths.src.root + '*'])
      .pipe(connect.reload());
  });

  // 监听文件变化
  gulp.task('watch', function() {
    // src
    gulp.watch([paths.src.root + '**/*.*'], ['src']);
  });
  /* =================================
    Connect
    ================================= */
  // 连接web服务器
  gulp.task('connect', function() {
    return connect.server({
      root: [paths.root],
      livereload: true,
      port: config.port
    });
  });

  // dist下的，打开链接
  gulp.task('open-dist', function() {
    return gulp.src('./dist/index.html').pipe(open({
      uri: 'http://' + config.host +  ':' + config.port + '/dist/index.html'
    }));
  });

  // dist下的服务
  gulp.task('server-dist', ['connect', 'open-dist']);

  // dev下的，打开链接
  gulp.task('open-dev', function() {
    return gulp.src('./src/index.html').pipe(open({
      uri: 'http://' + config.host +  ':' + config.port + '/src/index.html'
    }));
  });

  // dev下的服务
  gulp.task('server-dev', ['watch', 'connect', 'open-dev']);
  /* =================================
    Default task
    ================================= */
  gulp.task('default', ['server-dev']);
})();
