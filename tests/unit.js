var fs         = require('fs')
  , should     = require('chai').should()
  , sinon      = require('sinon')
  , path       = require('path')
  , rimraf     = require('rimraf')
  , newCommand = require('../lib/commands/new').newCommand
  , readified_js = require('../lib/commands/server').readified_js;


describe('new', function(){
  after(function(done){
    rimraf('/tmp/test_app', done);
  });


  it('command copies app_template to destination', function(done){
    newCommand({
      author_name: 'Bulkan Evcimen',
      author_email: 'bulkan@gmail.com',
      app_name: 'test app',
      app_path: '/tmp/test_app'
    });

    fs.existsSync('/tmp/test_app').should.be.ok;
    fs.existsSync('/tmp/test_app/app.js').should.be.ok;
    fs.existsSync('/tmp/test_app/app.css').should.be.ok;
    done();
  });

});


describe('server', function() {
  var conf = {
    author_name: 'Bulkan Evcimen',
    author_email: 'bulkan@gmail.com',
    app_name: 'test app',
    app_path: '/tmp/test_app'
  };

  before(function(done){
    newCommand(conf);
    done();
  });

  after(function(done){
    rimraf(conf.app_path, done);
  });

  it('readified_js returns correct app.js', function(done){
    var appjs = readified_js(conf.app_path);
    appjs.should.be.ok;
    done();
  })
});
