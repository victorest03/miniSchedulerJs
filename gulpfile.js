const gulp = require("gulp"),
    sass = require("gulp-sass"),
    babel = require("gulp-babel"),
    autoprefixer = require("gulp-autoprefixer"),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync').create()

//Definicion de Tareas
gulp.task("CompileSass", ()=>
    //Input
    gulp.src("./scss/**/*.scss")
        .pipe(sass({
            outputStyle: "expanded"
        }))
        .pipe(autoprefixer({
            versions: ['last 2 browsers']
        }))
        .pipe(gulp.dest("./css"))
    //Output
);

gulp.task("minifycss", () => {
    gulp.src(["./css/**/*.css", "!./css/**/*.min.css"])
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest("./css"))
        .pipe(browserSync.stream());
});

gulp.task("minifyjs", () => {
    gulp.src(["./js/**/*.js","!./js/**/*.min.js"])
        .pipe(babel())
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest("./js"))
        .pipe(browserSync.stream());
});

gulp.task("serve",()=>{
    browserSync.init({
        server: "./"
    });

    gulp.watch("./*.html").on('change', browserSync.reload);
});

gulp.task("default",["CompileSass","minifycss","minifyjs","serve"],()=>{
    gulp.watch("./scss/**/*.scss",["CompileSass"]);
    gulp.watch(["./css/**/*.css", "!./css/**/*.min.css"],["minifycss"]);
    gulp.watch(["./js/**/*.js","!./js/**/*.min.js"],["minifyjs"]);
});1