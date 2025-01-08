const FloydRegister = global.floyd.DynamicReload.FloydRegister;
const obj = global.floyd.obj;

const EntityEndermite = Java.type("net.minecraft.entity.monster.EntityEndermite")

FloydRegister("renderEntity", (ent, pos, pt, event) => {
    if(!obj.Thyst_Hider) return;
    if(ent instanceof EntityEndermite) {
        cancel(event);
        ent.func_70106_y()
    }
})