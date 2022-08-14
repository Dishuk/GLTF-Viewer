import * as THREE from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

//Camera setup
const FOV = 80;
const NEAR_PLANE = 0.01;
const FAR_PLANE = 1000;

//Scene setup
const INITIAL_DISTANCE_TO_MODEL = 8;
const MIN_DISTANCE_TO_MODEL = 6;
const MIN_DISTANCE_TO_WIREFRAME_MODEL = 2;
const MAX_DISTANCE_TO_MODEL = 15;

const SCENE_SIZE = 10;
const SCENE_BACKGROUND = 0xffffff;

//Wireframe
const WIREFRAME_MATERIAL = new THREE.MeshBasicMaterial({
    color: 0x000000,
    wireframe: true,
    transparent: true,
    opacity: 0.1
});

//Components
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({antialias:true});
const camera = new THREE.PerspectiveCamera(FOV, window.innerWidth/window.innerHeight , NEAR_PLANE, FAR_PLANE);
const loader = new GLTFLoader();
const cameraController = new OrbitControls(camera, renderer.domElement);
const clock = new THREE.Clock();
var animMixer;

var textureMaterial = [];


const MODELS = ['models/cartoon_sports_car/scene.gltf', 'models/le_tonneau_tavern/scene.gltf']

var currentModel;
var availableAnimations = [];

const LIGHT_SRC_TYPE = {
    AmbientLight: 'ambientLight',
    PointLight: 'pointLight'
}

const lightSourcesOnScene = {
    0:{
        type: LIGHT_SRC_TYPE.AmbientLight,
        color:0xffffff,
        intensity: 1,
        x: 0,
        y: 300,
        z: 0,
    },
    1:{
        type: LIGHT_SRC_TYPE.PointLight,
        color:0xffffff,
        intensity: 1,
        x: 300,
        y: 300,
        z: 300,
    },
    2:{
        type: LIGHT_SRC_TYPE.PointLight,
        color:0xffffff,
        intensity: 1,
        x: -300,
        y: 300,
        z: 300,
    },
    3:{
        type: LIGHT_SRC_TYPE.PointLight,
        color:0xffffff,
        intensity: 1,
        x: -300,
        y: 300,
        z: -300,
    },
    4:{
        type: LIGHT_SRC_TYPE.PointLight,
        color:0xffffff,
        intensity: 1,
        x: 300,
        y: 300,
        z: -300,
    },
}



export function Init(viewerElement){
    scene.background = new THREE.Color(SCENE_BACKGROUND);

    renderer.setSize(window.innerWidth, window.innerHeight);

    viewerElement.appendChild(renderer.domElement);

    window.addEventListener("resize", OnResizeWindow);

    Animation();
    CreateLightSourcesOnScene();
    CameraController();
}

export function PlayAnimation(animationIndex){
    animMixer.stopAllAction ();

    if (animationIndex >= 0){
        const clip = availableAnimations[animationIndex];
        const action = animMixer.clipAction( clip );
        action.play();
    } 
}

export function LoadModel(modelIndex, isWireframeView, vue){
    if (currentModel){
        scene.remove(currentModel);
    }

    vue.ShowLoadingIndicator (true);

    loader.load(MODELS[modelIndex], (model) => {
        
        let modelName = model?.asset?.extras?.title || "Unnamed model";
        availableAnimations = model.animations;

        vue.UpdateModelInfo(model.animations, modelName);

        let normalizedScene = NormalizeScene(model.scene);

        textureMaterial = {};

        let index = 0;
        normalizedScene.traverse((node) => {
            if (!node.isMesh) return;

            textureMaterial[index] = node.material;

            index++;
        });   

        currentModel = normalizedScene;
        animMixer = new THREE.AnimationMixer( normalizedScene );

        UpdateCameraSettings(normalizedScene, isWireframeView);

        scene.add(normalizedScene);
        vue.ShowLoadingIndicator (false);
    })
}

export function SwitchWireframeView(isWireframeView){

    let index = 0;
    currentModel.traverse((node) => {
        if (!node.isMesh) return;
            if  (isWireframeView){
                node.material = WIREFRAME_MATERIAL;
                node.material.needsUpdate = true;
            } else{
                node.material = textureMaterial[index];
                node.material.needsUpdate = true;
            }
            index++;
    }); 
    
}

function UpdateCameraSettings(target, isWireframeView){
    if  (isWireframeView){
        cameraController.minDistance = MIN_DISTANCE_TO_WIREFRAME_MODEL;
    } else{
        cameraController.minDistance = MIN_DISTANCE_TO_MODEL;
    }

    cameraController.target = target.position;
    camera.position.normalize().multiplyScalar(INITIAL_DISTANCE_TO_MODEL);
}

function CreateLightSourcesOnScene(){
    for (const [, lightSrcData] of Object.entries(lightSourcesOnScene)) {
        let lightSource;
        switch (lightSrcData.type){
            case LIGHT_SRC_TYPE.AmbientLight:
                lightSource = new THREE.AmbientLight(lightSrcData.color, lightSrcData.intensity);
                break;
            case LIGHT_SRC_TYPE.PointLight:
                lightSource = new THREE.PointLight(lightSrcData.color, lightSrcData.intensity);
                break;
        }
        lightSource.position.set (lightSrcData.x, lightSrcData.y, lightSrcData.z);
        scene.add (lightSource);
    }
}

function CameraController(){
    camera.position.set(SCENE_SIZE,SCENE_SIZE/2,SCENE_SIZE);
    cameraController.enableDamping = true;
    cameraController.minDistance = MIN_DISTANCE_TO_MODEL;
    cameraController.maxDistance = MAX_DISTANCE_TO_MODEL;
}

function NormalizeScene(scene){
    let box3 = new THREE.Box3().setFromObject( scene );
    let size = new THREE.Vector3();
    let modelSize = box3.getSize(size);

    let calculation = {
        x: SCENE_SIZE/modelSize.x,
        y: SCENE_SIZE/modelSize.y,
        z: SCENE_SIZE/modelSize.z,
    }
    
    let diff;
    if(calculation.x < calculation.z){
        diff = calculation.x;
    } else{
        diff = calculation.z;
    }
    
    scene.scale.set (diff, diff, diff)
    return scene;
}

function Animation(){
    cameraController.update();
    renderer.render(scene, camera);
    if (animMixer){
        animMixer.update(clock.getDelta());
    }
    requestAnimationFrame(Animation);
}

function OnResizeWindow(){
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}