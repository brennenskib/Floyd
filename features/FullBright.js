const FloydRegister = global.floyd.DynamicReload.FloydRegister;
const obj = global.floyd.obj;

/*
DYNAMIC FULLBRIGHT: obsolete ;)
_______________________________

const EnumSkyblock = Java.type("net.minecraft.world.EnumSkyBlock")

function instantChange(toLevel) {
    if(!obj.FullBright) return; // i chose to put it here so its not in the render function :)
    let moveBy = toLevel - Client.getSettings().getSettings().field_74333_Y;
    Client.getSettings().getSettings().field_74333_Y = 1000000 //moveBy;
    Client.getSettings().getSettings().func_74303_b();
}

function map(x, is, ie, os, oe) {
    return (x - is) / (ie - is) * (oe - os) + os;
}

ConatusRegister('renderWorld', () => {
    let blockpos = new BlockPos(Client.getMinecraft().func_175606_aa().field_70165_t, Client.getMinecraft().func_175606_aa().func_174813_aQ().field_72338_b, Client.getMinecraft().func_175606_aa().field_70161_v).toMCBlock();
    let chunk = World.getWorld().func_175726_f(blockpos);

    let brightness = chunk.func_177443_a(blockpos, 0) + chunk.func_177413_a(EnumSkyblock.SKY, blockpos) + chunk.func_177413_a(EnumSkyblock.BLOCK, blockpos);
    let newBrightness = map(Math.min(brightness, 30), 0, 30, 12, 1)

    instantChange(newBrightness)
})
*/

FloydRegister('worldLoad', () => {
    //if(!obj.FullBright) Client.getSettings().getSettings().field_74333_Y = 1;
    /*else*/
    Client.getSettings().getSettings().field_74333_Y = 1000000;
    Client.getSettings().getSettings().func_74303_b();
})