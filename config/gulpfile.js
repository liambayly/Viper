/* jshint ignore:start */
//This is the variable list of items that are required in order to run the applicatin
//this list is also mirrored in the package.json allowing us to download and install all the dependencies for building the application
var gulp = require('gulp'),
	gutil = require('gulp-util'),
	es = require('event-stream'),
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
 


	// Allows gulp --prod to be run for a less verbose enviroment and full minification
	var isProduction = false;
	var sassStyle = 'expanded';
	var sourceMap = true;


	if(gutil.env.prod === true) {
		sassStyle = 'compressed';
		sourceMap = false;
    	isProduction = true;
		process.stdout.write('Process Set to Production')
	}

	var changeEvent = function(evt) {
    	gutil.log('File', gutil.colors.cyan(evt.path.replace(new RegExp('/.*(?=/' + basePaths.src + ')/'), '')), 'was', gutil.colors.magenta(evt.type));
	};

	gulp.task('bower', function() {
	  return bower('./bower_components')
		.pipe(gulp.dest('../public/lib/bower/'))
	});


	gulp.task('css', function () {
	  return gulp.src('../src/lib/css/app.css')
	  .pipe(plumber())
	  .pipe(autoprefixer('last 4 version'))
	  .pipe(gulp.dest('../public/lib/css'))
	  .pipe(isProduction ? cssnano(): jshint())
	  .pipe(rename({ suffix: '.min' }))
	  .pipe(gulp.dest('../public/lib/css'))
	  .pipe(browserSync.reload({stream:true}));
	});

	//This is the javascript task, this task will look and move any js files in the lib src (vendor items)
	//This will also reload the application when the js files change
	gulp.task('jslib',function(){
	  gulp.src('../src/lib/js/third-party/**/*.js')
	  .pipe(plumber())
	  .pipe(jshint('.jshintrc'))
	  .pipe(jshint.reporter('default'))
	  .pipe(gulp.dest('../public/lib/js/'))
	  .pipe(isProduction ? uglify(): jshint())
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
	  .pipe(isProduction ? uglify({mangle: false}): jshint())
	  .pipe(rename({ suffix: '.min' }))
	  .pipe(concat('app.js'))
	  .pipe(gulp.dest('../public/com/'))
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
	gulp.task('lib',function(){
	  gulp.src('../src/lib/**/*')
	  .pipe(plumber())
	  .pipe(gulp.dest('../public/lib'))
	  .pipe(browserSync.reload({stream:true}));
	});

	//This vendors folder from the src to the public
	gulp.task('vendorFolder',function(){
		gulp.src('../src/lib/vendor/**/*')
		.pipe(plumber())
	  	.pipe(isProduction ? uglify({mangle: false}): jshint())
		.pipe(gulp.dest('../public/lib/vendor'))
		.pipe(browserSync.reload({stream:true,}));
	})

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


//default task which calls the base tasks and watchers
gulp.task('default', ['base', 'sync'], function () {});



//start the base tasks
gulp.task('base', function () {
  	gulp.start(['bower','css','jslib','jscom','jshtml', 'indexhtml', 'lib', 'restjson', 'vendorFolder', 'images']);
});


//starts browser sync and starts the watchers
gulp.task('sync', ['browser-sync'], function(){
    gulp.watch("../src/com/modules/Store/views/**/*.html",['htmlStore']);
    gulp.watch("../src/com/**/*.html",['jshtml']);
    gulp.watch("../src/index.html",['indexhtml']);
    gulp.watch("../src/lib/**/*",['lib']);
    gulp.watch("../src/favicon.ico",['favicon']);
    gulp.watch("../src/lib/fonts/",['fonts']);
    gulp.watch("../src/r/**/*.json",['restjson']);
    gulp.watch("../src/lib/vendor/**/*.js",['vendorFolder']);
    gulp.watch("../src/lib/img",['images']);
    gulp.watch("../public/*.html",['bs-reload']);
    gulp.watch("../src/com/js/**/*_spec.js", [ 'karma' ]);
    gulp.watch("../src/lib/scss/**/*.scss",['css']);
    gulp.watch("../src/com/**/*.js",['jscom']);
});
/* jshint ignore:end */
