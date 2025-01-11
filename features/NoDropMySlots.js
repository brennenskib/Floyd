const FloydRegister = global.floyd.DynamicReload.FloydRegister;

const C07 = Java.type("net.minecraft.network.play.client.C07PacketPlayerDigging");

let localEnabled = true;

function Toggle(val) {
    localEnabled = val;    
}

FloydRegister('packetSent', (packet, event) => {
    if((packet.func_180762_c() == C07.Action.DROP_ALL_ITEMS && localEnabled) || (packet.func_180762_c() == C07.Action.DROP_ITEM && localEnabled)) cancel(event);
}).setPacketClass(C07.class)

global.floyd.ToggleNDMS = Toggle;