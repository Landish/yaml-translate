var fs = require('fs-extra');
var yaml = require('yamljs');
var colors = require('colors');
var globby = require('globby');
var _ = require('underscore');
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

const PLUGIN_NAME = 'yaml-translate';

function Translate() {

    var self = this;
    this.data = {};

    this.setOptions = function(options) {

        options = _.isObject(options) ? options : {};

        // options
        this.options = _.defaults(options, {
            src: ['language/*.{yml, yaml}'],
            outputDir: 'locale',
            clean: false,
            only: [], // string or array
            except: [] // string or array
        });

        try {

            _.each(globby.sync(this.options.src), function(i) {
                self.data = _.extend(yaml.load(i), self.data);
            });


        } catch(e) {
            console.log(colors.red(e.message));
        }

    };

    this.translate = function(options) {

        self.setOptions(options);

        self.getLangKeys(self.data).forEach(function(lang) {
            var data = self.getTranslatedStringByLangKey(self.data, lang);

            if(self.options.clean) {
                fs.removeSync(self.options.outputDir);
            }

            self.saveToFile(self.options.outputDir + '/'+ lang +'.json', JSON.stringify(data, null, 4));
        });
    };

    this.getLangKeys = function(array) {
        var languages = [];
        var keys = _.keys(array);
        keys.forEach(function(key) {
            var keys = _.keys(array[key]);
            keys.forEach(function(lang) {
                languages.push(lang);
            });
        });

        languages = _.unique(languages);

        // check if options.only exists
        if(this.options.only.length) {
            return _.isArray(this.options.only) ? this.options.only : [this.options.only];
        }

        // check if options.except exists
        if(this.options.except.length) {
            return _.difference(languages, (_.isArray(this.options.except) ? this.options.except : [this.options.except]));
        }

        return languages;
    };

    this.transStringByLangKey = function(obj, lang) {
        return _.isUndefined(obj[lang]) ? _.first(_.toArray(obj)) : obj[lang];
    };

    this.getTranslatedStringByLangKey = function(array, lang) {
        var strings = {};
        var keys = _.keys(array);
        keys.forEach(function(key) {
            strings[key] = self.transStringByLangKey(array[key], lang);
        });

        return strings;
    };

    this.saveToFile = function(filename, data) {

        fs.outputFile(filename, data, function(err) {
            if(err) {
                console.log(colors.red(err));
            } else {

                fs.stat(filename, function(err, stat) {
                    if(err) {
                        console.log(colors.red(err));
                    }
                    console.log(colors.green("Translated data saved to " + colors.cyan(filename) + ' file [' + stat.size + ' Bytes].'));
                });

            }
        });
    };


    // Creating a stream through which each file will pass
    return through.obj(function(file, enc, cb) {

        if (file.isNull()) return cb(null, file);
        if (file.isStream()) return cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));

        self.translate(self.options);


        cb(null, file);

    });

}

// export to module
module.exports = Translate;