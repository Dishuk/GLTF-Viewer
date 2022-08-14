const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
    publicPath: '/',
    assetsDir: './',
    outputDir: './docs',
    transpileDependencies: true,
})