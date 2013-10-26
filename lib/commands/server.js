var fs             = require('fs')
  , util           = require('util')
  , path           = require('path')
  , rework         = require('rework')
  , ejs            = require('ejs')
  , express        = require('express')
  , sass_functions = require('./sass_functions');


function parseManifest(manifest_path){
  if (!fs.existsSync(manifest_path)) return console.error(manifest_path + " does not exist");
  var manifest = fs.readFileSync(manifest_path, 'utf8');
  return JSON.parse(manifest);
}

function compileTemplates(templates_path, css) {
  var files = fs.readdirSync(templates_path);
  var templates = {};
  files.forEach(function(file){
    var name = file.split('.')[0];
    var template = fs.readFileSync(path.join(templates_path, file), 'utf8');
    if (name === 'layout') {
      template = util.format('<style>\n%s</style>\n%s', css, template);
    }
    templates[name] = template;
  });

  return templates;
}

function readified_js(app_path){
  if (!app_path) return;

  if (!fs.existsSync(app_path)) return console.error(app_path + " does not exist");

  var manifest = parseManifest(path.join(app_path, 'manifest.json'))
    , name = manifest.name || 'Local App'
    , location = manifest.location
    , translations = JSON.parse(fs.readFileSync(path.join(app_path, 'translations', 'en.json'), 'utf8'))
    , framework_version = manifest.frameworkVersion
    , asset_url_prefix = 'http://localhost:4567/'
    // hardcoding for the moment
    , app_id = 0
    , app_class_name = util.format("app-%d", app_id)
    , default_styles = fs.readFileSync(path.join(__dirname, 'assets', 'default_styles.css'), 'utf8')
    , css_file = path.join(app_path, 'app.css');

  // TODO: prompt user for settings
  var settings = {'title': name};

  manifest.parameters.forEach(function(param){
    if (param.default) settings[param.name] = param.default;
  });

  if (fs.existsSync(css_file))
    default_styles += fs.readFileSync(css_file);

  var css = rework(default_styles)
    .use(rework.function({
      "app-asset-url": function(asset){
        return sass_functions.app_asset_url(asset_url_prefix, asset);
      }
    }))
    .use(rework.prefixSelectors(util.format(".%s", app_class_name)))
    .toString();
  var templates = compileTemplates(path.join(app_path, 'templates'), css);

  var src_templ = fs.readFileSync(path.join(__dirname, 'assets', 'src.ejs'), 'utf8')
    , appjs = ejs.render(src_templ, {
      name: name,
      source: fs.readFileSync(path.join(app_path, 'app.js'), 'utf8'),
      location: location,
      asset_url_prefix: asset_url_prefix,
      app_class_name: app_class_name,
      author: manifest.author,
      translations: translations,
      framework_version: framework_version,
      templates: templates,
      settings: settings,
      app_id: app_id
    });

    return appjs;

};


module.exports = function(app_path){
  var app = express();

  app.get('/app.js', function(req, res){
    console.log('GET /app.js');
    res.set('Content-Type', 'text/javascript');
    res.send(readified_js(app_path));
  });

  app.listen(4567,  function(){
    console.log('listening');
  });

}
