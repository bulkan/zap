var newCommand = require('../lib/commands/new').newCommand;

describe('default zap interface', function(){
  it('new', function(done) {
    newCommand();
    done();
  })
});
