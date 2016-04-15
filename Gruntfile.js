module.exports = function(grunt) {

  var to5ify = require('babelify');
  var coffeeify = require('coffeeify');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      dev: {
        files: {
          'jsapp/compiled/bundle.js': [
            'jsapp/js/main.es6',
          ],
        },
        options: {
          browserifyOptions: {
              paths: [
                './jsapp/js',
              ],
              debug: true,
              extensions: [
                '.es6',
                '.jsx',
                '.js',
                '.coffee'
              ]
          },
          transform: [
            [ to5ify, { compact: false, presets: ['es2015', 'react'],
              'plugins': ['add-module-exports'] } ],
            [ coffeeify ]
          ]
        }
      }
    },
    clean: {
      js: [
        'jsapp/js/libs/xlform.js',
        'jsapp/js/tmp/',
      ]
    },
    sass: {
      dist: {
        files: {
          'jsapp/compiled/bundle.css': 'jsapp/scss/main.scss'
        }
      }
    },
    // autoprefixer is required for material-design-icons
    autoprefixer: {
      target: {
        files: {
          'jsapp/compiled/bundle.css': 'jsapp/compiled/bundle.css'
        }
      },
    },
    uglify: {
      main: {
        files: {
          'jsapp/compiled/bundle.min.js': ['jsapp/compiled/bundle.js']
        }
      }
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'jsapp/compiled/bundle.min.css': ['jsapp/compiled/bundle.css']
        }
      }
    },
    copy: {
      fonts: {
        expand: true,
        flatten: true,
        src: [
          './node_modules/font-awesome/fonts/*',
          './node_modules/roboto-fontface/fonts/*.wof*',
          ],
        dest: './jsapp/fonts/',
      }
    },
    webfont: {
        icons: {
            src: 'jsapp/icons/*.svg',
            dest: 'jsapp/fonts',
            destCss: 'jsapp/fonts',
            options: {
                font: 'k-iconfont',
                syntax: 'bem',
                templateOptions: {
                    baseClass: 'ki',
                    classPrefix: 'ki-'
                }
            }
        }
    },
    watch: {
      js: {
        options: {
          livereload: true,
        },
        tasks: ['browserify:dev'],
        // , 'string-replace:fixreqjs'],
        interrupt: true,
        files: [
          './jsapp/js/**/*.es6',
          './jsapp/js/**/*.js',
          './jsapp/js/**/*.jsx',
          './jsapp/js/**/*.coffee',
          './jsapp/xlform/**/*.coffee',
          './jsapp/xlform/**/*.js',
        ]
      },
      css: {
        files: ['jsapp/compiled/bundle.css'],
        options: {
          livereload: true
        }
      },
      sass: {
        tasks: ['sass', 'autoprefixer'],
        files: ['jsapp/scss/**/*.scss'],
        options: {
          livereload: false
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-webfont');
  grunt.registerTask('develop', [
    'browserify:dev',
    'sass:dist',
    'autoprefixer',
    'watch',
  ]);
  grunt.registerTask('js', ['browserify:dev', 'clean']);
  grunt.registerTask('build', [
    'browserify:dev',
    'sass:dist',
    'autoprefixer',
    'clean:js',
  ]);
  grunt.registerTask('buildall', [
    'copy',
    'webfont',
  ]);
  grunt.registerTask('default', ['develop']);

};
