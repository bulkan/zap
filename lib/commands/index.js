module.exports = {
  'new': require('./new').cli,
  'validate': require('./validate'),
  'server': require('./server').command
};
