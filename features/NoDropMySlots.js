const FloydRegister = global.floyd.DynamicReload.FloydRegister;

const C07 = Java.type("net.minecraft.network.play.client.C07PacketPlayerDigging");

FloydRegister('packetSent', (packet, event) => {
    if(packet.func_180762_c() == C07.Action.DROP_ALL_ITEMS || packet.func_180762_c() == C07.Action.DROP_ITEM) cancel(event);
}).setPacketClass(C07.class)