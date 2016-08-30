/* jshint ignore:start */
//This is the variable list of items that are required in order to run the applicatin
//this list is also mirrored in the package.json allowing us to download and install all the dependencies for building the application
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    minify = require('gulp-minify');
    historyApiFallback = require('connect-history-api-fallback'),
    del = require('del'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    header  = require('gulp-header'),
    consolidate = require("gulp-consolidate"),
    runTimestamp = Math.round(Date.now()/1000),
    rename = require('gulp-rename'),
    karma = require('karma'),
    watch = require('gulp-watch'),
    plumber = require('gulp-plumber'),
    minify = require('gulp-minify'),
    cssnano = require('gulp-cssnano'),
    htmlmin = require('gulp-htmlmin'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    htmlreplace = require('gulp-html-replace'),
    jasmine = require('gulp-jasmine'),
    jasmineBrowser = require('gulp-jasmine-browser'),
    Proxy = require('proxy-middleware'),
    url = require('url'),
    webpack = require('webpack-stream'),
    bower = require('gulp-bower');
 
//gulp.task('clean', function (cb) {
//    del(['../public'],[{force:true}], cb)
    //console.log('Deleted files/folders:\n', paths.join('\n'));
//});


//This is the css task this will move all css from the source folder into the public folder
//this will also , when uncommented minify the css files


gulp.task('css', function () {
  return gulp.src('../src/lib/scss/app.scss')
  .pipe(plumber())
  .pipe(sass())
  .pipe(autoprefixer('last 4 version'))
  .pipe(gulp.dest('../public/lib/css'))
  .pipe(cssnano())
  .pipe(rename({ suffix: '.min' }))
  .pipe(gulp.dest('../public/lib/css'))
  .pipe(browserSync.reload({stream:true}));
});
gulp.task('cssDebug', function () {
  return gulp.src('../src/lib/scss/app.scss')
  .pipe(plumber())
  .pipe(sass())
  .pipe(autoprefixer('last 4 version'))
  .pipe(gulp.dest('../public/lib/css'))
  .pipe(rename({ suffix: '.min' }))
  .pipe(gulp.dest('../public/lib/css'))
  .pipe(browserSync.reload({stream:true}));
});

gulp.task('bower', function() {
  return bower('./bower_components')
    .pipe(gulp.dest('../public/lib/bower/'))
});

//Used to take .svg files and convert them into a icon font
gulp.task('iconfont', function(){
  return gulp.src(['../src/lib/icons/*.svg'])
    .pipe(iconfont({
      fontName: 'europa-icons', // required 
      appendUnicode: true, // recommended option 
      formats: ['ttf', 'eot', 'woff', 'woff2'], // default, 'woff2' and 'svg' are available 
      timestamp: runTimestamp, // recommended to get consistent builds when watching files 
    }))
      .on('glyphs', function(glyphs, options) {
        // CSS templating, e.g. 
        console.log(glyphs, options);
      })
    .pipe(gulp.dest('../public/lib/fonts'));
});


//This is the javascript task, this task will look and move any js files in the lib src (vendor items)
//This will also reload the application when the js files change
gulp.task('jslib',function(){
  gulp.src('../src/lib/js/third-party/**/*.js')
  .pipe(plumber())
  .pipe(jshint('.jshintrc'))
  .pipe(jshint.reporter('default'))
  .pipe(gulp.dest('../public/lib/js/'))
  .pipe(uglify())
  .pipe(rename({ suffix: '.min' }))
  .pipe(gulp.dest('../public/lib/js/'))
  .pipe(browserSync.reload({stream:true}));
});

//This is the angular task that will check the com folder and place all js into either the application file, or if 
//commented out into there own files in the com folder. When uncommented on the uglify function it will minimze the app.js
//Only do this on production builds as it is a pain to debug a minified file
//This will also reload the browser when you change and save a js file allowing you to do real-time dev and debug on the application
gulp.task('jscom',function(){
  gulp.src(['../src/com/**/*.js', '!../src/com/**/*_spec.js'])
  .pipe(plumber())
  .pipe(jshint('.jshintrc'))
  .pipe(jshint.reporter('default'))
  //Uncomment the below for production build to minify the file
  .pipe(uglify({mangle: false}))
  .pipe(rename({ suffix: '.min' }))
  .pipe(concat('app.js'))
  .pipe(gulp.dest('../public/com/'))
  .pipe(browserSync.reload({stream:true}));

  
});

gulp.task('jscomDebug',function(){
  gulp.src(['../src/com/**/*.js', '!../src/com/**/*_spec.js'])
  .pipe(plumber())
  .pipe(jshint('.jshintrc'))
  .pipe(jshint.reporter('default'))
  //Uncomment the below for production build to minify the file
  //.pipe(uglify({mangle: false}))
  .pipe(rename({ suffix: '.min' }))
  .pipe(concat('app.js'))
  .pipe(gulp.dest('../public/com/'))
  .pipe(browserSync.reload({stream:true}));
});

//Concentrates on Moving the Store Views  
gulp.task('htmlStore',function(){
  gulp.src('../src/com/modules/Store/views/**/*.html')
  .pipe(plumber())
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('../public/com/modules/Store/views/'))
  .pipe(browserSync.reload({stream:true}));
});


//This task moves the JSON from the source folder to the public folder for use by the seed
gulp.task('restjson',function(){
	gulp.src('../src/r/**/*.json')
	.pipe(plumber())
	.pipe(gulp.dest('../public/r'))
	.pipe(browserSync.reload({stream:true,}));
});

//This moves the views in the angular folder and places them, unchanged into the com folder to ensure your templates 
//are available for use. This will also reload the application if an html file changes for realtime development and debug
gulp.task('jshtml',function(){
  gulp.src('../src/com/**/*.html')
  .pipe(plumber())
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('../public/com/'))
  .pipe(browserSync.reload({stream:true}));
});

