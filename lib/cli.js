#!/usr/bin/env node

var program  = require('commander')
  , async    = require('async')
  , promptly = require('promptly');


program
  .version('0.0.1');

program
  .command('new')
  .description('create a new Zendesk app folder')
  .action(function(env){
    var app = {};

    async.series([
      
      function(callback) {
        promptly.prompt("Enter this app author's name:", function(err, name){
          console.log(name);
          app.author = name;

          callback(null, name)
        })
      },

      function(callback) {
        promptly.prompt("Enter this app author's email:", function(err, email){
          console.log(email);
          app.email = email;
          callback(null, email)
        })
      },

      function(callback){ 
        promptly.prompt("Enter a name for this new app:", function(err, name){
          console.log(name);
          app.name = name;
          callback(null, name)
        })
      },
      
      function(callback){
        promptly.prompt("Enter a directory name to save the new app (will create the dir if it does not exist, default to current dir):", function(err, dirname){
          console.log(dirname);
          app.dirname = dirname;
        })
      }
    ])
  });


program
  .command('validate')
  .description('Validate the app.')
  .option('-p', '--path <app_path>', 'Validate the app.')
  .action(function(cmd, options){
    console.log(options);
  });


program
  .command('*')
  .action(function(env){
    console.log('unknown command');
    console.log(this.usage());
  });


module.exports = program;
