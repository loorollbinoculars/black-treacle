import * as THREE from 'three'

export function addCity(scene, gridSize = 10, buildingBlockSize=2, buildingMaxHeight=7){
    let grid = []
    let gridElement = []
    for(let i=0; i<gridSize; i++){
        gridElement.push(0)
    }
    for(let i=0; i<gridSize; i++){
        grid.push(gridElement)
    }

    let newGrid = []
    let streetGap = false
    for (let row of grid){
        let newGridRow = []
        if(streetGap){
            newGrid.push(gridElement)
        }
        else{
            let contiguousBlockCounter = 0
            for (let element of row){
                if (contiguousBlockCounter >=buildingBlockSize){
                    contiguousBlockCounter = 0
                    newGridRow.push(0)
                    continue
                }else{
                    newGridRow.push(parseInt(Math.random()*buildingMaxHeight))
                    contiguousBlockCounter+=1
                }
            }
            newGrid.push(newGridRow)
        }
        streetGap  = !streetGap
    }
    console.log(newGrid)

    let x = -Math.floor(gridSize/2)
    let z = -Math.floor(gridSize/2)
    for (let row of newGrid){
        for (let height of row){
            if (height == 0){
                
            }else{
                const material = new THREE.MeshLambertMaterial( { color: '#'+(Math.random()*0xffffff).toString(16).substr(0,6) } );
                let building = new THREE.Mesh(new THREE.BoxGeometry(1,height,1), material)
                building.position.set(x+1, height/2, z+1)
                // console.log(`Add building at (0,0,0) of height ${height}`)
                scene.add(building);
            }
            
            x +=1
        }
        x=-Math.floor(gridSize/2)
        z+=1
    }
    // Add floor
    let _floor = new THREE.BoxGeometry(gridSize+2,0.1,gridSize+2);
    const floorMaterial = new THREE.MeshBasicMaterial({color:0x404040});
    const floor = new THREE.Mesh(_floor, floorMaterial);
    floor.position.set(0,-0.05,0)
    scene.add(floor)

    return scene
}