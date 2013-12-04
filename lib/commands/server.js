var fs             = require('fs')
  , util           = require('util')
  , path           = require('path')
  , rework         = require('rework')
  , ejs            = require('ejs')
  , colors         = require('colors')
  , express        = require('express')
  , yaml           = require('js-yaml')
  , sass_functions = require('./sass_functions');

/**
 * JSON parses the manifest.json file if it exists
 */
function parseManifest(manifest_path){
  if (!fs.existsSync(manifest_path)) return console.error(manifest_path + " does not exist");
  var manifest = fs.readFileSync(manifest_path, 'utf8');
  return JSON.parse(manifest);
}


/**
 * YAML parses the settings.yml file if it exists
 */
function parseSettings(settings_path) {
  if (!fs.existsSync(settings_path)) return;
  var settings = require(settings_path);
  return settings;
}


/**
 * Loades all hdsb files in `templates_path` and concatenates them into
 * one string
 *
 * @param templates_path String path to the template directory
 */
function compileTemplates(templates_path) {
  var files = fs.readdirSync(templates_path);
  var templates = {};
  files.forEach(function(file){
    var name = file.split('.')[0];
    var template = fs.readFileSync(path.join(templates_path, file), 'utf8');
    templates[name] = template;
  });

  return templates;
}

/**
 * Creates the app.js file
 *
 * @param app_path String path to the directory containing the Zendesk app
 * @returns appjs String return app.js
 */
function readified_js(app_path, id){
  if (!app_path) return;

  if (!fs.existsSync(app_path)) return console.error(app_path + " does not exist");
  
  var parentDir = path.resolve(app_path + '/..');

  var manifest = parseManifest(path.join(app_path, 'manifest.json'))
    , settings = parseSettings(path.join(app_path, 'settings.yml')) || parseSettings(path.join(parentDir, 'settings.yml')) || {'title': name}
    , name = manifest.name || 'Local App'
    , location = manifest.location
    , translations = JSON.parse(fs.readFileSync(path.join(app_path, 'translations', 'en.json'), 'utf8'))
    , framework_version = manifest.frameworkVersion
    , asset_url_prefix = 'http://localhost:4567/'
    // hardcoding for the moment
    , app_id = id || 0
    , app_class_name = util.format("app-%d", app_id)
    , default_styles = fs.readFileSync(path.join(__dirname, 'assets', 'default_styles.css'), 'utf8')
    , css_file = path.join(app_path, 'app.css');

  

  // TODO: prompt user for settings if no settings.yml exists

  if (manifest.parameters){
    manifest.parameters.forEach(function(param){
      if (param.required && typeof settings[param.name] === 'undefined' && !param.default) console.warn('Setting ' + param.name +' not defined'); 
      if (param.default) settings[param.name] = param.default;
    });
  }

  if (fs.existsSync(css_file))
    default_styles += fs.readFileSync(css_file, 'utf8');

  var css = rework(default_styles)
    .use(rework.function({
      "app-asset-url": function(asset){
        return sass_functions.app_asset_url(asset_url_prefix, asset);
      }
    }))
    .use(rework.prefixSelectors(util.format(".%s", app_class_name)))
    .toString();
  var templates = compileTemplates(path.join(app_path, 'templates'));
  templates.layout = util.format('<style>\n%s</style>\n%s', css, templates.layout);

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

module.exports.readified_js = readified_js;


module.exports.command = function(env){
  var app_path = env.path || '.';

  process.title = 'zapt';

  var app = express();
  app.use(express.compress());

  app.get('/app.js', function(req, res){
    console.log((new Date()).toString().grey + ' - GET '.green + req.originalUrl);
    res.set('Content-Type', 'text/javascript; charset=utf8');
    res.send(readified_js(app_path));
  });

  app.get('*', function(req, res){
    console.log((new Date()).toString().grey + ' - GET '.green + req.originalUrl);
    if (req.path && req.path.match(/png/) ){
      var p = path.join(app_path, 'assets', req.path);
      if (fs.existsSync(p)){
        return fs.createReadStream(p).pipe(res);
      }
      res.send(404);
    }
  });

  app.listen(4567,  function(){
    console.log('listening');
  });

}
