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

let gridSize=25
let buildingMaxHeight= 20
let buildingBlockSize = 3

// TODO: GOOD IDEA TO ADD HAMSTER TUBES TO THE WHOLE EXPERIENCE FOR SUPER FAST TRAVERSAL

let scene = new THREE.Scene();
scene = addLights(scene)
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(-gridSize,buildingMaxHeight,10)

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

document.body.appendChild( renderer.domElement );
document.body.appendChild( VRButton.createButton( renderer ) );
renderer.xr.enabled = true;
const controls = new OrbitControls( camera, renderer.domElement );

let dolly = new THREE.Object3D();
dolly.add(camera)
scene.add(dolly)

// let dummyCam = new THREE.Object3D();
// camera.add(dummyCam)


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


// controllers

controller1 = renderer.xr.getController( 0 );
dolly.add( controller1 );

controller1.addEventListener('selectstart', (e) =>{
	console.log('Pressing Down on left trigger!')
	console.log(controller1)
	// add cube on controller
	let cuboid = new THREE.BoxGeometry(0.05,0.05,0.05);
	const cuboidMaterial = new THREE.MeshBasicMaterial({color:0x404040});
    let _cuboid = new THREE.Mesh(cuboid, cuboidMaterial);
	_cuboid.position.x = controller1.position.x + controller1['parent'].position.x
	_cuboid.position.y = controller1.position.y + controller1['parent'].position.y
	_cuboid.position.z = controller1.position.z + controller1['parent'].position.z

	_cuboid.rotation.set(...controller1.rotation)

	scene.add(_cuboid)
})

controller1.addEventListener('selectend', (e)=>{
	console.log('Pressing Up on left controller')
})



controller2 = renderer.xr.getController( 1 );
dolly.add( controller2 );
controller2.addEventListener('selectstart', (e)=>{
	console.log('Pressing Down on right controller')
	const quaternion = controller2.quaternion.normalize()
	const direction = new THREE.Vector3(0,0,-1);
	direction.applyQuaternion(quaternion)

	let raycast = new THREE.Raycaster(new THREE.Vector3(
		controller2.position.x + controller2['parent'].position.x,
		controller2.position.y + controller2['parent'].position.y,
		controller2.position.z + controller2['parent'].position.z),
		direction, 0.01, 10)

	// let arrow = new THREE.ArrowHelper(raycast.ray.direction, raycast.ray.origin, 100, Math.random() * 0xffffff );
	const intersections = raycast.intersectObjects(scene.children)
	console.log('intersections:')
	console.log(intersections)
	for (let intersection of intersections){
		if (intersection.object.type == "Mesh"){
			console.log('The below is a mesh')
			console.log(intersection)
			dolly.position.x =intersection.object.position.x
			dolly.position.z = intersection.object.position.z
			dolly.position.y=intersection.object.geometry.parameters['height']
			console.log('dolly:')
			console.log(dolly)
			break
		}
	}

	// // Add line between controllers:

	// let lineMaterial = new THREE.LineBasicMaterial({color: 0x0000ff})
	// const lineGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(
	// 	controller2.position.x + controller2['parent'].position.x,
	// 	controller2.position.y + controller2['parent'].position.y,
	// 	controller2.position.z + controller2['parent'].position.z),
	// 	new THREE.Vector3(
	// 		controller1.position.x + controller1['parent'].position.x,
	// 		controller1.position.y + controller1['parent'].position.y,
	// 		controller1.position.z + controller1['parent'].position.z)])
	// const line = new THREE.Line(lineGeometry, lineMaterial)
	// scene.add(line)
	console.log(raycast)
	console.log()
})


const controllerModelFactory = new XRControllerModelFactory();
const handModelFactory = new XRHandModelFactory();

// Hand 1
controllerGrip1 = renderer.xr.getControllerGrip( 0 );
controllerGrip1.add( controllerModelFactory.createControllerModel( controllerGrip1 ) );
dolly.add( controllerGrip1 );
hand1 = renderer.xr.getHand( 0 );
hand1.add( handModelFactory.createHandModel( hand1 ) );
dolly.add( hand1 );

// Hand 2
controllerGrip2 = renderer.xr.getControllerGrip( 1 );
controllerGrip2.add( controllerModelFactory.createControllerModel( controllerGrip2 ) );
dolly.add( controllerGrip2 );

hand2 = renderer.xr.getHand( 1 );
hand2.add( handModelFactory.createHandModel( hand2 ) );
dolly.add( hand2 );

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