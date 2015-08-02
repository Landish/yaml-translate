var fs = require('fs-extra');
var yaml = require('yamljs');
var colors = require('colors');
var _ = require('underscore');

function Translate(options) {


    this.setOptions = function(options) {

        options = _.isObject(options) ? options : {};

        // options
        this.options = _.defaults(options, {
            src: './language.yml',
            outputDir: 'locale',
            clean: false,
            only: [], // string or array
            except: [] // string or array
        });

        try {
            this.src = yaml.load(this.options.src);
        } catch(e) {
            console.log(colors.red(e.message));
        }

    };

    this.translate = function(options) {

        var self = this;
        self.setOptions(options);

        self.getLangKeys(self.src).forEach(function(lang) {
            var data = self.getTranslatedStringByLangKey(self.src, lang);

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
        var self = this;
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

}

// export to module
module.exports = new Translate;