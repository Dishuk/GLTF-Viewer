const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
    publicPath: '/GLTF-Viewer/docs/',
    assetsDir: './',
    outputDir: './docs',
    transpileDependencies: true,
})