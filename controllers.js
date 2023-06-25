import * as THREE from "three";
import { XRControllerModelFactory } from "three/addons/webxr/XRControllerModelFactory.js";
import { XRHandModelFactory } from "three/addons/webxr/XRHandModelFactory.js";
import { updateControllers } from './updateControllers.js';

export function addControllers(scene, renderer, camera, dolly) {
	
	let hand1, hand2;
	let controller1, controller2;
	let controllerGrip1, controllerGrip2;
	controller1 = renderer.xr.getController(0);
	controller2 = renderer.xr.getController(1);

	const controllerModelFactory = new XRControllerModelFactory();
	const handModelFactory = new XRHandModelFactory();

	// Hand 1
	controllerGrip1 = renderer.xr.getControllerGrip(0);
	controllerGrip1.add(
		controllerModelFactory.createControllerModel(controllerGrip1)
	);
	controllerGrip1.name = "controllerGrip1"
	dolly.add(controllerGrip1);
	hand1 = renderer.xr.getHand(0);
	hand1.add(handModelFactory.createHandModel(hand1));
	hand1.name = "hand1"
	dolly.add(hand1);

	// Hand 2
	controllerGrip2 = renderer.xr.getControllerGrip(1);
	controllerGrip2.add(
		controllerModelFactory.createControllerModel(controllerGrip2)
	);
	controllerGrip2.name = "controllerGrip2"
	dolly.add(controllerGrip2);

	hand2 = renderer.xr.getHand(1);
	hand2.add(handModelFactory.createHandModel(hand2));
	hand2.name = "hand2"
	dolly.add(hand2);

	//

	const geometry = new THREE.BufferGeometry().setFromPoints([
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(0, 0, -1),
	]);

	const line = new THREE.Line(geometry);
	line.name = "line";
	line.scale.z = 5;

	controller1.add(line.clone());
	controller2.add(line.clone());
	// controllers

	dolly.add(controller1);
	dolly.add(controller2)

	// Add cube on controller:
	controller1.addEventListener("selectstart", (e) => {
		console.log("Pressing Down on left trigger!");
		let cuboid = new THREE.BoxGeometry(0.05, 0.05, 0.05);
		const cuboidMaterial = new THREE.MeshBasicMaterial({ color: 0x404040 });
		let _cuboid = new THREE.Mesh(cuboid, cuboidMaterial);
		_cuboid.position.set(...controller1.getWorldPosition(new THREE.Vector3))
		_cuboid.quaternion.set(...controller1.getWorldQuaternion(new THREE.Quaternion));
		scene.add(_cuboid);
	});

	controller2.addEventListener("selectstart", (e) => {
		console.log("Pressing Down on right controller");
		const quaternion = controller2.getWorldQuaternion(new THREE.Quaternion).normalize();
		const direction = new THREE.Vector3(0, 0, -1);
		direction.applyQuaternion(quaternion);
		let raycast = new THREE.Raycaster(
			controller2.getWorldPosition(new THREE.Vector3),
			direction,
			0.4,
			100
		);
		const intersections = raycast.intersectObjects(scene.children);
		for (let intersection of intersections) {
			if (intersection.object.type == "Mesh") {
				const points = [];
				points.push(
					new THREE.Vector3(
						intersection.point.x,
						intersection.point.y,
						intersection.point.z
					)
				);
				points.push(
					controller2.getWorldPosition(new THREE.Vector3)
				);
				const web = new THREE.BufferGeometry().setFromPoints(points);
				const webLine = new THREE.Line(
					web,
					new THREE.LineBasicMaterial({ color: 0x0000ff })
				);
				scene.add(webLine);
				try {
					dolly.position.y =
						intersection.object.geometry.parameters["height"];
					dolly.position.x = intersection.object.position.x;
					dolly.position.z = intersection.object.position.z;
				} catch (err) {}
				console.log("Controller 0");
				console.log(renderer.xr.getSession().inputSources[0]);
				console.log(renderer.xr.getController(0));
				console.log("Controller 1");
				console.log(
					renderer.xr
						.getSession()
						.inputSources[1].gamepad.buttons.map((b) => b.value)
				); // BUTTONS
				console.log(
					renderer.xr
						.getSession()
						.inputSources[1].gamepad.axes.slice(0)
				); // AXES
				break;
			}
		}
	});

	return [scene, renderer, camera, dolly];
}



export function controllerSticksAndButtons(renderer,controllers,camera,dolly){
	let session = renderer.xr.getSession()
	if (!session){
		return 
	}
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
			dolly.rotateOnWorldAxis(new THREE.Vector3(0,1,0), -0.0314 * controllers[1]['axes'][2])
		}

	}
}
