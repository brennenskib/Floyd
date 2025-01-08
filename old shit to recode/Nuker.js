import RenderLibV2 from "../../../RenderLibV2/index"

const utils = global.conatus.MBUtils
const rot = global.floyd.rot;

const MathHelper = Java.type("net.minecraft.util.MathHelper");
const C07PacketPlayerDigging = Java.type("net.minecraft.network.play.client.C07PacketPlayerDigging");
const mcBlockPos = Java.type("net.minecraft.util.BlockPos");
const AABB = Java.type("net.minecraft.util.AxisAlignedBB");
const MCBlocks = Java.type('net.minecraft.init.Blocks');

let mined = [];
let realBrokenBlocks = [];

let enabled = false;
let globalBlock = false;

class MiningBlock {
    constructor(array) {
        this.blockid = array[0];
        this.metadata = array[1];
    }

    /**
     * @param {Block} block
     * @returns {Boolean}
     */
    equals(block) {
        return block.getMetadata() === this.metadata && block.type.getID() === this.blockid;
    }

    /**
     * this function is created to save performance
     * @param {Number} blockid
     * @param {Number} metadata
     * @returns {Boolean}
     */
    equalsNumbers(blockid, metadata) {
        return blockid === this.blockid && metadata === this.metadata;
    }
}

function wrapAngleTo180(angle) {
    return (angle - Math.floor(angle / 360 + 0.5) * 360);
} 

function getNeeded(neededAngle, currAngle) {
    if(!neededAngle) return;
    if(!currAngle) currAngle = [Player.getYaw(), Player.getPitch()];

    let yDiff = Math.abs(wrapAngleTo180(neededAngle[0]) - wrapAngleTo180(currAngle[0]))
    let pDiff = Math.abs(wrapAngleTo180(neededAngle[1] - wrapAngleTo180(currAngle[1])))
    return (yDiff+pDiff);
}

function getAngles(vector) {
    if(vector == undefined || !vector) return;
    function to180(angle) {
        angle %= 360.0
        while (angle >= 180.0)
        angle -= 360.0
        while (angle < -180.0)
        angle += 360.0
        return angle
    }

    let eyes = Player.getPlayer().func_174824_e(1)
    let diffX = vector.field_72450_a - eyes.field_72450_a
    let diffY = vector.field_72448_b - eyes.field_72448_b
    let diffZ = vector.field_72449_c - eyes.field_72449_c
    let dist = Math.sqrt(diffX * diffX + diffZ * diffZ)
    let pitch = -Math.atan2(dist, diffY)
    let yaw = Math.atan2(diffZ, diffX)

    pitch = to180(((pitch * 180.0) / Math.PI + 90.0) * -1.0 - Player.getPlayer().field_70125_A)
    yaw = to180((yaw * 180.0) / Math.PI - 90.0 - Player.getPlayer().field_70177_z)

    return [ yaw, pitch ]
}

function setToAir(bp) {
    World.getWorld().func_175656_a(
        bp, 
        MCBlocks.field_150350_a.func_176223_P()
    )
};

function getVectorFromRotation(pitch, yaw) {
    let f2 = -Math.cos(-pitch * 0.017453292);
    return new net.minecraft.util.Vec3(
        Math.sin(-yaw * 0.017453292 - Math.PI) * f2,
        Math.sin(-pitch * 0.017453292), 
        Math.cos(-yaw * 0.017453292 - Math.PI) * f2
    );
}

function getEnumFacing(vec3) {
    let x = MathHelper.func_76128_c(vec3.field_72450_a)
    let y = MathHelper.func_76128_c(vec3.field_72448_b)
    let z = MathHelper.func_76128_c(vec3.field_72449_c)

    let eyePos = Player.getPlayer().func_174824_e(1);
    let blockLookvec = getVectorFromRotation(getAngles(vec3)[1], getAngles(vec3)[0])

    function calcIntercept(aabb, range, blv, ep) {
        return aabb.func_72327_a(ep, ep.func_72441_c(blv.field_72450_a * range, blv.field_72448_b * range, blv.field_72449_c * range))
    }

    let pos = calcIntercept(new AABB(x, y, z, x + 1, y + 1, z + 1), 50, blockLookvec, eyePos)
    return (pos != null) ? pos.field_178784_b : null;
}

