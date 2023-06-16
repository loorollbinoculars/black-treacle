import * as THREE from 'three';
import {addLights} from './lights.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {addCity} from './city.js'
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';
import { XRHandModelFactory } from 'three/addons/webxr/XRHandModelFactory.js';


let hand1, hand2;
let controller1, controller2;
let controllerGrip1, controllerGrip2;








let scene = new THREE.Scene();
scene = addLights(scene)
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(-2,1,5)

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

document.body.appendChild( renderer.domElement );
document.body.appendChild( VRButton.createButton( renderer ) );
renderer.xr.enabled = true;
const controls = new OrbitControls( camera, renderer.domElement );

scene = addCity(scene)

const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );
window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}


// controllers

				controller1 = renderer.xr.getController( 0 );
				scene.add( controller1 );

				controller2 = renderer.xr.getController( 1 );
				scene.add( controller2 );

				const controllerModelFactory = new XRControllerModelFactory();
				const handModelFactory = new XRHandModelFactory();

				// Hand 1
				controllerGrip1 = renderer.xr.getControllerGrip( 0 );
				controllerGrip1.add( controllerModelFactory.createControllerModel( controllerGrip1 ) );
				scene.add( controllerGrip1 );

				hand1 = renderer.xr.getHand( 0 );
				hand1.add( handModelFactory.createHandModel( hand1 ) );

				scene.add( hand1 );

				// Hand 2
				controllerGrip2 = renderer.xr.getControllerGrip( 1 );
				controllerGrip2.add( controllerModelFactory.createControllerModel( controllerGrip2 ) );
				scene.add( controllerGrip2 );

				hand2 = renderer.xr.getHand( 1 );
				hand2.add( handModelFactory.createHandModel( hand2 ) );
				scene.add( hand2 );

				//

				const geometry = new THREE.BufferGeometry().setFromPoints( [ new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, - 1 ) ] );

				const line = new THREE.Line( geometry );
				line.name = 'line';
				line.scale.z = 5;

				controller1.add( line.clone() );
				controller2.add( line.clone() );

				//


renderer.setAnimationLoop( function () {

	renderer.render( scene, camera );

} );
// function animate() {
// 	requestAnimationFrame( animate )

// 	renderer.render( scene, camera );
// }

// animate();