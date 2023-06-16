import * as THREE from 'three'

export function addLights(scene){
    const light = new THREE.AmbientLight(0xffffff)
    const hemiLight = new THREE.HemisphereLight(0xff0000, 0xffff00,10)
    scene.add(hemiLight)
    scene.add(light)
    return scene
}