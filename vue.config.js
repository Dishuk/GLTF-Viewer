const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
    publicPath: process.env.NODE_ENV === 'production'
    ? '/GLTF-Viewer/'
    : '/',
    assetsDir: './',
    outputDir : './docs/',
    transpileDependencies: true,
})