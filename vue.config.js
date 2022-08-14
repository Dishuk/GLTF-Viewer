const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
    publicPath: '/docs/',
    assetsDir: './',
    outputDir: './docs',
    transpileDependencies: true,
})