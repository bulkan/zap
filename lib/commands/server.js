var fs = require('fs')
  , path = require('path');

// read manifest file
// read app.js
// get app name
// get app location 
// ... 
// compile templates
// replace values in a SRC_TEMPLATE


function parseManifest(manifest_path){
  if (!fs.existsSync(manifest_path)) return console.error(manifest_path + " does not exist");
  var manifest = fs.readFileSync(manifest_path);
  return JSON.parse(manifest);
}

function compileTemplates(templates_path) {
  return '';
}


module.exports = function(app_path){
  if (!app_path) return;

  if (!fs.existsSync(app_path)) return console.error(app_path + " does not exist");

  var manifest = parseManifest(path.join(app_path, 'manifest.json'));
  var app_name = manifest.name || 'Local App';
  var location = manifest.location;

  var translations = JSON.parse(fs.readFileSync(path.join(app_path, 'translations', 'en.json')));
  var framework_version = manifest.frameworkVersion;

  // hardcoding for the moment
  var app_class_name = "app-0";

  templates = compileTemplates(path.join(app_path, 'templates'));
}
