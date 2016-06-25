(function() {
  'use strict';
  // gulp的插件
  var gulp = require('gulp');
  var connect = require('gulp-connect');
  var open = require('gulp-open');
  var uglify = require('gulp-uglify');
  var minifyCss = require('gulp-minify-css');
  var htmlmin = require('gulp-htmlmin');
  var rev = require('gulp-rev');
  var ngmin = require('gulp-ngmin');
  var usemin = require('gulp-usemin');
  var concat = require('gulp-concat');
  var clean = require('gulp-clean');

  // nodejs的模块
  var path = require('path');

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
      scripts: 'src/scripts/',
      images: 'src/images/',
      fonts: 'src/styles/fonts/',
      ionicFonts: 'src/lib/ionic/fonts/'
    },
    dist: {
      root: 'dist/',
      htmls: 'dist/tpls/',
      styles: 'dist/styles/',
      scripts: 'dist/scripts/',
      images: 'dist/images/',
      fonts: 'dist/styles/fonts/'
    }
  };
  /* =================================
    Dist Version
    ================================= */
  // clean dist folder
  gulp.task('cleanDist', function() {
    return gulp.src(paths.dist.root, {
        read: false
      })
      .pipe(clean());
  });

  // usemin index.html
  gulp.task('useminhtml', ['cleanDist'], function() {
    return gulp.src(paths.src.root + 'index.html')
      .pipe(usemin({
        css: [minifyCss({
          advanced: false
        }), rev],
        ioniccss: [minifyCss({
          advanced: false
        }), rev],
        html: [htmlmin({
          collapseWhitespace: false,
          removeComments: true
        })],
        js: [ngmin({
          dynamic: false
        }), uglify(), rev],
        ionicjs: [uglify(), rev],
      }))
      .pipe(gulp.dest(paths.dist.root));
  });

  // copy tpls folder
  gulp.task('copyHtml', ['cleanDist', 'useminhtml'], function() {
    return gulp.src([paths.src.htmls + '*.*']).pipe(gulp.dest(paths.dist.htmls));
  });

  // copy image
  gulp.task('copyImage', ['cleanDist', 'useminhtml'], function() {
    return gulp.src([paths.src.images + '**/*.*']).pipe(gulp.dest(paths.dist.images));
  });

  // copy fonts
  gulp.task('copyFonts', ['cleanDist', 'useminhtml'], function() {
    return gulp.src([paths.src.fonts + '*.*']).pipe(gulp.dest(paths.dist.fonts));
  });

  // copy ionic fonts
  gulp.task('copyIonicFonts', ['cleanDist', 'useminhtml'], function() {
    return gulp.src([paths.src.ionicFonts + '*.*']).pipe(gulp.dest(paths.dist.fonts));
  });

  // build the webapp
  gulp.task('build', ['cleanDist', 'useminhtml', 'copyHtml', 'copyImage', 'copyFonts', 'copyIonicFonts']);

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
      uri: 'http://' + config.host + ':' + config.port + '/dist/index.html'
    }));
  });

  // dist下的服务
  gulp.task('server-dist', ['connect', 'open-dist']);

  // dev下的，打开链接
  gulp.task('open-dev', function() {
    return gulp.src('./src/index.html').pipe(open({
      uri: 'http://' + config.host + ':' + config.port + '/src/index.html'
    }));
  });

  // dev下的服务
  gulp.task('server-dev', ['watch', 'connect', 'open-dev']);
  /* =================================
    Default task
    ================================= */
  gulp.task('default', ['server-dev']);
})();
