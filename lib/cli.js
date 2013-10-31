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
  .description('validate the app.')
  .option('-p, --path <path>', 'validate the app.')
  .action(commands.validate);

program
  .command('server')
  .description('Serve the app.')
  .option('-p, --path <path>', 'Serve the app.')
  .action(commands.server);

program.parse(process.argv);

if (program.rawArgs.length < 3) program.help();

module.exports = program;
