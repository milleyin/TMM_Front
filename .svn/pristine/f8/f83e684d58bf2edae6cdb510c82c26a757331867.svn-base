module.exports = function(grunt) {

  var serveStatic = require('serve-static');

  require('time-grunt')(grunt);

  require('jit-grunt')(grunt, {
    sprite: "grunt-spritesmith"
  });

  var appConfig = {
    app: 'src',
    dist: 'dist'
  };

  grunt.initConfig({
    tmm: appConfig,
    clean: {
      server: '.tmp'
    },
    connect: {
      options: {
        port: 8888,
        hostname: '*',
        livereload: 35722
      },
      livereload: {
        options: {
          open: true,
          middleware: function(connect) {
            return [
              serveStatic(appConfig.app)
            ];
          }
        }
      }
    },

    watch: {
      compass: {
        files: ['<%= tmm.app %>/scss/{,*/}*.{scss,sass}'],
        tasks: ['compass:server', 'postcss:server']
      },
      livereload: {
        options: { livereload: '<%= connect.options.livereload %>' },
        files: [
          '<%= tmm.app %>/*.html',
          '<%= tmm.app %>/styles/{,*/}*.css',
          '<%= tmm.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }

    },

    compass: {
      options: {
        sassDir: '<%= tmm.app %>/scss',
        cssDir: '.tmp/styles',
        relativeAssets: false,
        assetCacheBuster: false,
        environment: 'production',
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      server: {
        options: {
          sourcemap: true
        }
      }
    },

    postcss: {
      options: {
        processors: [
          require('autoprefixer')({ browsers: ['iOS 7', 'Android 4.3'] })
        ]
      },
      server: {
        options: {
          map: true
        },
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '<%= tmm.app %>/styles/'
        }]
      }

    },

    imagemin: {
      sprite: {
        files: [{
          expand: true,
          cwd: '.tmp/images',
          src: ['{,*/}*.{png,jpg,jpeg,gif}'],
          dest: '<%= tmm.app %>/images'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= tmm.app %>/imageResouce',
          src: ['*.{png,jpg,jpeg,gif}'],
          dest: '<%= tmm.app %>/images'
        }]
      }
    },

    sprite: {
      all: {
        src: '<%= tmm.app %>/imageResouce/icons/*.png',
        retinaSrcFilter: ['<%= tmm.app %>/imageResouce/icons/*@2x.png'],
        dest: '.tmp/images/sprite.png',
        retinaDest: '.tmp/images/sprite@2x.png',
        destCss: '<%= tmm.app %>/styles/sprite.css'
      }
    }


  });

  grunt.registerTask('serve', function() {
    grunt.task.run([
      'clean',
      'compass:server',
      'postcss:server',
      'connect:livereload',
      'watch'
    ]);

  });

  grunt.registerTask('sprites', function() {
    grunt.task.run([
      'sprite:all',
      'imagemin:sprite'
    ]);
  });
};
