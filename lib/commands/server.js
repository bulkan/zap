var fs = require('fs')
  , path = require('path')
  , rework = require('rework')
  , ejs = require('ejs')
  , express = require('express');


function parseManifest(manifest_path){
  if (!fs.existsSync(manifest_path)) return console.error(manifest_path + " does not exist");
  var manifest = fs.readFileSync(manifest_path, 'utf8');
  return JSON.parse(manifest);
}

function compileTemplates(templates_path) {
  var files = fs.readdirSync(templates_path);
  var templates = {};
  files.forEach(function(file){
    var name = file.split('.')[0];
    templates[name] = fs.readFileSync(path.join(templates_path, file), 'utf8');
  });

  return templates;
}


module.exports = function(app_path){
  if (!app_path) return;

  if (!fs.existsSync(app_path)) return console.error(app_path + " does not exist");

  var manifest = parseManifest(path.join(app_path, 'manifest.json'))
    , name = manifest.name || 'Local App'
    , location = manifest.location
    , translations = JSON.parse(fs.readFileSync(path.join(app_path, 'translations', 'en.json'), 'utf8'))
    , framework_version = manifest.frameworkVersion
    // hardcoding for the moment
    , app_id = 0
    , app_class_name = "app-" + app_id
    , templates = compileTemplates(path.join(app_path, 'templates'))
    , default_styles = fs.readFileSync(path.join(__dirname, 'assets', 'default_styles.css'), 'utf8')
    , css_file = path.join(app_path, 'app.css');

  // TODO: prompt user for settings
  var settings = {'title': name};

  if (fs.existsSync(css_file))
    default_styles += fs.readFileSync(css_file);

  var css = rework(default_styles).use(rework.prefixSelectors(app_class_name)).toString();

  var src_templ = fs.readFileSync(path.join(__dirname, 'assets', 'src.ejs'), 'utf8')
    , appjs = ejs.render(src_templ, {
      name: name,
      source: fs.readFileSync(path.join(app_path, 'app.js'), 'utf8'),
      location: location,
      asset_url_prefix: '',
      app_class_name: app_class_name,
      author: manifest.author,
      translations: translations,
      framework_version: framework_version,
      templates: templates,
      settings: settings,
      app_id: app_id
    });

  var app = express();

  app.get('/app.js', function(req, res){
    console.log('GET /app.js');
    res.set('Content-Type', 'text/javascript');
    res.send(appjs);
  });

  app.listen(4567,  function(){
    console.log('listening');
  });

}
