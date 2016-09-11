'use strivt'

// ディレクトリ
var path = {
  'htmlPath': 'src/html', // 例）'htdocs/images'
  'sassPath': 'src/sass', // 例）'htdocs/scss'
  'jsPath': 'src/js', // 例）'htdocs/javascripts'
  'imgPath': 'src/img', // 例）'htdocs/images'

  'htmlBuildPath': 'build/html', // 例）'htdocs/images'
  'cssBuildPath': 'build/css', // 例）'htdocs/stylesheets'
  'jsBuildPath': 'build/js', // 例）'htdocs/stylesheets'
  'imgBuildPath': 'build/img', // 例）'htdocs/stylesheets'
}

// 使用パッケージ
var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var sass = require('gulp-sass'); // Sassコンパイル
var postcss = require('gulp-postcss');
var cssnext = require('postcss-cssnext');//ベンダープレフィックス
var webserver = require('gulp-webserver'); // ローカルサーバ起動
var imagemin = require('gulp-imagemin'); // 画像圧縮
var pngquant = require('imagemin-pngquant'); // 画像圧縮
var plumber = require('gulp-plumber'); // コンパイルエラーが出てもwatchを止めない

//ローカルサーバー
gulp.task('webserver', function(){
  gulp.src('./') // ルート・ディレクトリ
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true,
      port: 8000
    }));
});

// htmlをコンパイル
gulp.task('html', function(){
  gulp.src(path.htmlPath + '/*.html')
  .pipe(gulp.dest(path.htmlBuildPath + '/'));
});


// jsをコンパイル
gulp.task('js', function(){
  browserify({
    entries: [path.jsPath + '/app.js']
  })
  .bundle()
  .pipe(source('main.js'))
  .pipe(gulp.dest(path.jsBuildPath + '/'));
});


// Sassをコンパイルし、ベンダープレフィックスを付与
gulp.task('scss', function() {
  var processors = [
      cssnext()
  ];
  return gulp.src(path.sassPath + '/*.scss')
    .pipe(sass())
    .pipe(postcss(processors))
    .pipe(gulp.dest(path.cssBuildPath + '/'))
});


// 画像圧縮
gulp.task('imagemin', function(){
  gulp.src(path.imgPath + '/*')
    .pipe(plumber())
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    }))
    .pipe(gulp.dest(path.imgBuildPath));
});

// ファイル変更監視
gulp.task('watch', function() {
  gulp.watch(path.htmlPath + '/*.html', function(event){gulp.run('html')});
  gulp.watch(path.sassPath + '/*.scss', function(event){gulp.run('scss')});
  gulp.watch(path.jsPath + '**/*.js', function(event){gulp.run('js')});
});

// タスク実行
gulp.task('default', ['webserver','html','js','scss','watch']); // デフォルト実行