//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

//Create a Three.JS Scene
const scene = new THREE.Scene();
//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//Keep track of the mouse position, so we can make the eye move
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

//Keep the 3D brainObject on a global variable so we can access it later

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

//Load the brain model
let brainObject;
loader.load(
  "assets/models/brain/scene.gltf",
  function (gltf) {
    //If the file is loaded, add it to the scene
    brainObject = gltf.scene;
    scene.add(brainObject);
  },
  function (xhr) {
    //While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    //If there is an error, log it
    console.error(error);
  }
);

//Load the eyes models
let leftEye, rightEye;
loader.load(
  "assets/models/eye/scene.gltf",
  function (gltf) {
    //If the file is loaded, add it to the scene
    leftEye = gltf.scene;
    scene.add(leftEye);
    gltf.scene.scale.set(70, 70, 70)
    gltf.scene.position.set(52, 18, 12)
  },
  function (xhr) {
    //While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    //If there is an error, log it
    console.error(error);
  }
);
loader.load(
    "assets/models/eye/scene.gltf",
    function (gltf) {
        //If the file is loaded, add it to the scene
        rightEye = gltf.scene;
        scene.add(rightEye);
        gltf.scene.scale.set(70, 70, 70)
        gltf.scene.position.set(52, 18, -12)
    },
    function (xhr) {
      //While it is loading, log the progress
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
      //If there is an error, log it
      console.error(error);
    }
  );

//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

//Add the renderer to the DOM
document.getElementById("scene").appendChild(renderer.domElement);

//Set how far the camera will be from the 3D model
camera.position.z = 140;

//Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 1.1); // (color, intensity)
topLight.position.set(500, 500, 500) //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, 3);
scene.add(ambientLight);

scene.rotation.y = -Math.PI / 2 + 0.4
scene.rotation.x = 0.1

//This adds controls to the camera, so we can rotate / zoom it with the mouse
let controls = new OrbitControls(camera, renderer.domElement);

//Render the scene
function animate() {
    requestAnimationFrame(animate);
    //Here we could add some code to update the scene, adding some automatic movement

    //Make the eye move
    if (leftEye && rightEye) {
        //I've played with the constants here until it looked good 
        leftEye.rotation.y = Math.PI - 3 + mouseX / window.innerWidth * 3;
        leftEye.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
        rightEye.rotation.y = Math.PI - 3 + mouseX / window.innerWidth * 3;
        rightEye.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
    }
    renderer.render(scene, camera);
}

//Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

//add mouse position listener, so we can make the eye move
document.onmousemove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

//Start the 3D rendering
animate();