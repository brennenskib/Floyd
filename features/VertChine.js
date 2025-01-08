const FloydRegister = global.floyd.DynamicReload.FloydRegister;
const obj = global.floyd.obj;

let S12 = Java.type("net.minecraft.network.play.server.S12PacketEntityVelocity");
let javaInt = Java.type("java.lang.Integer");

FloydRegister("packetReceived", (packet) => {
    if(!obj.Vertical_Chine) return;
    if(packet.func_149412_c() !== Player.getPlayer().func_145782_y() || !Player.getHeldItem()) return;
    let item = Player?.getHeldItem()?.getName()?.toLowerCase()

    let motX = S12.class.getDeclaredField("field_149415_b")
    let motY = S12.class.getDeclaredField("field_149416_c")
    let motZ = S12.class.getDeclaredField("field_149414_d")
    
    motX.setAccessible(true);
    motY.setAccessible(true);
    motZ.setAccessible(true);

    if(item.includes("jerry-chine")) {
        motX.set(packet, new javaInt(0))
        motY.set(packet, new javaInt(packet.func_149410_e()*1.0))
        motZ.set(packet, new javaInt(0))
    }
}).setFilteredClass(net.minecraft.network.play.server.S12PacketEntityVelocity)