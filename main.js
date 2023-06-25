import * as THREE from 'three';
import {addLights} from './lights.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {addCity} from './city.js'
import {VRButton} from './node_modules/three/examples/jsm/webxr/VRButton.js'
import { addControllers, controllerSticksAndButtons} from './controllers.js'
import { updateControllers } from './updateControllers.js';

let gridSize=30
let buildingMaxHeight= 20
let buildingBlockSize = 3
let controllers = []

// TODO: GOOD IDEA TO ADD HAMSTER TUBES TO THE WHOLE EXPERIENCE FOR SUPER FAST TRAVERSAL

let scene = new THREE.Scene();
scene = addLights(scene)
let camera = new THREE.PerspectiveCamera( 105, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(-gridSize,buildingMaxHeight,10)

let renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

document.body.appendChild( renderer.domElement );
document.body.appendChild( VRButton.createButton( renderer ) );
renderer.xr.enabled = true;
const controls = new OrbitControls( camera, renderer.domElement );
let dolly = new THREE.Object3D();
dolly.name = "dolly"
dolly.add(camera);
let dummyCam = new THREE.Object3D();
camera.add(dummyCam)
scene.add(dolly);

window.addEventListener("keypress", (event) => {
	switch(event.key){
		case 'd':
			dolly.position.y +=1
			break
		case 's':
			dolly.position.y -=1
			break
	}
})


scene = addCity(scene, gridSize, buildingBlockSize, buildingMaxHeight)

const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );
window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

[scene, renderer, camera, dolly] = addControllers(scene, renderer, camera, dolly)
renderer.setAnimationLoop( function () {
	
	controllerSticksAndButtons(renderer,controllers,camera,dolly)
	controls.update();
	renderer.render( scene, camera );
} );
