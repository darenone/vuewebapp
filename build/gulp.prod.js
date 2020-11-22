const gulp = require('gulp');

const Uglify = require('gulp-uglify'); // 压缩js
const Minifycss = require('gulp-minify-css'); // 压缩css
const Less = require('gulp-less'); // 编译less
const Autoprefixer = require('gulp-autoprefixer'); // 浏览器前缀
const Minifyhtml = require('gulp-minify-html'); // 压缩html
const FileInclude = require('gulp-file-include'); // 文件模块化
const Imagemin = require('gulp-imagemin'); // 压缩图片
const Pngquant = require('imagemin-pngquant'); // png图片压缩
const Cache = require('gulp-cache'); // 压缩图片会占用较长时间，使用此插件可以减少重复压缩
const Clean = require('gulp-clean'); // 清理目录
const rev = require('gulp-rev'); // 为静态文件随机添加一串hash值，解决浏览器缓存问题，防止项目打包上线以后，由于浏览器缓存项目加载不到最新修改的js或者css代码
const revCollector = require('gulp-rev-collector'); // 根据gulp-rev生成的manifest.json文件中的映射，将html中的路径替换

// 获取配置文件
const config = require('./config');
const { dist } = config;

// css
async function css() {
    return await gulp.src('src/css/**')
        .pipe(Less())
        .pipe(Autoprefixer({
            cascade: true, // 添加前缀
            remove: true // 去掉不必要的前缀
        }))
        .pipe(Minifycss({
            advanced: true, // 开启高级优化（合并选择器等）
            compatibility: '', // 保留IE7及以下兼容写法，其值有4种['': 启用兼容模式，'ie7': IE7兼容模式，'ie8': IE8兼容模式， '*': IE9+兼容模式]
            keepBreaks: false, // 是否保留换行
            keepSpecialComments: '*' // 保留所有特殊前缀，当调用Autoprefixer生成css前缀时，如果这里不设置，有可能会删除你的部分前缀
        }))
        // .pipe(gulp.dest(dist + '/css'))
        .pipe(rev())
        .pipe(gulp.dest(dist + '/css'))
        .pipe(rev.manifest()) // CSS生成文件hash编码并生成 rev-manifest.json文件名对照映射
        .pipe(gulp.dest('rev/css'));
}

// js
async function js() {
    return await gulp.src('src/js/**')
        .pipe(Uglify()) // 压缩js
        // .pipe(gulp.dest(dist + '/js'))
        .pipe(rev())
        .pipe(gulp.dest(dist + '/js'))
        .pipe(rev.manifest()) // js生成文件hash编码并生成 rev-manifest.json文件名对照映射
        .pipe(gulp.dest('rev/js'));
}
async function html() {
    return gulp.src(['rev/**/*.json', 'src/views/*.html'])
        .pipe(revCollector({ // 利用rev-manifest.json完成html中url的替换
            replaceReved: true,
            dirReplacements: {
                // 'css': 'dist/css', // 将URL中的css替换为css,真实相同则不必写
                // 'js': 'js',
                // '//cdn': function(manifest_value) { // 如果使用了cdn可以这样写
                //     return '//cdn' + (Math.floor(Math.random() * 9) + 1) + '.' + 'exsample.dot' + '/img/' + manifest_value;
                // }
            }
        }))
        .pipe(FileInclude({ // HTML模板替换
            prefix: '##',
            basepath: '@file'
        }))
        .pipe(Minifyhtml())
        .on('error', function(err) {
            console.error('Task:copy-html,', err.message);
            this.end();
        })
        .pipe(gulp.dest(dist))
}
// image
async function image() {
    return await gulp.src('src/images/*')
        .pipe(Cache(Imagemin({
            optimizationLevel: 5, // 优化等级，默认值3 取值范围：0-7
            progressive: true, // 无损压缩jpg图片
            interlaced: true, // 隔行扫描gif进行渲染
            multipass: true, // 多次优化svg直到完全优化
            svgoPlugins: [{ removeViewBox: false }], // 不要移除svg的viewbox属性
            use: [Pngquant()] // 使用Pngquant插件深度压缩png图片
        })))
        .pipe(gulp.dest(dist + '/images')) // 拷贝
    }

    // clean
    async function clean() {
        return await gulp.src(dist, {allowEmpty: true})
            .pipe(Clean()); // 删除之前生成的文件
    }

    module.exports = {
        css,
        js,
        image,
        html,
        clean
    }