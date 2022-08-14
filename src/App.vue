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
                <button @click="SwitchTextureOrWireframe(false)"
                :class="{'pure-button':true, 'button-selected':!isWireframe}">Texture</button>
                <button @click="SwitchTextureOrWireframe(true)"
                :class="{'pure-button':true, 'button-selected':isWireframe}">Wireframe</button>
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
                <button @click="SetModelIndex(0)"
                :class="{'pure-button':true, 'button-selected':currentModel==0}">Model 1</button>
                <button @click="SetModelIndex(1)"
                :class="{'pure-button':true, 'button-selected':currentModel==1}">Model 2</button>
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
                if (!this.showLoadingIndicator){
                    this.isWireframe = isWireframeView;

                    GLTFViewer.SwitchWireframeView(isWireframeView);
                }
            },

            SetModelIndex(modelIndex){
                if (!this.showLoadingIndicator){
                    this.currentModel = modelIndex;
                    this.LoadModel();
                }
            },

            LoadModel(){
                this.$refs.idle.selected = true;
                this.isWireframe = false;

                GLTFViewer.LoadModel(this.currentModel, this);
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
    @import './css/styles.css';
    @import 'purecss/build/pure.css';
</style>
