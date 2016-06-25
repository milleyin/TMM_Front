(function() {
  'use strict';

  var gulp = require('gulp');
  var $ = require('gulp-load-plugins')();
  var openURL = require('open');
  var lazypipe = require('lazypipe');
  var runSequence = require('run-sequence');
  var spritesmith = require('gulp.spritesmith');
  var merge = require('merge-stream');

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
      index:'src/index.html',
      root: 'src/',
      styles: 'src/styles/css/',
      sass: 'src/styles/scss/',
      scripts: 'src/app/**/*.js',
      templates: 'src/app/**/*.html',
      images: 'src/images/'
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

  var styles = lazypipe()
    .pipe($.sourcemaps.init)
    .pipe($.sass, {
      outputStyle: 'expanded',
      precision: 10
    })
    .pipe($.autoprefixer, ['iOS 7', 'Android 4.3'])
    .pipe($.sourcemaps.write)
    .pipe(gulp.dest, paths.src.styles);

  gulp.task('sprite', function() {
    var spriteData = gulp.src(paths.src.images + '/icons/*.png').pipe(spritesmith({
      retinaSrcFilter: [paths.src.images + '/icons/*@2x.png'],
      imgName: 'sprite.png',
      retinaImgName: 'sprite@2x.png',
      imgPath : '../../images/sprite.png',
      retinaImgPath : '../../images/sprite@2x.png',
      cssName: 'sprite.css',
    }));

    var imgStream = spriteData.img
      .pipe(gulp.dest(paths.src.images));

    var cssStream = spriteData.css
      .pipe(gulp.dest(paths.src.styles));

    return merge(imgStream, cssStream);
  });

  gulp.task('images', function() {
    return gulp.src(paths.src.images + '*.{png,jpg}')
      .pipe($.imagemin({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
      }))
      .pipe(gulp.dest('.tmp/'));
  });

  gulp.task('styles', function() {
    return gulp.src(paths.src.sass + '*.scss')
      .pipe(styles());
  });



  gulp.task('start:server', function() {
    $.connect.server({
      root: [paths.src.root, '.tmp'],
      livereload: true,
      host: '0.0.0.0',
      port: 9000
    });
  });

  gulp.task('start:client', ['start:server', 'styles'], function() {
    openURL('http://localhost:9000');
  });

  gulp.task('watch', function() {
    $.watch(paths.src.sass + '*/**', function() {
      gulp.src(paths.src.sass + '*.scss')
        .pipe($.plumber())
        .pipe(styles())
        .pipe($.connect.reload());
    })

    $.watch(paths.src.scripts)
      .pipe($.plumber())
      // .pipe(lintScripts())
      .pipe($.connect.reload())

    $.watch(paths.src.templates)
      .pipe($.plumber())
      .pipe($.connect.reload());

    gulp.watch(paths.src.images + 'icons/**/*', ['sprite']);

  });


  gulp.task('build', function() {
    var jsFilter = $.filter('**/*.js',{restore: true});
    var cssFilter = $.filter('**/*.css',{restore: true});

    return gulp.src(paths.src.index)
      .pipe($.useref({searchPath: ['src']}))
      .pipe(jsFilter)
      .pipe($.ngAnnotate())
      .pipe($.uglify())
      .pipe(jsFilter.restore)
      .pipe(cssFilter)
      .pipe($.minifyCss({cache: true}))
      .pipe(cssFilter.restore)
      .pipe($.rev())
      .pipe($.revReplace())
      .pipe(gulp.dest(paths.dist.root));
  })

  gulp.task('serve', function(cb) {
    runSequence('start:client',
      'watch', cb);
  });

  gulp.task('default', ['serve']);


})();
