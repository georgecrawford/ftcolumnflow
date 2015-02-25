module.exports = function(grunt) {

  grunt.initConfig({
    buster: {
      all: {
        test: {
          config: 'test/buster.js',
          // reporter: 'specification'
        },
        server: {
          port: 1111
        }
      },
      manual: {
        test: {
          config: 'test/buster.js',
          // reporter: 'specification',
          'static-paths': true
        },
        server: {
          port: 1112
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-buster');
  grunt.registerTask('test', ['buster:all']);
  grunt.registerTask('server-only', ['buster:manual:server:block']);
  grunt.registerTask('tests-only', ['buster:manual:test']);
};