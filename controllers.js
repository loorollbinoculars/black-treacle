import * as THREE from "three";
import { XRControllerModelFactory } from "three/addons/webxr/XRControllerModelFactory.js";
import { XRHandModelFactory } from "three/addons/webxr/XRHandModelFactory.js";

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
	dolly.add(controllerGrip1);
	hand1 = renderer.xr.getHand(0);
	hand1.add(handModelFactory.createHandModel(hand1));
	dolly.add(hand1);

	// Hand 2
	controllerGrip2 = renderer.xr.getControllerGrip(1);
	controllerGrip2.add(
		controllerModelFactory.createControllerModel(controllerGrip2)
	);
	dolly.add(controllerGrip2);

	hand2 = renderer.xr.getHand(1);
	hand2.add(handModelFactory.createHandModel(hand2));
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

	// Add cube on controller:
	controller1.addEventListener("selectstart", (e) => {
		console.log("Pressing Down on left trigger!");
		console.log(controller1);
		// add cube on controller
		let cuboid = new THREE.BoxGeometry(0.05, 0.05, 0.05);
		const cuboidMaterial = new THREE.MeshBasicMaterial({ color: 0x404040 });
		let _cuboid = new THREE.Mesh(cuboid, cuboidMaterial);
		_cuboid.position.x =
			controller1.position.x + controller1["parent"].position.x;
		_cuboid.position.y =
			controller1.position.y + controller1["parent"].position.y;
		_cuboid.position.z =
			controller1.position.z + controller1["parent"].position.z;

		_cuboid.rotation.set(...controller1.rotation);

		scene.add(_cuboid);
	});

	controller2 = renderer.xr.getController(1);
	dolly.add(controller2);
	controller2.addEventListener("selectstart", (e) => {
		console.log("Pressing Down on right controller");
		const quaternion = controller2.quaternion.normalize();
		const direction = new THREE.Vector3(0, 0, -1);
		direction.applyQuaternion(quaternion);

		let raycast = new THREE.Raycaster(
			new THREE.Vector3(
				controller2.position.x + controller2["parent"].position.x,
				controller2.position.y + controller2["parent"].position.y,
				controller2.position.z + controller2["parent"].position.z
			),
			direction,
			0.5,
			100
		);

		// let arrow = new THREE.ArrowHelper(raycast.ray.direction, raycast.ray.origin, 100, Math.random() * 0xffffff );

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
					new THREE.Vector3(
						controller2.position.x +
							controller2["parent"].position.x,
						controller2.position.y +
							controller2["parent"].position.y,
						controller2.position.z +
							controller2["parent"].position.z
					)
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

	return [scene, renderer, camera];
}
