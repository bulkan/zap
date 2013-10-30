var async  = require('async')
  , path   = require('path')
  , prompt = require('prompt')
  , ejs    = require('ejs')
  , colors = require('colors')
  , fs     = require('fs-extra');


/**
 * This function will create the directory structure of the app
 *
 * @param conf Object object containing the
 */
var newCommand = function(conf){
  // create destination if it doesnt exist
  var app_template = path.resolve(path.join(__dirname, '../app_template'));

  fs.readdirSync(app_template).forEach(function(file){
    //if (file.match(/^\..*$/)) return;

    var dest = path.join(conf.app_path, file)
      , src = path.join(app_template, file)
      , content;

    // file is template
    if (file.match(/.*\.tt$/)){
      var template = fs.readFileSync(src, 'utf8');
      dest = path.join(conf.app_path, file.replace('.tt', ''));
      content = ejs.render(template, conf);
    }

    if (content) {
      fs.outputFileSync(dest, content);
    } else {
      fs.copySync(src, dest);
    }

    console.log('\t create'.green, dest);
  });
}

module.exports.newCommand = newCommand;


/**
 * Called from commander.js when the command is `new`
 */
module.exports.command = function(){
  prompt.message = prompt.delimiter = '';

  prompt.start();
  prompt.get([
    {
      name: 'author_name',
      description: "Enter this app author's name:",
      required: true
    },
    {
      name: 'author_email',
      format: 'email',
      description: "Enter this app author's email:",
      message: 'Must be a valid email address',
      required: true
    },
    {
      name: 'app_name',
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
