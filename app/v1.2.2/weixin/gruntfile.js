module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-spritesmith');

  grunt.registerTask('test', ['jshint']);

  grunt.registerTask('default', ['concat', 'uglify']);
  grunt.registerTask('live', ['connect', 'watch']);
  grunt.registerTask('img', ['clean', 'imagemin', 'sprite:all']);


  grunt.initConfig({
    distdir: 'dist',
    pkg: grunt.file.readJSON('package.json'),
    src: {
      js: ['src/**/*.js'],
      jsTpl: ['<%= distdir %>/templates/**/*.js'],
      html: ['src/index.html'],
      tpl: {
        app: ['src/tpls/**/*.tpl.html'],
      }
    },
    clean: {
      dist: '.tmp'
    },
    connect: {
      server: {
        options: {
          // 设置端口号
          port: 9009,
          hostname: '*',
          base: 'src',
          livereload: true,
          open: true
        }
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src/images/png',
          src: '**/*.{gif,jpeg,jpg,png}',
          dest: '.tmp/images'
        }]
      }
    },
    sprite: {
      all: {
        src: '.tmp/images/*.png',
        retinaSrcFilter: ['.tmp/images/*@2x.png'],
        dest: 'src/images/spritesheet.png',
        retinaDest: 'src/images/spritesheet@2x.png',
        destCss: 'src/css/sprites.css'
      },
      to: {
        src: 'src/images/png/*.png',
        dest: 'src/images/spritesheet.png',
        destCss: 'src/css/sprites.css'
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src/images/png',
          src: '**/*.{gif,jpeg,jpg,png}',
          dest: '.tmp/images'
        }]
      }
    },
     watch: {
      client: {
        options: {
          livereload: true
        },
        files: ['src/**/*']
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/**/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },

    jshint: {
      files: ['gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        //这里是覆盖JSHint默认配置的选项
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    }

  });


};
