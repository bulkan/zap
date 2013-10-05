#!/usr/bin/env node

var program  = require('commander')
  , commands = require('./commands');

program
  .version('0.0.1');

program
  .command('new')
  .description('create a new Zendesk app folder')
  .action(commands.new);

program
  .command('validate')
  .description('Validate the app.')
  .option('-p', '--path <app_path>', 'Validate the app.')
  .action(commands.validate);

program
  .command('*')
  .action(function(env){
    console.log('unknown command');
    console.log(this.usage());
  });

module.exports = program;
