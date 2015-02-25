module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Check the code
        jshint: {
            files: ['Gruntfile.js', 'src/js/appli.js'],
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
                src: ['src/js/appli.js'],
                dest: 'HelloWorld/www/<%= pkg.name %>.min.js'
            }
        },
        exec: {
            init_cordova_project: {
                cmd: 'cordova create easylearn ntou.cs.easylearn EasyLearn && cd easylearn && cordova platform add android && cd ..'
            }
        }
    });

    // load plugins
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('default', ['jshint', 'concat']);
    grunt.registerTask('cordova', 'exec:init_cordova_project');
};
