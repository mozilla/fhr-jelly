module.exports = function(grunt) {

    grunt.initConfig({
        qunit: {
            all: {
                options: {
                    urls: [
                        'http://localhost:9000/tests/unit.html'
                    ]
                }
            }
        },
        connect: {
            server: {
                options: {
                    port:9000,
                    base: '.'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('test', ['connect', 'qunit']);
};
