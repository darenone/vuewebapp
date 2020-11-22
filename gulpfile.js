const gulp = require('gulp');

// 根据环境引入不同的配置文件
let buildConfig;
if(process.env.NODE_ENV === 'dev') {
    buildConfig = require('./build/gulp.dev');
    gulp.task('server', buildConfig.server); // 起一个本地服务器
} else {
    buildConfig = require('./build/gulp.prod');
    gulp.task('clean', buildConfig.clean); // 清理目录
}

gulp.task('html', buildConfig.html); // 打包html
gulp.task('js', buildConfig.js); // 打包js
gulp.task('css', buildConfig.css); // 打包css
gulp.task('image', buildConfig.image); // 打包iamge
// gulp.task('sources', gulp.series('html', gulp.parallel('js', 'css', 'image')));
gulp.task('sources', gulp.series('js', 'css', 'image', 'html'));
// 监听文件变化
gulp.task('watch', async () => {
    gulp.watch('src/views/*', gulp.series('html')); // 监听html变化
    gulp.watch('src/js/**', gulp.series('js')); // 监听js变化
    gulp.watch('src/css/*', gulp.series('css')); // 监听css变化
    gulp.watch('src/images/*', gulp.series('image')); // 监听image变化
});

if (process.env.NODE_ENV === 'dev') {
    gulp.task('dev', gulp.series('sources', 'server', 'watch'));
} else {
    gulp.task('build', gulp.series('sources'))
}