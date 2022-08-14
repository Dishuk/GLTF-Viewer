<template>
    <div id="app">
        <div class="loadingIndicator" ref="loadingIndicator" v-show="showLoadingIndicator">
            <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        </div>

        <div class="ui_tl">
            <div class="modelNameContainer container">
                <span>Model name: {{modelName}}</span>
            </div>
            

            <div class="btnsContainer container">
                <button @click="SwitchTextureOrWireframe(false)" class="pure-button">Texture</button>
                <button @click="SwitchTextureOrWireframe(true)" class="pure-button">Wireframe</button>
            </div>
            
            <div class="selectContainer container">
                <select @change="PlayAnimation($event)" class="animSelector">
                    <option class="pure-menu-item" ref="idle" value="-1" selected>Idle</option>
                    <option  v-for="(animation, index) in animationList" :key="index" :value=index class="pure-menu-item">{{animation.name}}</option>
                </select>
            </div>
        </div>

         <div class="ui_bl">
            <div class="btnsContainer container">
                <button @click="SetModelIndex(0)" class="pure-button">Model 1</button>
                <button @click="SetModelIndex(1)" class="pure-button">Model 2</button>
            </div>
        </div>
        <div ref="viewer" class="viewer"></div>
    </div>
</template>

<script>
    import * as GLTFViewer from '@/scripts/GLTFViewer.js'

    export default {
        name: 'App',
        data() {
            return {
                isWireframe: false,
                currentModel:0,
                modelName:"",
                animationList:[],

                showLoadingIndicator: true,
            };
        },
        mounted() {
            this.Init();
        },
        methods: {
            Init(){
                const viewerElement = this.$refs.viewer;
                GLTFViewer.Init(viewerElement, true);

                this.LoadModel ();
            },

            SwitchTextureOrWireframe(isWireframeView){
                this.isWireframe = isWireframeView;
                this.LoadModel();
            },

            SetModelIndex(modelIndex){
                this.currentModel = modelIndex;
                this.LoadModel();
            },

            LoadModel(){
                this.$refs.idle.selected = true;
                GLTFViewer.LoadModel(this.currentModel, this.isWireframe, this);
            },

            PlayAnimation(event){
                console.warn ();
                let animationIndex = parseInt(event.target.value);
                if (isNaN (animationIndex)){
                     console.error(new Error(`${event.target.value} is not a number!`));
                     return;
                }

                GLTFViewer.PlayAnimation(animationIndex);
            },

            UpdateModelInfo(animations, modelName){
                this.animationList = animations;
                this.modelName = modelName;
            },

            ShowLoadingIndicator (state){
                this.showLoadingIndicator = state;
            }
        },
    };
</script>

<style>
    @import '@/css/styles.css';
    @import 'purecss/build/pure.css';
</style>
