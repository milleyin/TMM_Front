module.exports = function(grunt) {
  require('time-grunt')(grunt);
  require('jit-grunt')(grunt, {
    sprite: "grunt-spritesmith"
  });

  var serveStatic = require('serve-static');

  var config = {
    app: 'src',
    dist: 'dist'
  }


  grunt.initConfig({
    config: config,

    clean: {
      server: '.tmp',
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= config.dist %>/{,*/}*',
            '!<%= config.dist %>/.git{,*/}*'
          ]

        }]
      }
    },
    sprite: {
      all: {
        src: 'styles/icons/*.png',
        // retinaSrcFilter: ['<%= config.app %>/images/icons/*@2x.png'],
        dest: '<%= config.app %>/images/spritesheet.png',
        // retinaDest: '<%= config.app %>/images/spritesheet@2x.png',
        destCss: '<%= config.app %>/styles/sprites.css'
      }
    },

    compass: {
      options: {
        sassDir: 'styles/scss',
        cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/images/icons',
        imagesDir: '<%= config.app %>/images',
        fontsDir: '<%= config.app %>/fonts',
        relativeAssets: false,
        noLineComments: true,
        assetCacheBuster: false
      },
      dist: {
        options: {
          generatedImagesDir: '<%= config.dist %>/images/icons'
        }
      },
      server: {
        options: {
          sourcemap: true,
          outputStyle: 'compact'
        }
      }
    },

    copy: {
      styles: {
        expand: true,
        dot: true,
        cwd: '<%= config.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      },
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dist %>',
          src: [
            '*.{ico,png,txt}',
            'images/{,*/}*.webp',
            '*.html',
            'fonts/{,*/}*.*'
          ]
        }]
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'styles/images',
          src: '*.{png,jpg,jpeg,gif}',
          dest: '<%= config.app %>/images'
        }]
      }
    },

    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      sprite: {
        files: ['styles/icons/*.png'],
        tasks: ['sprite']
      },
      images: {
        files: ['styles/images/{,*/}*.{png,jpg,jpeg,gif}'],
        tasks: ['newer:imagemin']
      },
      js: {
        files: ['<%= config.app %>/scripts/{,*/}*.js'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      compass: {
        files: ['styles/scss/{,*/}*.{scss,sass}'],
        tasks: ['compass:server', 'postcss:server']
      },
      gruntfile: {
        files: ['gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= config.app %>/{,*/}*.html',
          '<%= config.app %>/styles/*.css',
          '<%= config.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    wiredep: {
      app: {
        src: ['<%= config.app %>/index.html'], // 指定我们要处理的文件
        ignorePath: /\.\.\// //排除掉filepath什么文件，比如引入的是../bower_components 变成=> bower_components
          // exculde:[''] // 排除哪些文件
      }
    },

    connect: {
      options: {
        port: 8888,
        hostname: '*',
        livereload: 35728
      },
      livereload: {
        options: {
          open: true,
          middleware: function(connect) { // middleware
            return [
              serveStatic('.tmp'), // 指定 添加到根路径的路径匹配
              connect().use(
                '/bower_components',
                serveStatic('./bower_components')
              ),
              serveStatic(config.app)
            ];
          }
        }
      }
    },
    concurrent: {
      server: [
        'compass:server'
      ],
      dist: [
        'copy:styles'
      ]
    },
    postcss: {
      options: {
        processors: [
          require('autoprefixer')({
            browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']
          })
        ]
      },
      server: {
        options: {
          map: false
        },
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '<%= config.app %>/styles/'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

  });

  grunt.registerTask('serve', function(target) {

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'postcss:server',
      'connect:livereload',
      'watch'
    ]);
  });

}
