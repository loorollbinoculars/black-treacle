import * as THREE from 'three'

export function addLights(scene){
    const light = new THREE.AmbientLight(0x404040)
    scene.add(light)
    return scene
}