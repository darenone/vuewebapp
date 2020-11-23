const gulp = require('gulp');
// const { series, parallel, src, dest, watch } = require('gulp');

// const Jshint = require('gulp-jshint'); // js检查
const Gutil = require('gulp-util'); // 类似于console.log
const { createProxyMiddleware } = require('http-proxy-middleware'); // 跨域设置
const Less = require('gulp-less'); // 编译less
const FileInclude = require('gulp-file-include'); // 文件模块化
const Connect = require('gulp-connect'); // 浏览器刷新
const Clean = require('gulp-clean'); // 清理目录

// 获取配置文件
const config = require('./config');
const { dist } = config;

// 压缩html
async function html() {
    return gulp.src('src/views/*.html')
        .pipe(FileInclude({ // HTML模板替换
            prefix: '##',
            basepath: '@file'
        }))
        .on('error', function(err) {
            console.error('Task:copy-html,', err.message);
            this.end();
        })
        .pipe(gulp.dest(dist)) // 拷贝
        .pipe(Connect.reload()); // 刷新浏览器
}

// css
async function css() {
    return await gulp.src('src/css/*.less')
        .pipe(Less()) // 编译less
        .pipe(gulp.dest(dist + '/css')) // 拷贝
        .pipe(Connect.reload()); // 刷新
}

// js
async function js() {
    return await gulp.src('src/js/**')
        // .pipe(Jshint()) // 检查代码
        .on('error', function(err) {
            Gutil.log(Gutil.colors.red('[error]'), err.toString())
        })
        .pipe(gulp.dest(dist + '/js')) // 拷贝
        .pipe(Connect.reload()); // 刷新
}

// image
async function image() {
    return await gulp.src('src/images/*')
        .pipe(gulp.dest(dist + '/images')) // 拷贝
        .pipe(Connect.reload()); // 刷新
}

// clean
async function clean() {
    return await gulp.src(dist, {allowEmpty: true})
        .pipe(Clean()); // 删除之前生成的文件
}

// 启动服务器
async function server() {
    Connect.server({
        root: dist, // 根目录
        // ip: '192.168.1.65', // 默认localhost:8080
        livereload: true, // 自动更新
        port: 8090,
        host: '0.0.0.0', // 开启局域网内访问
        // middleware: function(connect, opt) {
        //     return [
        //         createProxyMiddleware('/api', {
        //             target: 'http://localhost:8080',
        //             changeOrigin: true
        //         }),
        //         createProxyMiddleware('/idcMonitorServer', {
        //             target: 'http://10.0.0.186:18090',
        //             changeOrigin: true
        //         }),
        //     ]
        // }
    })
}

module.exports = {
    html,
    css,
    js,
    image,
    clean,
    server
}