'use strict'
var yeoman = require('yeoman-generator')
var chalk = require('chalk')
var yosay = require('yosay')

module.exports = yeoman.Base.extend({

  prompting: function () {
    var done = this.async()

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the legendary ' + chalk.red('generator-electron-app') + ' generator!'
    ))

    var prompts = [{
      name: 'name',
      message: 'What is the name of your app?'
    }]

    this.prompt(prompts, function (props) {
      this.props = props
      // To access props later use this.props.someAnswer

      done()
    }.bind(this))
  },

  writing: function () {
    console.log(this.props)
    this.fs.copy(
      this.templatePath('_package.json'),
      this.destinationPath('package.json')
    )
    this.fs.copy(
      this.templatePath('_bower.json'),
      this.destinationPath('bower.json')
    )
  },

  install: function () {
    this.installDependencies()
  }
})
