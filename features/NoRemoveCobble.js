const { FloydRegister, FloydKeybind } = global.floyd.DynamicReload
const { prefix } = global.floyd.utils
const obj = global.floyd.obj;

const key = new FloydKeybind("Cancel Break Cobble", Keyboard.KEY_NONE);

let localEnabled = false;

key.registerKeyPress(() => {
    localEnabled = !localEnabled;
    ChatLib.chat(`${prefix} Cancel Break Cobble: ${localEnabled ? "True" : "False"}.`)
})

FloydRegister("packetSent", (packet, event) => {
    if(!obj.NoStopCobble || !localEnabled || World.getBlockAt(new BlockPos(packet.func_179715_a())).type.getID() !== 4) return;
    cancel(event);
}).setFilteredClass(net.minecraft.network.play.client.C07PacketPlayerDigging);