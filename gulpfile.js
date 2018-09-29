const gulp = require('gulp');
const fs = require('fs');
const del = require('del');
const path = require('path');
const util = require('gulp-util');
const jade = require('gulp-jade');
const sass = require('gulp-sass');
const concatJS = require('gulp-concat');
const concatCSS = require('gulp-concat-css');
const gulpif = require('gulp-if');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const filter = require('gulp-filter');
const livereload = require('gulp-livereload');
const cleanCSS = require('gulp-clean-css');
const uncss = require('gulp-uncss');
const bowerFiles = require('main-bower-files');
const jpegtran = require('imagemin-jpegtran');
const webserver = require('gulp-webserver');

const content = './src/templates/content/bbarker.json';
const outputDir = 'builds/';
const env = util.env.production ? 'production' : 'development';

function isProduction() {
    return env === 'production';
}

gulp.task('jade', () => {
    const contentData = JSON.parse(fs.readFileSync(content));
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

gulp.task('bowerFiles', () => {
    const jsFilter = filter('**/*.js', {restore: true});
    const cssFilter = filter('**/*.css', {restore: true});
    const fontFilter = filter(['**/*.eot', '**/*.woff', '**/*.woff2', '**/*.svg', '**/*.ttf'], {restore: true});
    const vendorPath = `${outputDir + env}/vendor/`;


    return gulp.src(bowerFiles(), { base: 'bower_components' })
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        //JS
        .pipe(jsFilter)
        .pipe(concatJS("dist.js"))
        .pipe(gulpif(isProduction(), uglify()))
        .pipe(gulp.dest(`${vendorPath}js`))
        .pipe(jsFilter.restore)
        //CSS
        .pipe(cssFilter)
        .pipe(concatCSS("dist.css", {rebaseUrls: false}))
        .pipe(gulpif(isProduction(), uncss({
            html: [`${outputDir + env}/index.html`]
        })))
        .pipe(gulpif(isProduction(), cleanCSS()))
        .pipe(gulp.dest(`${vendorPath}css`))
        .pipe(cssFilter.restore)
        //Fonts
        .pipe(fontFilter)
        .pipe(gulp.dest(file => {
            const parentName = path.basename(path.dirname(file.path));
            file.path = path.join(file.base, path.basename(file.path));
            return path.join(`${vendorPath}fonts`, parentName.toLowerCase().indexOf("font") <= -1 ? parentName : "");
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

gulp.task('sass', () => gulp.src('src/sass/**/!(_)*.scss')
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe(
        gulpif(isProduction(),
            sass({outputStyle: 'compressed'}),
            sass({sourceComments: 'map'})
        )
    )
    .pipe(gulp.dest(`${outputDir + env}/css/`))
    .pipe(notify({
        message: '<%= file.relative %> created successfuly',
        templateOptions: {
            date: new Date()
        }
    }))
    .pipe(livereload()));

gulp.task('images', () => gulp.src('src/assets/images/**/!(_)*.*')
    /*.pipe(imagemin({
        plugins: [jpegtran()]
    }))*/
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe(gulp.dest(`${outputDir + env}/images/`))
    .pipe(notify({
        message: '<%= file.relative %> created successfuly',
        templateOptions: {
            date: new Date()
        }
    }))
    .pipe(livereload()));

gulp.task('downloads', () => gulp.src('src/assets/downloads/**/!(_)*.*')
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe(gulp.dest(`${outputDir + env}/downloads/`))
    .pipe(notify({
        message: '<%= file.relative %> created successfuly',
        templateOptions: {
            date: new Date()
        }
    }))
    .pipe(livereload()));

gulp.task('javascript', () => gulp.src('src/js/*.*')
    .pipe(plumber())
    .pipe(gulpif(isProduction(), uglify()))
    .pipe(gulp.dest(`${outputDir + env}/js/`))
    .pipe(notify({
        message: '<%= file.relative %> created successfuly',
        templateOptions: {
            date: new Date()
        }
    }))
    .pipe(livereload()));

gulp.task('watch', () => {
    livereload.listen();
    gulp.watch('src/js/**/*.*', ['javascript']);
    gulp.watch('src/templates/**/*.*', ['jade']);
    gulp.watch('src/sass/**/*.scss', ['sass']);
    //gulp.watch('bower_components/**/*.*', ['bowerFiles']);
    gulp.watch('src/assets/images/**/!(_)*.*', ['images']);
    gulp.watch('src/assets/downloads/**/!(_)*.*', ['downloads']);
});

gulp.task('start', ['default', 'watch'], () => {
    gulp.src('builds/development')
        .pipe(webserver({
            fallback: 'index.html',
            open: true
        }));
});

gulp.task('default', ['bowerFiles', 'sass', 'jade', 'images', 'downloads', 'javascript']);


