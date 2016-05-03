var gulp = require('gulp');
var shell = require('gulp-shell');
var jade = require('gulp-jade');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');
var gulpif = require('gulp-if');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var connect = require('gulp-connect');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var livereload = require('gulp-livereload');
var bowerFiles = require('main-bower-files');


var resumeData = require('./src/templates/content/bbarker.json');


var env = process.env.NODE_ENV || 'development';

var outputDir = 'builds/';
var materializeDir = 'bower_components/materialize/';
var jQueryDir = 'bower_components/jquery/dist/';


gulp.task('shell', shell.task([
    'clear'
]));

gulp.task('jade', function () {
    return gulp.src('src/templates/**/!(_)*.jade')
        .pipe(plumber())
        .pipe(
            gulpif(env === 'development',
                                jade({
                    pretty: true,
                    locals: resumeData
                }),
                                jade({
                    pretty: false,
                    locals: resumeData
                })
            ))
        .pipe(gulp.dest(outputDir + env))
        .pipe(notify({
            message: "<%= file.relative %> created successfuly",
            templateOptions: {
                date: new Date()
            }
        }))
        .pipe(livereload())
});

gulp.task('bowerFiles', function () {
    return gulp.src(bowerFiles(), {
            base: 'bower_components'
        })
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(gulp.dest(outputDir + env + '/lib'))
        .pipe(notify({
            message: "<%= file.relative %> created successfuly",
            templateOptions: {
                date: new Date()
            }
        }))
        .pipe(livereload());
});

gulp.task('sass', function () {
    return gulp.src('src/sass/**/!(_)*.scss')
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(
            gulpif(env === 'development',
                                sass({sourceComments: 'map'}),
                                sass()
            )
        )
                .pipe(gulp.dest(outputDir + env + '/css/'))
        .pipe(notify({
            message: "<%= file.relative %> created successfuly",
            templateOptions: {
                date: new Date()
            }
        }))
        .pipe(livereload())
});

gulp.task('images', function () {
    return gulp.src('src/assets/images/**/!(_)*.*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(gulp.dest(outputDir + env + '/images/'))
        .pipe(notify({
            message: "<%= file.relative %> created successfuly",
            templateOptions: {
                date: new Date()
            }
        }))
        .pipe(livereload())
});

gulp.task('downloads', function () {
    return gulp.src('src/assets/downloads/**/!(_)*.*')
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(gulp.dest(outputDir + env + '/downloads/'))
        .pipe(notify({
            message: "<%= file.relative %> created successfuly",
            templateOptions: {
                date: new Date()
            }
        }))
        .pipe(livereload())
});


gulp.task('watch', function () {
    var server = livereload.listen();
    gulp.watch('src/templates/**/*.*', ['jade']);
    gulp.watch('src/sass/**/*.scss', ['sass']);
    gulp.watch('bower_components/**/*.*', ['bowerFiles']);
    gulp.watch('src/assets/images/**/!(_)*.*', ['images']);
    gulp.watch('src/assets/downloads/**/!(_)*.*', ['downloads']);
});

gulp.task('git', shell.task([
    'git status',
    'git add .',
    'git commit -m \'Gulp Git task detected changes.\'',
    'git push origin'
]));


gulp.task('production', shell.task([
    'NODE_ENV=production gulp'
]));

gulp.task('default', ['shell', 'bowerFiles', 'sass', 'jade', 'images', 'downloads', 'watch']);


