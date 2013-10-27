var async  = require('async')
  , path   = require('path')
  , prompt = require('prompt')
  , ejs    = require('ejs')
  //, fs   = require('fs-extra');
  , fs     = require('fs');


/**
 * This function will create the directory structure of the app
 *
 * @param conf Object object containing the 
 */
var newCommand = function(conf){
  // create destination if it doesnt exist
  if (fs.existsSync(conf.app_path)){
    var app_template = path.resolve(path.join(__dirname, '../app_template'));

    fs.readdirSync(app_template).forEach(function(file){
      var dest = path.join(conf.app_path, file);

      // file is template
      if (file.match(/.*\.tt/)){
        var content = fs.readFileSync(path.join(app_template, file));
        dest = path.join(conf.app_path, file.replace('.tt', ''));
      }

      console.log('\t create', dest);
    });
  }
}

module.exports.newCommand;

newCommand({app_path: '.'});

/**
 * Called from commander.js when the command is `new`
 */
module.exports = function(){
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

    newCommand(result);
  });
}
