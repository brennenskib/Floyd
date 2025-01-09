const FloydKeybind = global.floyd.DynamicReload.FloydKeybind;
const FloydRegister = global.floyd.DynamicReload.FloydRegister;
const FloydFailsafes = global.floyd.Failsafe;
const MouseUngrab = global.floyd.MouseUngrab;

const prefix = global.floyd.utils.prefix;
const rot = global.floyd.rot;

const C07 = Java.type("net.minecraft.network.play.client.C07PacketPlayerDigging");

const gameSettings = Client.getMinecraft().field_71474_y;

const keyLeft = new KeyBind(gameSettings.field_74370_x);
const keyRight = new KeyBind(gameSettings.field_74366_z);
const keyForward = new KeyBind(gameSettings.field_74351_w);
const keyAttack = new KeyBind(gameSettings.field_74312_F);
const keySneak = new KeyBind(gameSettings.field_74311_E);

const left = 'left';
const right = 'right';
const forward = 'forward';

let cacheRewarp = JSON.parse(FileLib.read("Floyd", "farming_macro_data.json"));

let rewarp = cacheRewarp.set ? cacheRewarp.coords : { x: false, y: false, z: false };
let last = { x: false, y: false, z: false };
let angles = { yaw: 0.0720, pitch: 35 };

let direction = left;
let lastDirection = left;

let enabled = false;
let firstForward = false;

const keyBind = new FloydKeybind("Farming Macro", Keyboard.KEY_NONE);

const getMotion = () => {
    if(!last.x || !last.y || !last.z) {
        let x = Math.round(Player.getX())
        let y = Math.round(Player.getY())
        let z = Math.round(Player.getZ())

        last.x = x
        last.y = y
        last.z = z

        return false;
    } else {
        let x = Math.round(Player.getX())
        let y = Math.round(Player.getY())
        let z = Math.round(Player.getZ())

        let xChange = x - last.x
        let yChange = y - last.y
        let zChange = z - last.z

        last.x = x;
        last.y = y;
        last.z = z;

        let change = Math.abs(xChange + yChange + zChange) * 100;
        change += 1;

        return change;
    }
}

const pressKeys = () => {
    if(Client.isInGui()) {
        keyLeft.setState(false);
        keyAttack.setState(false);
        keyForward.setState(false);
        keyRight.setState(false);
        enabled = false;

        setTimeout(() => {
            keyLeft.setState(false);
            keyAttack.setState(false);
            keyForward.setState(false);
            keyRight.setState(false);
            
            FloydFailsafes.startFailsafe();
        }, 500)
        ChatLib.chat(`${prefix} Stopping... In Gui!!`)
    }

    if(direction == left) {
        keyForward.setState(false);
        keyRight.setState(false);

        keyLeft.setState(true);
        keyAttack.setState(true);
    } 
    
    if(direction == right) {
        keyForward.setState(false);
        keyLeft.setState(false);

        keyRight.setState(true);
        keyAttack.setState(true);
    }

    if(direction == forward) {
        keyAttack.setState(false);
        keyLeft.setState(false);
        keyRight.setState(false);

        keyForward.setState(true);
    }
}

const getPos = () => {
    return [
        Math.floor(Player.getX()),
        Math.floor(Player.getY()),
        Math.floor(Player.getZ())
    ]
}

const stopFly = (then) => {
    keySneak.setState(true);
    Client.scheduleTask(3, () => {
        keySneak.setState(false);
        if(then) then();
    })
}

const step = FloydRegister('step', () => {
    if(!enabled) return step.unregister();
    let mot = getMotion();

    let pos = getPos()
    if(rewarp[0] == pos[0] && rewarp[1] == pos[1] && rewarp[2] == pos[2]) {
        ChatLib.command('warp garden');
        return;
    } else {
        if(!mot) return;
        else {
            if(mot == 1) {
                if(direction == left) {
                    lastDirection = left;
                    direction = forward;
                    
                    setTimeout(() => {
                        pressKeys();
                    }, 10)
                }
    
                if(direction == right) {
                    lastDirection = right;
                    direction = forward;
                    
                    setTimeout(() => {
                        pressKeys();
                    }, 10)
                }
    
                if(direction == forward) {
                    if(firstForward) {
                        pressKeys()
                        firstForward = false;
                    } else {
                        if(lastDirection == right) {
                            lastDirection = forward;
                            direction = left;
                            setTimeout(() => {
                                pressKeys();
                            }, 10)
                        }
    
                        if(lastDirection == left) {
                            lastDirection = forward;
                            direction = right;
                            setTimeout(() => {
                                pressKeys();
                            }, 10)
                        }
                    
                        firstForward = true;
                    }
                }
            } else setTimeout(() => {
                pressKeys();
            }, 10)
        }
    }
}).setFps(5)

step.unregister();

keyBind.registerKeyPress(() => {
    if(enabled) {
        enabled = false;

        keyLeft.setState(false);
        keyAttack.setState(false);
        keyForward.setState(false);
        keyRight.setState(false);

        MouseUngrab.reGrabMouse();

        ChatLib.chat(`${prefix} Disabled Farming Macro.`)
    } else {
        ChatLib.chat(`${prefix} Enabling Farming Macro.`)
        
        Client.settings.getSettings().field_74320_O = 1;

        MouseUngrab.unGrabMouse();
        
        stopFly(() => {
            rot.toAngles(angles.yaw - Player.getYaw(), angles.pitch - Player.getPitch(), 150, () => {
                // restoring variables -> add new variables if needed in future !!
                last = { x: false, y: false, z: false };
                enabled = true;
                firstForward = true;
                direction = left;
                lastDirection = left;
    
                pressKeys();
                step.register();
            })
        })
    }
})

function writeCoords() {
    let set = (rewarp[0] !== false && rewarp[1] !== false && rewarp[2] !== false)

    FileLib.write("Floyd", "farming_macro_data.json", JSON.stringify({
        set: set,
        coords: rewarp
    }), true)
}

FloydRegister('worldLoad', () => {
    writeCoords()

    Client.scheduleTask(50, () => {
        if(enabled && World.isLoaded()) {
            enabled = false;

            keyLeft.setState(false);
            keyAttack.setState(false);
            keyForward.setState(false);
            keyRight.setState(false);
            
            FloydFailsafes.startFailsafe();
        }
    })
})

FloydRegister('command', () => {
    rewarp = getPos();
    writeCoords()
    ChatLib.chat('set rewarp to ' + getPos().toString())
}).setName('floydrewarp');

// to do:
// - simple failsafes
// - more complex farm designs with rotations needed mid-farm
// - more humanized (ts looks so badly like a bot)