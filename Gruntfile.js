/* globals module:true */

module.exports = function(grunt) {

    'use strict';

    grunt.initConfig({
        jshint: {
            options: {
                esnext: true,
                moz: true,
                globals: {
                    jQuery: true
                }
            },
            all: ['Gruntfile.js', 'js/*.js', 'mobile/js/*.js', 'tests/lib/*.js']
        },
        qunit: {
            all: {
                options: {
                    urls: [
                        'http://localhost:9000/tests/unit.html',
                        'http://localhost:9000/tests/unit_v4.html',
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

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('default', ['jshint', 'connect', 'qunit']);
};
