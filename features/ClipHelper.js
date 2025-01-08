const FloydKeybind = global.floyd.DynamicReload.FloydKeybind;
const prefix = global.floyd.utils.prefix;
const setToAir = global.floyd.utils.setToAir;

let localEnabled = false;

const key = new FloydKeybind("Clip Helper", Keyboard.KEY_NONE)
key.registerKeyPress(() => {
    localEnabled = !localEnabled
    ChatLib.chat(`${prefix} Clip Helper: ${localEnabled ? "On" : "Off"}`)
})

const BlockPoss = Java.type("net.minecraft.util.BlockPos");

function AroundThePlayer() {
    let playerPos = new BlockPoss(Math.floor(Player.getX()), Math.floor(Player.getY()), Math.floor(Player.getZ()))
    let iterable = BlockPoss.func_177980_a(
        playerPos.func_177963_a(1, 2, 1),
        playerPos.func_177963_a(-1, 0, -1)
    )

    iterable.forEach(bp => {
        let pos = new BlockPos(bp);
        let block = World.getBlockAt(pos);

        if(block.type.getID() == 69 || block.type.getID() == 54 || block.type.getID() == 146) return;
        setToAir(pos.x, pos.y, pos.z);
    })
}

register('tick', () => {
    if(!localEnabled) return;
    AroundThePlayer()
})