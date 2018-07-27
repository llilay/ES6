import gulp from 'gulp';
import gulpif from 'gulp-if'; //
import concat from 'gulp-concat'; //处理文件拼接
import webpack from 'webpack';
import gulpWebpack from 'webpack-stream';
import named from 'vinyl-named'; //对文件重命名做标志
import livereload from 'gulp-livereload'; //文件修改后浏览器自动刷新,热更新
import plumber from 'gulp-plumber'; //处理文件信息流
import rename from 'gulp-rename'; //对文件重命名
import uglify from 'gulp-uglify'; //压缩js css
import {log,colors} from 'gulp-util'; //命令行输出
import args from './util/args'; //对命令行参数进行解析

//创建一个任务,实现任务自动化
gulp.task('scripts', () => {
    return gulp.src(['app/js/index.js'])
        .pipe(plumber({
            //处理常规错误逻辑
            errorHandle: function () {

            }
        }))
        .pipe(named())
        .pipe(gulpWebpack({   //js编译
            module: {
                loaders: [{
                    test: /\.js$/,
                    loader: 'babel'
                }]
            }
        }), null, (err, stats) => {
            log(`Finished'${colors.cyan('script')}'`, stats.toString({
                chunk : false
            }))
        })
        .pipe(gulp.dest('server/public/js'))
        .pipe(rename({
            basename: 'cp',
            extname: '.min.js'
        }))
        .pipe(uglify({
            compress: {
                properties: false
            },
            output: {
                'quote_keys': true
            }
        }))
        .pipe(gulp.dest('server/public/js'))
        .pipe(gulpif(args.watch, livereload()))
});