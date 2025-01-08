const FloydRegister = global.floyd.DynamicReload.FloydRegister;
const rot = global.floyd.rot;
const { pressAllPressedMovementKeys, sneak, unpressAllMovementKeys, stop } = global.floyd.utils;

const BlockPoss = Java.type("net.minecraft.util.BlockPos");
const RightClickMouse = Client.getMinecraft().class.getDeclaredMethod('func_147121_ag')

let localClicked = [];
let BP = new BlockPoss(0, 0, 0);

RightClickMouse.setAccessible(true)

class RouteTils {
    constructor() {
        this.clicked = [];
    }

    AotvToPos(pos) {
        rot.snapLook(pos, 1500, function() {
            sneak()
            Client.scheduleTask(1, function() {
                RightClickMouse.invoke(Client.getMinecraft())
            })
        })
    }

    _180(angle) {
        return (angle - Math.floor(angle / 360 + 0.5) * 360);
    } 

    _getNeeded(neededAngle, currAngle) {
        if(!neededAngle) return;
        if(!currAngle) currAngle = [Player.getYaw(), Player.getPitch()]
        let yDiff = Math.abs(this._180(neededAngle[0]) - this._180(currAngle[0]))
        let pDiff = Math.abs(this._180(neededAngle[1] - this._180(currAngle[1])))
        return (yDiff+pDiff);
    }

    getAngles(ctBlock) {
        let eyes = Player.getPlayer().func_174824_e(1)

        let deltaX = ctBlock.getX() - eyes.field_72450_a;
        let deltaY = ctBlock.getY() - eyes.field_72448_b;
        let deltaZ = ctBlock.getZ() - eyes.field_72449_c;

        let dist = Math.sqrt(deltaX * deltaX + deltaZ * deltaZ)
        let pitch = -Math.atan2(dist, deltaY)
        let yaw = Math.atan2(deltaZ, deltaX)

        pitch = this._180(((pitch * 180.0) / Math.PI + 90.0) * - 1.0)
        yaw = this._180((yaw * 180.0) / Math.PI - 90.0)
        
        return [ yaw, pitch ]
    }

    shouldSecretAura = true;

    secretAura() {
        let playerPos = new BlockPoss(Math.floor(Player.getX()), Math.floor(Player.getY()), Math.floor(Player.getZ()))
        
        let iterable = BP.func_177980_a(
            playerPos.func_177963_a(4, 4, 4),
            playerPos.func_177963_a(-4, -4, -4)
        )

        let cacheBlock = false;
        let closestChange = 8005135; // hehe boobies

        iterable.forEach(arg => {
            let block = World.getBlockAt(new BlockPos(arg));
            if(localClicked.includes(block.toString())) return;
            
            if((block.type.getID() == 69 || block.type.getID() == 54 || block.type.getID() == 146) && Player.asPlayerMP().distanceTo(new BlockPos(arg)) < closestChange) {
                cacheBlock = block;
                closestChange = Player.asPlayerMP().distanceTo(new BlockPos(arg))
            }
        })
        
        if(cacheBlock instanceof Block) {
            if(Client.isInGui()) {
                return Client?.currentGui?.close()
            }

            unpressAllMovementKeys();
            stop();

            rot.snapLook(new net.minecraft.util.Vec3(cacheBlock.getX()+0.5, cacheBlock.getY()+0.5, cacheBlock.getZ()+0.5), 50, function() {
                interact(cacheBlock.pos.toMCBlock(), cacheBlock);
                pressAllPressedMovementKeys();
            })
        } else return;
    }
}

function interact(pos, test) {
    if(Client.isInChat() || Client.isInGui() || Client.getMinecraft().field_71462_r !== null) return;
    const penis = new BlockPos(pos)
    let y = penis.y
    if (y >= 133 && y <= 136) return
    
    Client.getMinecraft().field_71442_b.func_78765_e()

    if (Client.getMinecraft().field_71442_b.func_178890_a(
        Player.getPlayer(),
        World.getWorld(),
        Player.getHeldItem()?.itemStack ?? null,
        pos,
        net.minecraft.util.EnumFacing.func_176733_a(Player.getYaw()),
        new net.minecraft.util.Vec3(pos).func_72441_c(0, 0, 0)
    )) Player.getPlayer().func_71038_i()
    
    Client.getMinecraft().field_71442_b.func_78765_e()
    localClicked.push(test.toString())

    setTimeout(() => {
        if(Client.isInGui()) Client.currentGui.close();
    }, 100)
}

FloydRegister('worldLoad', () => {
    localClicked = [];
});

global.floyd.RouteTils = RouteTils;