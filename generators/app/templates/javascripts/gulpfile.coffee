require 'coffee-script/register'

gulp = require('gulp')
del = require('del')
runSequence = require('run-sequence')
gulpLoadPlugins = require('gulp-load-plugins')
packageJSON = require('./package.json')
$ = gulpLoadPlugins()

gulp.task 'images', ->
  gulp.src('app/images/**/*')
    .pipe gulp.dest('./dist/images')

gulp.task 'html', ->
  gulp.src('app/*.html')
    .pipe($.wiredep())
    .pipe($.useref())
    .pipe(gulp.dest('dist'))
<% if (handlebars) {%>
gulp.task 'templates', ->
  gulp.src('app/templates/*.hbs')
    .pipe($.handlebars(handlebars: require('handlebars')))
    .pipe($.wrap('Handlebars.template(<%- contents %>)'))
    .pipe($.declare(
      namespace: '<%= name %>.templates'
      noRedeclare: true))
    .pipe($.concat('templates.js'))
    .pipe(gulp.dest('./dist/javascripts'))
<% } %>
gulp.task 'sass', ->
  gulp.src('app/stylesheets/*.sass')
    .pipe($.sass.sync(
      outputStyle: 'expanded'
      precision: 10
      includePaths: [ '.' ])
    .on('error', $.sass.logError))
    .pipe gulp.dest('./dist/stylesheets')

gulp.task 'coffee', ->
  gulp.src('./app/javascripts/**/*.coffee')
    .pipe($.coffee(bare: true).on('error', console.log))
    .pipe($.concat('application.js'))
    .pipe(gulp.dest('./dist/javascripts'))
  gulp.src('./app/index.coffee')
    .pipe($.coffee(bare: true).on('error', console.log))
    .pipe(gulp.dest('./dist'))

gulp.task 'extras', ->
  gulp.src('./app/package.json').pipe(gulp.dest('./dist'))

gulp.task 'clean', del.bind(null, ['dist', '.tmp'])

gulp.task 'watch', ->
  gulp.watch 'app/*.html', [ 'html' ]
  gulp.watch 'app/stylesheets/**/*.sass', [ 'sass' ]
  gulp.watch 'app/javascripts/**/*.coffee', [ 'coffee' ]
  gulp.watch 'app/templates/**/*.hbs', [ 'templates' ]

gulp.task 'build', (cb) ->
  runSequence 'clean', 'coffee'<% if (handlebars) {%>, 'templates'<% } %>, 'sass', 'html', 'images', 'extras', cb
<% if (jasmine) { %>
gulp.task 'jasmine', ->
  gulp.src('./jasmine', read: false).pipe $.jasmine(config:
    spec_dir: './jasmine'
    spec_files: [ '**/*_spec.coffee' ])
<% } %>
gulp.task 'package', ->
  gulp.src('./dist').pipe $.electronPacker(packageJSON)
