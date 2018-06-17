'use strict'
var yeoman = require('yeoman-generator')
var chalk = require('chalk')
var yosay = require('yosay')
var _ = require('underscore.string')

module.exports = yeoman.Base.extend({

  prompting: function () {
    var done = this.async()

    this.log(yosay(
      'You\'re about to start your new Electron application with ' + chalk.red('generator-electron-app') + ' generator!'
    ))

    var prompts = [{
      name: 'name',
      message: 'What is the name of your app?',
      validate: function (value) {
        return value.length > 0 ? true : 'You have to provide application name'
      }
    }, {
      type: 'confirm',
      name: 'coffee',
      message: 'Do you want to use CoffeeScript?',
      default: true
    }, {
      type: 'confirm',
      name: 'sass',
      message: 'Do you want to use Sass?',
      default: true
    }, {
      type: 'list',
      name: 'templating',
      message: 'Choose your template engine:',
      choices: [{
        name: 'None',
        value: 'none'
      }, {
        name: 'Handlebars',
        value: 'handlebars'
      }],
      default: 1
    }, {
      type: 'list',
      name: 'testing',
      message: 'Choose your testing framework:',
      choices: [{
        name: 'None',
        value: 'none'
      }, {
        name: 'Jasmine',
        value: 'jasmine'
      }],
      default: 1
    }, {
      type: 'checkbox',
      name: 'platforms',
      message: 'Which platforms do you want to target?',
      choices: [{
        name: 'Mac Os',
        value: "darwin-x64"
      }, {
        name: 'Windows x32',
        value: "win32"
      }, {
        name: 'Windows x64',
        value: "win64-64"
      }, {
        name: 'Linux x32',
        value: "linux-ia32"
      }, {
        name: 'Linux x64',
        value: "linux-x64"
      }],
      validate: function (value) {
        return value.length > 0 ? true : 'You have to specify at least one platform'
      }
    }]

    this.prompt(prompts, function (props) {
      this.props = props
      this.platforms = '[\'' + this.props.platforms.join('\', \'') + '\']'
      this.jsExtension = props.coffee ? '.coffee' : '.js'
      this.cssExtension = props.sass ? '.sass' : '.css'
      this.handlebars = props.templating === 'handlebars'
      this.jasmine = props.testing === 'jasmine'
      this.username = this.user.git.name()
      this.email = this.user.git.email()
      done()
    }.bind(this))
  },

  writing: function () {
    this.fs.copyTpl(
      this.templatePath('package/dev_package.json'),
      this.destinationPath('package.json'),
      { name: this.props.name, platforms: this.platforms, handlebars: this.handlebars, jasmine: this.jasmine }
    )
    this.fs.copyTpl(
      this.templatePath('package/production_package.json'),
      this.destinationPath('app/package.json'),
      { name: this.props.name }
    )
    this.fs.copyTpl(
      this.templatePath('_bower.json'),
      this.destinationPath('bower.json'),
      { name: this.props.name, handlebars: this.handlebars }
    )
    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore')
    )
    this.fs.copy(
      this.templatePath('editorconfig'),
      this.destinationPath('.editorconfig')
    )
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('app/index.html'),
      { handlebars: this.handlebars }
    )
    this.fs.copy(
      this.templatePath('javascripts/index' + this.jsExtension),
      this.destinationPath('app/index' + this.jsExtension)
    )
    this.fs.copy(
      this.templatePath('javascripts/application' + this.jsExtension),
      this.destinationPath('app/javascripts/application' + this.jsExtension)
    )
    this.fs.copy(
      this.templatePath('stylesheets/application' + this.cssExtension),
      this.destinationPath('app/stylesheets/application' + this.cssExtension)
    )
    this.fs.copy(
      this.templatePath('images/electron.icns'),
      this.destinationPath('app/images/electron.icns')
    )
    this.fs.copy(
      this.templatePath('images/electron.ico'),
      this.destinationPath('app/images/electron.ico')
    )
    this.fs.copy(
      this.templatePath('images/electron.png'),
      this.destinationPath('app/images/electron.png')
    )
    this.fs.copyTpl(
      this.templatePath('license'),
      this.destinationPath('LICENSE'),
      { name: this.username, email: this.email }
    )
    this.fs.copyTpl(
      this.templatePath('readme'),
      this.destinationPath('README.md'),
      { name: _.classify(this.props.name), username: this.username, email: this.email }
    )
    this.fs.copyTpl(
      this.templatePath('javascripts/gulpfile' + this.jsExtension),
      this.destinationPath('gulpfile' + this.jsExtension),
      {
        name: _.classify(this.props.name),
        handlebars: this.handlebars,
        jasmine: this.jasmine,
        contents: '<%= contents %>'
      }
    )
  },

  install: function () {
    this.installDependencies()
  }
})
