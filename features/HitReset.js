const obj = global.floyd.obj;
const FloydRegister = global.floyd.DynamicReload.FloydRegister;
const prefix = global.floyd.utils.prefix;

let rc = new KeyBind(Client.getMinecraft().field_71474_y.field_74313_G)
let C0B = Java.type("net.minecraft.network.play.client.C02PacketUseEntity");
let index = 1;

FloydRegister('packetSent', (packet,event) => {
    if(!obj.WTap || packet.func_149565_c() !== C0B.Action.ATTACK) return;
    index++
    new Message(`${prefix} WTap §r§7(${index})`).setChatLineId(104020).chat()
    rc.setState(true);
    setTimeout(() => {
        rc.setState(false);
    }, 60)
}).setFilteredClass(C0B)