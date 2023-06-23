import * as THREE from 'three';
import {addLights} from './lights.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {addCity} from './city.js'
import {VRButton} from './node_modules/three/examples/jsm/webxr/VRButton.js'
import {addControllers} from './controllers.js'
import { updateControllers } from './updateControllers.js';

let gridSize=25
let buildingMaxHeight= 20
let buildingBlockSize = 3
let controllers = []

/*
 TODO: Add controller interfacing:
	- Controllers seem to not move with dolly
	- Make them move with dolly.
*/


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




let out = addControllers(scene, renderer, camera, dolly)
scene = out[0]
renderer = out[1]
camera = out[2]
dolly = out[3]
renderer.setAnimationLoop( function () {
	
	controllers = updateControllers(renderer, controllers)
	if (controllers){
		const quaternion = camera.quaternion.normalize();
		const direction = new THREE.Vector3(0, 0, -1);
		direction.applyQuaternion(quaternion);
		if(controllers[0]['axes'][3]){
			let xrCamera = renderer.xr.getCamera();
			const yPosition = dolly.position.y
			const origQuaternion = dolly.quaternion.clone();
			const quaternionCamera = xrCamera.quaternion.clone()
			dolly.quaternion.copy(quaternionCamera)
			dolly.translateZ(0.08 * controllers[0]['axes'][3])
			dolly.position.y= yPosition
			dolly.quaternion.copy(origQuaternion)
		}

		if(controllers[0]['axes'][2]){
			let xrCamera = renderer.xr.getCamera();
			const yPosition = dolly.position.y
			const origQuaternion = dolly.quaternion.clone();
			const quaternionCamera = xrCamera.quaternion.clone()
			dolly.quaternion.copy(quaternionCamera)
			dolly.translateX(0.08 * controllers[0]['axes'][2])
			dolly.position.y= yPosition
			dolly.quaternion.copy(origQuaternion)
		}

		if (controllers[1]['axes'][2]){
			// dolly.rotateZ(-0.0314 * controllers[1]['axes'][2])
			console.log(dolly)
			console.log(scene)
			dolly.rotateOnWorldAxis(new THREE.Vector3(0,1,0), -0.0314 * controllers[1]['axes'][2])
		}

	}
	
	renderer.render( scene, camera );
} );
// function animate() {
// 	requestAnimationFrame( animate )

// 	renderer.render( scene, camera );
// }

// animate();