var gulp = require('gulp');
var fs = require('fs');
var del = require('del');
var path = require('path');
var util = require('gulp-util');
var jade = require('gulp-jade');
var sass = require('gulp-sass');
var concatJS = require('gulp-concat');
var concatCSS = require('gulp-concat-css');
var gulpif = require('gulp-if');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var imagemin = require('gulp-imagemin');
var uglify = require('gulp-uglify');
var filter = require('gulp-filter');
var livereload = require('gulp-livereload');
var cleanCSS = require('gulp-clean-css');
var uncss = require('gulp-uncss');
var bowerFiles = require('main-bower-files');
var jpegtran = require('imagemin-jpegtran');

var content = './src/templates/content/bbarker.json';
var outputDir = 'builds/';
var env = util.env.production ? 'production' : 'development';

function isProduction() {
    return env === 'production';
}

gulp.task('jade', function () {
    var contentData = JSON.parse(fs.readFileSync(content));
    return gulp.src('src/templates/**/!(_)*.jade')
        .pipe(plumber())
        .pipe(
            gulpif(isProduction(),
                jade({
                    pretty: false,
                    locals: contentData
                }),
                jade({
                    pretty: true,
                    locals: contentData
                })
            ))
        .pipe(gulp.dest(outputDir + env))
        .pipe(notify({
            message: '<%= file.relative %> created successfuly',
            templateOptions: {
                date: new Date()
            }
        }))
        .pipe(livereload())
});

gulp.task('bowerFiles', function () {
    var jsFilter = filter('**/*.js', {restore: true});
    var cssFilter = filter('**/*.css', {restore: true});
    var fontFilter = filter(['**/*.eot', '**/*.woff', '**/*.woff2', '**/*.svg', '**/*.ttf'], {restore: true});
    var vendorPath = outputDir + env + '/vendor/';


    return gulp.src(bowerFiles(), {
            base: 'bower_components'
        })
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        //JS
        .pipe(jsFilter)
        .pipe(concatJS("dist.js"))
        .pipe(gulpif(isProduction(), uglify()))
        .pipe(gulp.dest(vendorPath + "js"))
        .pipe(jsFilter.restore)
        //CSS
        .pipe(cssFilter)
        .pipe(concatCSS("dist.css", {rebaseUrls: false}))
        .pipe(gulpif(isProduction(), uncss({
            html: [outputDir + env + "/index.html"]
        })))
        .pipe(gulpif(isProduction(), cleanCSS()))
        .pipe(gulp.dest(vendorPath + "css"))
        .pipe(cssFilter.restore)
        //Fonts
        .pipe(fontFilter)
        .pipe(gulp.dest(function(file) {
            var parentName = path.basename(path.dirname(file.path));
            file.path = path.join(file.base, path.basename(file.path));
            return path.join(vendorPath + 'fonts', parentName.toLowerCase().indexOf("font") <= -1 ? parentName : "");
        }))
        .pipe(fontFilter.restore)
        .pipe(notify({
            message: '<%= file.relative %> created successfuly',
            templateOptions: {
                date: new Date()
            }
        }))
        .pipe(livereload());
});

gulp.task('sass', function () {
    return gulp.src('src/sass/**/!(_)*.scss')
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(
            gulpif(isProduction(),
                sass({outputStyle: 'compressed'}),
                sass({sourceComments: 'map'})
            )
        )
        .pipe(gulp.dest(outputDir + env + '/css/'))
        .pipe(notify({
            message: '<%= file.relative %> created successfuly',
            templateOptions: {
                date: new Date()
            }
        }))
        .pipe(livereload())
});

gulp.task('images', function () {
    return gulp.src('src/assets/images/**/!(_)*.*')
        /*.pipe(imagemin({
            plugins: [jpegtran()]
        }))*/
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(gulp.dest(outputDir + env + '/images/'))
        .pipe(notify({
            message: '<%= file.relative %> created successfuly',
            templateOptions: {
                date: new Date()
            }
        }))
        .pipe(livereload())
});

gulp.task('downloads', function () {
    return gulp.src('src/assets/downloads/**/!(_)*.*')
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(gulp.dest(outputDir + env + '/downloads/'))
        .pipe(notify({
            message: '<%= file.relative %> created successfuly',
            templateOptions: {
                date: new Date()
            }
        }))
        .pipe(livereload())
});

gulp.task('javascript', function () {
    return gulp.src('src/js/*.*')
        .pipe(plumber())
        .pipe(gulpif(isProduction(), uglify()))
        .pipe(gulp.dest(outputDir + env + '/js/'))
        .pipe(notify({
            message: '<%= file.relative %> created successfuly',
            templateOptions: {
                date: new Date()
            }
        }))
        .pipe(livereload())
});

gulp.task('watch', function () {
    livereload.listen();
    gulp.watch('src/js/**/*.*', ['javascript']);
    gulp.watch('src/templates/**/*.*', ['jade']);
    gulp.watch('src/sass/**/*.scss', ['sass']);
    //gulp.watch('bower_components/**/*.*', ['bowerFiles']);
    gulp.watch('src/assets/images/**/!(_)*.*', ['images']);
    gulp.watch('src/assets/downloads/**/!(_)*.*', ['downloads']);
});

gulp.task('default', ['bowerFiles', 'sass', 'jade', 'images', 'downloads', 'javascript', 'watch']);



