import * as THREE from 'three'

export function addLights(scene){
    const light = new THREE.AmbientLight(0xffffff, 1)
    
    const hemiLight = new THREE.DirectionalLight(0xffffff,1)
    hemiLight.position.set(10,10,5)
    hemiLight.rotateOnAxis(new THREE.Vector3(0,0,0),90)
    scene.add(hemiLight)
    scene.add(light)
    return scene
}