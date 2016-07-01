module.exports = function(grunt) {
  var serveStatic = require('serve-static');

  require('time-grunt')(grunt);

  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin',
    ngtemplates: 'grunt-angular-templates',
    sprite: "grunt-spritesmith"
  });


  var appConfig = {
    app: require('./bower.json').appPath || 'src',
    dist: 'dist'
  };

  grunt.initConfig({

    tmm: appConfig,

    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= tmm.app %>/app/{,*/,*/*/}*.js'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      compass: {
        files: ['<%= tmm.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server', 'postcss:server']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= tmm.app %>/*.html',
          '<%= tmm.app %>/app/{,*/,**/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= tmm.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= tmm.dist %>/{,*/}*',
            '!<%= tmm.dist %>/.git{,*/}*'
          ]
        }]
      },
      server: '.tmp'
    },

    connect: {
      options: {
        port: 9000,
        hostname: '*',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function(connect) {
            return [
              serveStatic('.tmp'),
              connect().use(
                '/bower_components',
                serveStatic('./bower_components')
              ),
              serveStatic(appConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function(connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          port: 9002,
          livereload: 35728,
          open: true,
          base: '<%= tmm.dist %>'
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
          dest: '.tmp/styles/'
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

    wiredep: {
      app: {
        src: ['<%= tmm.app %>/index.html'],
        ignorePath: /\.\.\//
      },
      sass: {
        src: ['<%= tmm.app %>/styles/{,*/}*.{scss,sass}'],
        ignorePath: /(\.\.\/){1,2}bower_components\//
      }
    },

    compass: {
      options: {
        sassDir: '<%= tmm.app %>/styles',
        cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%= tmm.app %>/images',
        javascriptsDir: '<%= tmm.app %>/scripts',
        fontsDir: '<%= tmm.app %>/styles/fonts',
        importPath: './bower_components',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/styles/fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          generatedImagesDir: '<%= tmm.dist %>/images/generated'
        }
      },
      server: {
        options: {
          sourcemap: true
        }
      }
    },

    filerev: {
      dist: {
        src: [
          '<%= tmm.dist %>/scripts/{,*/}*.js',
          '<%= tmm.dist %>/styles/{,*/}*.css',
          '<%= tmm.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= tmm.dist %>/styles/fonts/*'
        ]
      }
    },

    useminPrepare: {
      html: '<%= tmm.app %>/index.html',
      options: {
        dest: '<%= tmm.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    usemin: {
      html: ['<%= tmm.dist %>/{,*/}*.html'],
      css: ['<%= tmm.dist %>/styles/{,*/}*.css'],
      js: ['<%= tmm.dist %>/scripts/{,*/}*.js'],
      options: {
        assetsDirs: [
          '<%= tmm.dist %>',
          '<%= tmm.dist %>/images',
          '<%= tmm.dist %>/styles'
        ],
        patterns: {
          js: [
            [/(images\/[^''""]*\.(png|jpg|jpeg|gif|webp|svg))/g, 'Replacing references to images']
          ]
        }
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= tmm.app %>/images',
          src: ['{,*/}*.{png,jpg,jpeg,gif}', '!icons/**'],
          dest: '<%= tmm.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= tmm.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= tmm.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeComments: true
        },
        files: [{
          expand: true,
          cwd: '<%= tmm.dist %>',
          src: ['*.html'],
          dest: '<%= tmm.dist %>'
        }]
      }
    },

    ngtemplates: {
      dist: {
        options: {
          module: 'app',
          htmlmin: '<%= htmlmin.dist.options %>',
          usemin: 'scripts/scripts.js'
        },
        cwd: '<%= tmm.app %>',
        src: 'app/{,*/,*/*/}*.html',
        dest: '.tmp/templateCache.js'
      }
    },

    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= tmm.app %>',
          dest: '<%= tmm.dist %>',
          src: [
            '*.{ico,png,txt}',
            '*.html',
            'images/{,*/}*.{webp}',
            'fonts/{,*/}*.{eot,svg,ttf,woff}',
            'styles/fonts/{,*/}*.*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= tmm.dist %>/images',
          src: ['generated/*']
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= tmm.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    concurrent: {
      server: [
        'compass:server'
      ],
      dist: [
        'compass:dist',
        'copy:styles',
        'imagemin',
        'svgmin'
      ]
    },

    sprite: {
      all: {
        src: '<%= tmm.app %>/images/icons/*.png',
        retinaSrcFilter: ['<%= tmm.app %>/images/icons/*@2x.png'],
        dest: '<%= tmm.app %>/images/sprite.png',
        retinaDest: '<%= tmm.app %>/images/sprite@2x.png',
        destCss: '<%= tmm.app %>/styles/sprite.css'
      }
    }

  });


  grunt.registerTask('serve', 'Compile then start a connect web server', function(target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'wiredep',
      'concurrent:server',
      'postcss:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'postcss',
    'ngtemplates',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin'
  ]);

};
