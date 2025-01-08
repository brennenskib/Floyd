const FloydRegister = global.floyd.DynamicReload.FloydRegister;
const serverAnimationPacket = Java.type("net.minecraft.network.play.server.S0BPacketAnimation")

let swinger;

FloydRegister('worldLoad', () => { // Set player
    swinger = Player.asPlayerMP().entityLivingBase
})

FloydRegister('tick', () => {
    if(!swinger) return;
    swinger.field_82175_bq = false;
})

FloydRegister('packetReceived', (packet, event) => {
    if(!packet.func_148977_d()) cancel(event);
}).setFilteredClass(serverAnimationPacket.class)