//This moves the index.html file from the src folder and places them into the public folder for use. 
//This will also reload the application when the index file changes for realtime development . 
gulp.task('indexhtml',function(){
  gulp.src('../src/index.html')
  .pipe(plumber())
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('../public/'))
  .pipe(browserSync.reload({stream:true}));
});


//This is the favicon file and this function moves it from the source folder to the public for use. 
//this allows the application to be fully built and nothing needs to reside within the public folder. 
gulp.task('favicon',function(){
  gulp.src('../src/favicon.ico')
  .pipe(plumber())
  .pipe(gulp.dest('../public/'))
  .pipe(browserSync.reload({stream:true}));
});


//This task moves the fonts from the src folder to the public folder, this also has a browser sync request attached to it
gulp.task('fonts',function(){
	gulp.src('../src/lib/fonts/*')
	.pipe(plumber())
	.pipe(gulp.dest('../public/lib/fonts'))
	.pipe(browserSync.reload({stream:true,}));
});

//This vendors folder from the src to the public
gulp.task('vendorFolder',function(){
	gulp.src('../src/lib/vendor/**/*')
	.pipe(plumber())
  .pipe(uglify({mangle: false}))
	.pipe(gulp.dest('../public/lib/vendor'))
	.pipe(browserSync.reload({stream:true,}));
});

//This task moves the icon sprite from the src folder to the public folder, this also has a browser sync request attached to it
gulp.task('icons',function(){
	return gulp.src('../src/lib/icons/*')
	.pipe(imagemin({
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()]
  }))
	.pipe(gulp.dest('../public/lib/icons'))
	.pipe(browserSync.reload({stream:true,}));
});

//This task moves the images from the src to the public folder , it will also 
//compress the images while moving it from src to public allowing for smaller images
gulp.task('images', function () {
	gulp.src('../src/lib/img/**/*')
	.pipe(plumber())
	.pipe(gulp.dest('../public/lib/img'))
	.pipe(browserSync.reload({stream:true}));
});

gulp.task('karma', function (done) {
  karma.server = new karma.Server({configFile: __dirname + '/karma.conf.js'}, done);
  karma.server.start();
});

//This is the browser sync plugin that will add code to the browser to allow for 
//live reload  during development of the application, this code so far hasn't caused an issue 
//in development but should be commented out for production, I will have a production gulp file 
//that will remove these for a production build. 
gulp.task('browser-sync', function() {
var proxyOptions = url.parse('http://angular.dev.europa-sports.net/Mercury');
    proxyOptions.route = '/Mercury';
var proxyOptions2 = url.parse('http://angular.dev.europa-sports.net/media');
    proxyOptions2.route = '/media';
    browserSync({
        server: {
            baseDir: "../public",
            middleware: [ Proxy(proxyOptions),Proxy(proxyOptions2), historyApiFallback() ]
        }
    });
});


//This tells the system to reload the browser on watch when items change 
//this again is a development plugin and should not be used in a production build. 
gulp.task('bs-reload', function () {
    browserSync.reload();
});


//These are the watch tasks for gulp , it will watch these tasks to ensure they complete without error 
//and if so show them in the console so ensure you are watching the console when doing changes it will tell 
//you if errors are thrown. you should only add something to this if you want it to watch the task for errors 

var debugMode = false;

//default task which calls the base tasks and watchers
gulp.task('default', ['base', 'sync'], function () {});

//This enabled debug mode for faster compile times and un uglified content so debugging is easier
gulp.task('dev', function () {
  debugMode = true;
  gulp.start(['base', 'sync']);
});

//when we need to update dependencies 
gulp.task('update', ['bower', 'base'], function(){});

//start the base tasks
gulp.task('base', function () {
  if(debugMode){
    gulp.start('cssDebug');
    gulp.start('jscomDebug');
  }else{
    gulp.start('css');
    gulp.start('jscom');
  }
  gulp.start(['jslib','htmlStore','jshtml', 'indexhtml', 'favicon', 'fonts', 'restjson', 'vendorFolder', 'images', 'icons']);
});

//starts browser sync and starts the watchers
gulp.task('sync', ['browser-sync'], function(){
    gulp.watch("../src/com/modules/Store/views/**/*.html",['htmlStore']);
    gulp.watch("../src/com/**/*.html",['jshtml']);
    gulp.watch("../src/index.html",['indexhtml']);
    gulp.watch("../src/favicon.ico",['favicon']);
    gulp.watch("../src/lib/fonts/",['fonts']);
    gulp.watch("../src/lib/icons/*.svg",['icons']);
    gulp.watch("../src/r/**/*.json",['restjson']);
    gulp.watch("../src/lib/vendor/**/*.js",['vendorFolder']);
    gulp.watch("../src/lib/img",['images']);
    gulp.watch("../public/*.html",['bs-reload']);
    gulp.watch("../src/com/js/**/*_spec.js", [ 'karma' ]);
    if(debugMode){
      gulp.watch("../src/lib/scss/**/*.scss",['css']);
      gulp.watch("../src/com/**/*.js",['jscom']);
    }else{
      gulp.watch("../src/lib/scss/**/*.scss",['cssDebug']);
      gulp.watch("../src/com/**/*.js",['jscomDebug']);
    }
});
/* jshint ignore:end */
