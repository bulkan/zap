var async    = require('async')
  , prompt = require('prompt');

/**
 * This function will create the directory structure of the app
 *
 * @param conf Object object containing the 
 */
module.exports.newCommand = function(conf){
}

/**
 * Called from commander.js when the command is `new`
 */
module.exports = function(){
  var app = {};
  prompt.message = prompt.delimiter = '';
  prompt.start();
  prompt.get([
    { 
      name: 'author',
      description: "Enter this app author's name:",
      required: true
    },
    {
      name: 'email',
      format: 'email',
      description: "Enter this app author's email:",
      message: 'Must be a valid email address',
      required: true
    },
    {
      name: 'name',
      description: "Enter a name for this new app:",
      required: true
    },
    {
      name: 'app_path',
      description: "Enter a directory name to save the new app (will create the dir if it does not exist, default to current dir):",
      default: '.'
    }
  ], function(err, result){
    if (err) return console.error(err);
    console.log(result.name);
  });
}
