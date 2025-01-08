const FloydKeybind = global.floyd.DynamicReload.FloydKeybind
const FloydRegister = global.floyd.DynamicReload.FloydRegister;
const prefix = global.floyd.utils.prefix;
const isInDungeon = global.floyd.utils.isInDungeon;
const Routes = global.floyd.RouteTils
const obj = global.floyd.obj;

const key = FloydKeybind('Secret Aura', Keyboard.KEY_NONE);

key.registerKeyPress(() => {
    obj.Secret_Aura = !obj.Secret_Aura;
    ChatLib.chat(`${prefix} Secret Aura: ${obj.Secret_Aura ? "On" : "Off"}`)
})

FloydRegister('step', () => {
    if(obj.Secret_Aura && isInDungeon()) {
        Routes.secretAura()
    }
}).setFps(5)

const C0DPacketCloseWindow = Java.type("net.minecraft.network.play.client.C0DPacketCloseWindow")
const equalsOneOf = (str, ...values) => values.includes(str);
const removeControlCodes = (str) => { return str.replace(/[\x00-\x1F\x7F]/g, '') }

let openedChests = 0;

register("packetReceived", (packet, event) => {
    if(!inDungeon || !equalsOneOf(removeControlCodes(packet.func_179840_c().func_150260_c()), "Chest", "Large Chest")) return;
    Client.sendPacket(new C0DPacketCloseWindow(packet.func_148901_c()));
    openedChests++;
    cancel(event);
}).setFilteredClass(net.minecraft.network.play.server.S2DPacketOpenWindow)