function sendBreakBlockPacket(bp, enumFacing) {
    if(!enumFacing) return breakBlock(bp, Player.getPlayer().func_174811_aO().func_176734_d());
    else {
        Client.sendPacket(
            new C07PacketPlayerDigging(
                C07PacketPlayerDigging.Action.START_DESTROY_BLOCK,
                bp,
                enumFacing
            )
        )

        Player.getPlayer().func_71038_i();
    }
}

function breakBlock(bp) {
    if(World.getBlockAt(bp).type.getID() == 0 || World.getBlockAt(bp).type.getID() == 7) return;
    let enumFacing = getEnumFacing(new net.minecraft.util.Vec3(bp.x, bp.y, bp.z))
    let mcBlockPos = bp.toMCBlock();
    let blockPos = new BlockPos(bp);

    if(mined.some(used => used == mcBlockPos)) return;

    sendBreakBlockPacket(mcBlockPos, enumFacing);
    setToAir(mcBlockPos);

    mined.push(mcBlockPos);

    setTimeout(() => {
        if(realBrokenBlocks.find(
            arr => arr[0] == blockPos.getX() && 
            arr[1] == blockPos.getY() && 
            arr[2] == blockPos.getZ()
        )) return realBrokenBlocks.splice(
            realBrokenBlocks.findIndex(
                arr => arr[0] == blockPos.getX() && 
                arr[1] == blockPos.getY() && 
                arr[2] == blockPos.getZ()
            ), 
            1
        ); else { 
            setToAir(mcBlockPos);
        }
    }, 250);
}

function containsBlock(block = Block) {
    if(mined.some(used => used == block.pos)) return;
    
    block.getMetadata();
    let blockid = block.type.getID();
    
    if(blockid == 1) return true;
    else return false;
}

function getClosest(rad, h, d) {
    let playerPos = new BlockPos(Math.floor(Player.getX()), Math.floor(Player.getY()), Math.floor(Player.getZ()))
    let vecTop = new BlockPos(rad, h, rad)
    let vecBot = new BlockPos(rad, d, rad)

    let block = false;
    let lookVec = false;
    let coordArr = false;
    let dist = 1000;

    mcBlockPos.func_177980_a(playerPos.subtract(vecBot).toMCBlock(), playerPos.add(vecTop).toMCBlock()).forEach(bp => {
        let wrapped = new BlockPos(bp);
        let csp = rot.canSeePos(wrapped, true);

        if(containsBlock(World.getBlockAt(wrapped.x, wrapped.y, wrapped.z))) {
            if(!csp.result || !csp.point || csp.point == undefined) return;
            let arr = [ wrapped.x, wrapped.y, wrapped.z ]
            if(
                mined.find(
                    val => val == new BlockPos(
                        arr[0], 
                        arr[1], 
                        arr[2]
                    ).toMCBlock()
                )
            ) return;

            let a = getAngles(csp.point)

            if(!block) { 
                block = wrapped;
                lookVec = csp.point;
                coordArr = arr
                dist = Player.asPlayerMP().distanceTo(wrapped)
            } else {
                let b = rot.canSeePos(block, true).point
                b = getAngles(b)  
                
                if(block == undefined || !block || getNeeded(a) > getNeeded(b)) return;
                if(Player.asPlayerMP().distanceTo(wrapped) > dist) return;
                else {
                    block = wrapped;
                    lookVec = csp.point;
                    coordArr = arr;
                    dist = Player.asPlayerMP().distanceTo(wrapped);
                }   
            }
        }
    })

    if(!block || !lookVec || !coordArr) return false;
    else return [ block , lookVec, coordArr ];
}

register('tick', () => {
    if(!enabled) return;
    if(!globalBlock) {
        let b = getClosest(4, 3, 0)

        if(!b || b == undefined) return;
        else {
            globalBlock = b;
            if(!globalBlock[1] || !globalBlock[0]) return globalBlock = false;
        }
    } else {
        if(rot.isWorking()) return;
        if(!globalBlock[0] || !globalBlock[1]) return;
        breakBlock(new BlockPos(globalBlock[2][0], globalBlock[2][1], globalBlock[2][2]))
        globalBlock = false;
    }
})

