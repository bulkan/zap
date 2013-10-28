var fs         = require('fs')
  , should     = require('chai').should()
  , sinon      = require('sinon')
  , path       = require('path')
  , newCommand = require('../lib/commands/new').newCommand;


describe('new', function(){
  it('command copies app_template to destination', function(done){
    newCommand({
      author_name: 'Bulkan Evcimen',
      author_email: 'bulkan@gmail.com',
      app_name: 'test app',
      app_path: '/tmp/test_app'
    });

    fs.existsSync('/tmp/test_app').should.be.ok;
    done();
  });
});
