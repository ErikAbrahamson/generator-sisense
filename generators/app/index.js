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

module.exports = yeoman.Base.extend({

    prompting: function() {

        this.log(
            chalk.yellow('Welcome to the Sisense Widget Generator!'));
        this.log(
            chalk.cyan('Let\'s begin by adding your panels'));

        var done = this.async(), panels = [], q = [
            {
                type: 'input',
                name: 'pName',
                message: chalk.cyan('Panel name?'),
                default: 'Panel'
            },
            {
                type: 'list',
                name: 'pType',
                choices: ['visible', 'filters'],
                message: chalk.cyan('Panel type?'),
                default: [0]
            },
            {
                type: 'list',
                name: 'pTypes',
                choices: ['measures', 'dimensions'],
                message: chalk.cyan('Will the values be dimensions or measures?'),
                default: [0]
            },
            {
                type: 'list',
                name: 'pMaxItems',
                choices: ['-1', '0', '1'],
                message: chalk.cyan('Maximum number of items?'),
                default: [2]
            },
            {
                type: 'confirm',
                name: 'continue',
                message: chalk.cyan('Add another panel?'),
                default: false
            }
        ];

        this.getProps = function() {
            this.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: chalk.magenta('Widget Name? (camelCase)'),
                    default: 'newWidget'
                },
                {
                    type: 'list',
                    name: 'family',
                    message: chalk.magenta('Viz family?'),
                    choices: ['d3', 'Highcharts'],
                    default: this.appname
                },
                {
                    type: 'input',
                    name: 'title',
                    message: chalk.magenta('Widget title?'),
                    default: this.appname
                }
            ], function(answers) {
                this.props.name = answers.name;
                this.props.family = answers.family;
                this.props.title = answers.title;
                done();
            }.bind(this));
        };

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
                panelModel.name = answers.pName;
                panelModel.type = answers.pType;
                panelModel.metadata.types.push(answers.pTypes);
                panelModel.metadata.maxitems = +(answers.pMaxItems);
                this.props = answers;
                panels.push(panelModel);
                this.props.panels = panels;
                this.props.panels  = stringifyObject(
                    this.props.panels, {
                        singleQuotes: false
                    });
                answers.continue ? this.getPanels() : this.getProps();
            }.bind(this));
        };
        this.getPanels();
    },

    paths: function() {

        var pluginRoot = '/PrismWeb/plugins';
        if (this.destinationPath().indexOf(pluginRoot) >= 0) {
            this.log(chalk.cyan(
                'You are in the plugins directory'));
        } else {
            this.log(chalk.red.bgBlack.bold(
                '!!! Please remember to put this in your plugins directory !!!'));
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
                panels : this.props.panels,
            }
        );
    },

    install: function() {
        // this.installDependencies();
        this.log(yosay(
            chalk.yellow('Built boilerplate for ' + chalk.inverse.bold(this.props.title) + '\n') +
            chalk.green('All done!')));
    }
});
