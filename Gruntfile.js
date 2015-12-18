'use strict';

var request = require('request');
var envify = require('envify');
var env = process.env.REAL_ENV || process.env.NODE_ENV || 'development';

module.exports = function (grunt) {
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  var reloadPort = 35729, files;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concurrent: {
      dev: ['sass', 'watchify', 'watch', 'nodemon'],
      options: {
        logConcurrentOutput: true,
        limit: 4
      }
    },

    develop: {
      server: {
        file: 'server.js'
      }
    },
    sass: {
      options: {
        sourceMap: true,
        update: true
      },
      dist: {
        files: {
          'public/css/style.css'      : 'public/scss/style.scss'
        }
      }
    },
    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          env: {
            "NODE_ENV": 'development'
          },
          watch: ['server.js', 'client.js', 'public/build/js/app.js'],
          delay: 0,

          callback: function (nodemon) {
            nodemon.on('log', function (event) {console.log(event.colour);});

            // Open the application in a new browser window and is optional
            //nodemon.on('config:update', function () {setTimeout(function() {require('open')('http://localhost:3090', 'Google Chrome Canary');}, 1000);});

            // Update .rebooted to fire Live-Reload
            nodemon.on('restart', function () {setTimeout(function() {
              require('fs').writeFileSync('.rebooted', 'rebooted');
            }, 500);});
          }
        }
      }
    },

    watch: {
      scss: {
        files: 'public/scss/**/*.scss',
        tasks: ['sass']
      },
      livereload: {
        files: ['public/build/js/app.js', 'public/css/style.css'],
        options: {
          livereload: true,
          debounceDelay: 500,
        }
      }
    },

    watchify: {
      options: {
        keepalive: true,
        callback: function(b) {
          b.transform(require('grunt-react').browserify);
          return b;
        }
      },
      client: {
        src: [
          './client.js',
          './app.js',
          './configs/**/*.js',
          './services/**/*.js',
          './lib/**/*.js',
          './stores/**/*.js',
          './actions/**/*.js',
          './components/**/*.jsx',
          './components/*.jsx'
        ],
        dest: 'public/build/js/app.js'
      }
    },

    // BUILD //

    uglify: {
      options: {
        banner: '/*! Hairfie Website <%= grunt.template.today("yyyy-mm-dd - HH:mm:ss") %> */ '
      },
      build: {
        src: 'public/build/js/app.js',
        dest: 'public/build/js/app.min.js'
      }
    },
    browserify: {
      options: {
        transform: [
          require('grunt-react').browserify,
          envify
        ]
      },
      client: {
        src: 'client.js',
        dest: 'public/build/js/app.js'
      }
    },
    bump: {
      options: {
        pushTo: 'origin'
      }
    }

    // END OF BUILD //

  });

  // Dev tasks
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-watchify');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-bump');

  grunt.registerTask('default', ['concurrent']);

  grunt.registerTask('build', [
    'browserify',
    'uglify'
  ]);
};