/*
    powderStateChange(bool) {
        this.enabled = bool;
        this.globalBlock = false;
        this.enabled ? ChatLib.chat(`§l§3[§bConatus§3] §r§fEnabled by Powder Chest Opener.`) : ChatLib.chat(`§l§3[§bConatus§3] §r§fDisabled by Powder Chest Opener.`) 
    }
*/
class NukerV2 {
    constructor() {
        this.rot = new global.conatus.Rotation(35);
        this.ut = new utils();
        this.key = new KeyBind("Nuker V2", Keyboard.KEY_NONE, "Conatus")

        this.czeroseven = Java.type("net.minecraft.network.play.client.C07PacketPlayerDigging");
        this.MathHelper = Java.type("net.minecraft.util.MathHelper");
        this.bp = Java.type("net.minecraft.util.BlockPos")
        this.aabb = Java.type("net.minecraft.util.AxisAlignedBB")

        this.enabled = false;
        this.globalBlock = false;

        this.whitelist = [];
        this.mined = [];
        this.config = [];

        this.pce = new global.conatus.pce()
        this.realBrokenBlocks = [];
        this.MCBlocks = Java.type('net.minecraft.init.Blocks')
        this.whitelist.push(new MiningBlock([1,0]));
        this.config.push(4)
        this.config.push(3)
        this.config.push(0)

        this.color = {r: 1, g: 0, b: 0};
        
        register('step', () => {
            if(!this.enabled) return;
            this.mined.splice(0, this.mined.length/2)
            this.realBrokenBlocks.splice(0, this.realBrokenBlocks.length/2)
        }).setFps(0.1)

        this.key.registerKeyPress(() => {
            this.globalBlock = false;
            this.enabled = !this.enabled;
            this.pce.setStatus(this.enabled);
            this.enabled ? ChatLib.chat(`§l§3[§bConatus§3] §r§fEnabled.`) : ChatLib.chat(`§l§3[§bConatus§3] §r§fDisabled.`);
        })

        register('packetReceived', (packet, event) => {
            let bp = new BlockPos(packet.func_179827_b())
            if(Player.asPlayerMP().distanceTo(bp) > 12) return;
            if(packet.func_180728_a().toString().includes("air")) {
                this.realBrokenBlocks.push([bp.getX(), bp.getY(), bp.getZ()])
            }
        }).setFilteredClass(net.minecraft.network.play.server.S23PacketBlockChange)
    }

    tick() {
        if(!this.enabled) return;
        if(!this.globalBlock) {
            let b = this.getClosest(this.config[0], this.config[1], this.config[2])
            if(!b || b == undefined) return;
            else {
                this.globalBlock = b;
                if(!this.globalBlock[1] || !this.globalBlock[0]) return this.globalBlock = false;
            }
        } else {
            if(this.rot.getWorking()) return;
            if(!this.globalBlock[0] || !this.globalBlock[1]) return;

            Player.getPlayer().func_71038_i();
            this._breakBlock(new BlockPos(this.globalBlock[2][0], this.globalBlock[2][1], this.globalBlock[2][2]))
            this.globalBlock = false;
        }
    }


    render() {
        if(!this.globalBlock||!this.globalBlock[0]||!this.globalBlock[1]) return;
        let x = this.globalBlock[0].getX()
        let y = this.globalBlock[0].getY()
        let z = this.globalBlock[0].getZ()
        RenderLibV2.drawEspBoxV2(x+0.5, y, z+0.5, 0.3, 0.3, 0.3, this.color.r, this.color.g, this.color.b, 1, true, 2)
    }

    step(step, speed = 1) {
        const red = Math.round((Math.sin(step / speed) + 0.75) * 170);
        const green = Math.round((Math.sin(step / speed + (2 * Math.PI) / 3) + 0.75) * 170);
        const blue = Math.round((Math.sin(step / speed + (4 * Math.PI) / 3) + 0.75) * 170);
        this.color.r = red;
        this.color.g = green;
        this.color.b = blue;
    }

    powderStateChange(bool) {
        this.enabled = bool;
        this.globalBlock = false;
        this.enabled ? ChatLib.chat(`§l§3[§bConatus§3] §r§fEnabled by Powder Chest Opener.`) : ChatLib.chat(`§l§3[§bConatus§3] §r§fDisabled by Powder Chest Opener.`) 
    }
}

let nuker = new NukerV2();

register('step', (elapsed) => {
    nuker.step(elapsed, 0.1)
}).setFps(20)

register('tick', () => {
    nuker.tick();
})

register('renderWorld', () => {
    nuker.render();
})