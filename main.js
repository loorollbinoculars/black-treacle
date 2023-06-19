import * as THREE from 'three';
import {addLights} from './lights.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {addCity} from './city.js'
import {VRButton} from './node_modules/three/examples/jsm/webxr/VRButton.js'
import {addControllers} from './controllers.js'

let gridSize=25
let buildingMaxHeight= 20
let buildingBlockSize = 3

/*
 TODO: Add controller interfacing:
	- Create controller status check on every frame
	- Create a previous controller object (or data storage or something)
	- Each frame, compare both objects and analyse changes, events, etc.
*/


// TODO: GOOD IDEA TO ADD HAMSTER TUBES TO THE WHOLE EXPERIENCE FOR SUPER FAST TRAVERSAL

let scene = new THREE.Scene();
scene = addLights(scene)
let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(-gridSize,buildingMaxHeight,10)

let renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

document.body.appendChild( renderer.domElement );
document.body.appendChild( VRButton.createButton( renderer ) );
renderer.xr.enabled = true;
const controls = new OrbitControls( camera, renderer.domElement );


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




let out = addControllers(scene, renderer, camera)
scene = out[0]
renderer = out[1]
camera = out[2]

renderer.setAnimationLoop( function () {

	renderer.render( scene, camera );

} );
// function animate() {
// 	requestAnimationFrame( animate )

// 	renderer.render( scene, camera );
// }

// animate();