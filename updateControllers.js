import * as THREE from "three";

export function updateControllers(renderer,controllers){
    let session = renderer.xr.getSession()
    
    // All of these checks ensure a VR headset is connected. Weirdly I can't pack them all into one condition.
    if (!session){
        return 
    }
    if (session.inputSources.length==0){
        return 
    }
    try{
        session.inputSources[0].gamepad.buttons
    }
    catch(error){
        return 
    }
    /*
    AXES look like this:
    [0,0,0,0]
    UP [0,0,0,-1]
    DOWN [0,0,0,1]
    LEFT [0,0,-1,0]
    RIGHT [0,0,1,0]

    BUTTONS look like this:
    [0,0,0,0,0]
    [TRIGGER, GRIP, B?, JoystickClick, A]
    positive is 1
    Positive Trigger is [1,0,0,0,0]
    */

    let numControllers = session.inputSources.length
    // console.log(`Number of controllers connected: ${numControllers}`)
    controllers = []
    for(let i=0; i<numControllers; i++){
        let controller = session.inputSources[i]
        controllers.push({handedness: controller.handedness, buttons: controller.gamepad.buttons.map((b) => b.value),
        axes: controller.gamepad.axes.slice(0)})
    }
    return controllers
}