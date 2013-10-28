var child_process = require('child_process')
  , should        = require('chai').should()
  , sinon         = require('sinon')
  , path = require('path');


var zapt = path.normalize(path.resolve(path.join(__dirname, '../bin/zapt')));

describe('default zat interface', function(){
  it('no arguments should show help', function(done){
    child_process.exec(zapt, function(error, stdout, stderr){
      if (error) return done(error);
      stdout.should.match(/Usage/);
      done();
    });
  });
});
