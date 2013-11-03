var fs         = require('fs')
  , async      = require('async')
  , should     = require('chai').should()
  , sinon      = require('sinon')
  , path       = require('path')
  , mkdirp     = require('mkdirp')
  , rimraf     = require('rimraf')
  , newCommand = require('../lib/commands/new').newCommand
  , readified_js = require('../lib/commands/server').readified_js;


describe('new', function(){
  
  after(function(done){
    async.parallel([
      function(cb) {
        rimraf('/tmp/test_app', cb);
      },
      function(cb){
        rimraf('/tmp/zapt', cb);
      }
    ], done);
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


  it('command uses creates files into cwd', function(done){
    var cwd = process.cwd();
    mkdirp.sync('/tmp/zapt');
    process.chdir('/tmp/zapt');

    newCommand({
      author_name: 'Bulkan Evcimen',
      author_email: 'bulkan@gmail.com',
      app_name: 'test app',
      app_path: '.'
    });

    fs.existsSync('/tmp/test_app/app.js').should.be.ok;
    fs.existsSync('/tmp/test_app/app.css').should.be.ok;
    process.chdir(cwd);
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

  it('readified_js has values from settings', function(done){
    var appjs = readified_js(conf.app_path);
    appjs.should.be.ok;
    appjs.should.match(/name: "Bulkan Evcimen"/);
    appjs.should.match(/email: "bulkan@gmail.com"/);
    done();
  });
});



describe('validate', function() {
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

  describe('manifest file is validated', function(){

    it('finds missing manifest');

    it('locale is valid /^[a-z]{2,3}$/');
    it('there is a locale.json translation file');

  });

})
