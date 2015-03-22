module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Check the code
    jshint: {
      files: ['Gruntfile.js', 'src/js/*.js', 'easylearn/www/js/index.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          console: true,
          module: true,
        }
      }
    },

    // Compile all javascript file into a single one
    concat: {
      js: {
        src: 'src/js/*.js',
        dest: 'easylearn/www/js/index.js'
      }
    },
    exec: {
      init_cordova_project: {
        cmd: 'cordova create easylearn ntou.cs.easylearn EasyLearn && cd easylearn && cordova platform add android && cd ..'
      },
      run: {
        cmd: 'cd easylearn && cordova run android && cd ..'
      }
    },
    clean: {
      build: 'easylearn/www/*'
    },
    copy: {
      main: {
        expand: true,
        cwd: 'src/',
        src: ['*', 'css/*', 'img/*', 'lib/**'],
        dest: 'easylearn/www/',
      }
    },
    watch: {
      copy: {
        files: ['src/**'],
        tasks: ['clean', 'copy', 'concat', 'jshint'],
        options: {
          spawn: false,
        },
      },
    },
  });

  // load plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['copy', 'concat', 'jshint']);
  grunt.registerTask('run', ['exec:run']);
  grunt.registerTask('hint', 'jshint');
  grunt.registerTask('cp', 'copy:main');
  grunt.registerTask('sy', 'sync');
};
