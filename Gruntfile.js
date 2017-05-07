module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-browserify');

  // if you simply run 'grunt' these default tasks will execute, IN THE ORDER THEY APPEAR!
  grunt.registerTask('default', ['clean', 'babel', 'browserify', 'ngtemplates', 'concat', 'cssmin', 'copy']);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      options: {
        force: true, // danger will robinson!
      },
      target: {
        files: [{
          expand: true,
          cwd: './www/',
          src: ['js/**', 'css/**', 'index.html'],
        }]
      }
    },

    // https://babeljs.io/docs/usage/api/#options
    babel: {
      options: {
        comments: false,
        compact: true,
        sourceMaps: true,
        minified: false,
        presets: ['es2015'],
        plugins: ['angularjs-annotate']
      },
      dist: {
        src: ['./src/js/ngbp.js', './src/js/**/*.js', './src/components/**/*.js'],
        dest: './tmp/ngbp.annotated.js'
      }
    },

    // https://github.com/jmreidy/grunt-browserify
    browserify: {
      ngbp: {
        src: ['./tmp/ngbp.annotated.js'],
        dest: './tmp/ngbp.browserified.js',
        options: {
          require: ['angular'],
        }
      }
    },

    // https://github.com/ericclemmons/grunt-angular-templates/blob/master/README.md
    ngtemplates:  {
      'ngbp': {
        cwd: 'src',
        src: [
          'components/**/*.html'
        ],
        dest: './tmp/ngbp.components.min.js',
        options: {
          standalone: false,
          prefix: '/',
          htmlmin: { // NOTE: disable this if anything breaks
            collapseWhitespace:             true,
            removeRedundantAttributes:      true,
            removeScriptTypeAttributes:     true,
            removeStyleLinkTypeAttributes:  true,
            keepClosingSlash:               true // needed for SVGs
          }
        }
      }
    },

    concat: {
      'ngbp': {
        // grab the babel'd app and compiled templates
        src: ['./tmp/ngbp.browserified.js', '<%= ngtemplates.ngbp.dest %>'],
        dest: './tmp/ngbp.min.js'
      }
    },

    /* (dest : src) */
    cssmin: {
      compress: {
        files: {
          './tmp/ngbp.min.css': ['./src/css/ngbp.css']
        }
      }
    },

    copy: {
      idx: {
        files: [
          {
            expand: false,
            src: ['./src/index.html'],
            dest: './www/index.html',
            filter: 'isFile'
          }
        ]
      },
      js: {
        files: [
          {
            expand: true,
            flatten: true,
            src: [
              'tmp/ngbp.min.js',
              'tmp/ngbp.annotated.js.map',
              'node_modules/angular-websocket/dist/angular-websocket.min.js',
              'node_modules/lodash/lodash.min.js'
            ],
            dest: './www/js/',
            filter: 'isFile'
          }
        ]
      },
      css: {
        files: [
          {
            expand: true,
            flatten: true,
            src: ['tmp/ngbp.min.css'],
            dest: './www/css/',
            filter: 'isFile'
          }
        ]
      }
    },

    watch: {
      everything: {
        files: "<%= './src/**/*' %>",
        tasks: ['default']
      },
    }
  });
};
