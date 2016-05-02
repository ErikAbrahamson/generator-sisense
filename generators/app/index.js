/* jshint -W097 */
/* jshint node: true */
/* jshint expr: true */

'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var path = require('path');
var stringifyObject = require('stringify-object');
var iconv = require('iconv-lite');

module.exports = yeoman.Base.extend({

    prompting: function() {

        this.parser = function(d) {
            var iso = new RegExp(/(&#34;)/g), apo = '"';
            d.forEach(function(i) {
                for (var p in i ) {
                    if (typeof i[p] === 'object') {
                        i[p].types[0] = i[p].types[0].replace(iso, apo);
                    } else {
                        i[p] = i[p].replace(iso, apo);
                    }
                }
            });
            return d;
        };

        var done = this.async(), panels = [], q = [
            {
                type: 'input',
                name: 'pName',
                message: 'Panel name?',
                default: 'Panel'
            },
            {
                type: 'list',
                name: 'pType',
                choices: ['visible', 'filters'],
                message: 'Panel type?',
                default: [0]
            },
            {
                type: 'list',
                name: 'pTypes',
                choices: ['measures', 'dimensions'],
                message: 'Will the values be dimensions or measures?',
                default: [0]
            },
            {
                type: 'list',
                name: 'pMaxItems',
                choices: ['-1', '0', '1'],
                message: 'Maximum number of items?',
                default: [2]
            },
            {
                type: 'confirm',
                name: 'continue',
                message: 'Add another panel?',
                default: false
            }
        ];

        this.getPanels = function() {
            var panelModel = {
                name: String(undefined),
                type: String(undefined),
                metadata: {
                    types: [],
                    maxitems: undefined
                }
            };
            this.prompt(q, function(answers) {
                panelModel.name = iconv.decode(answers.pName, 'ISO-8859-1');
                panelModel.type = answers.pType;
                panelModel.metadata.types.push(answers.pTypes);
                panelModel.metadata.maxitems = +(answers.pMaxItems);
                this.props = answers;
                panels.push(panelModel);
                this.props.panels = panels;
                this.props.panels  = stringifyObject(
                    this.parser(this.props.panels), {
                        singleQuotes: false
                    });
                answers.continue ? this.getPanels() : done();
            }.bind(this));
        };
        this.getPanels();
    },

    paths: function() {

        var pluginRoot = '/PrismWeb/plugins';
        if (this.destinationPath().indexOf(pluginRoot) >= 0) {
            this.log(chalk.green(
                'You are in the plugins directory'));
        } else {
            this.log(chalk.red(
                'Please remember to put this in your plugins directory'));
        }

        this.fs.copy(
            this.templatePath('_assets/_example.png'),
            this.destinationPath('assets/example.png'));
        this.fs.copy(
            this.templatePath('_directives/_main.js'),
            this.destinationPath('directives/main.js'));
        this.fs.copy(
            this.templatePath('_lib/_underscore.js'),
            this.destinationPath('lib/underscore.js'));
        this.fs.copy(
            this.templatePath('_styles/_main.css'),
            this.destinationPath('styles/main.css'));
        this.fs.copy(
            this.templatePath('_styles/_main.less'),
            this.destinationPath('styles/main.less'));
    },

    writing: {
        config: function() {
            this.fs.copyTpl(
                this.templatePath('_plugin.json'),
                this.destinationPath('plugin.json'), {
                    name: this.props.name
                }
            );
            this.fs.copyTpl(
                this.templatePath('_README.md'),
                this.destinationPath('README.md'), {
                    name: this.props.title
                }
            );
            this.fs.copy(
                this.templatePath('_widget-24.png'),
                this.destinationPath('widget-24.png'));
        }
    },

    app: function() {
        this.fs.copyTpl(
            this.templatePath('_styler.html'),
            this.destinationPath('styler.html'), {
                name: this.props.name
            });
        this.fs.copy(
            this.templatePath('_stylerController.js'),
            this.destinationPath('stylerController.js'));
        this.fs.copyTpl(
            this.templatePath('_widget.js'),
            this.destinationPath('widget.js'), {
                name   : this.props.name,
                family : this.props.family,
                title  : this.props.title,
                panels : this.props.panels
            }
        );
    },

    install: function() {
        this.installDependencies();
        this.log(yosay(
            chalk.yellow('Built boilerplate for ' + this.props.name + '\n') +
            chalk.green('All done!')));
        this.log(chalk.blue(this.props.panels));
        this.log(chalk.blue(this.parser));
    }

});
