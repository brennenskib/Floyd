const FloydRegister = global.floyd.DynamicReload.FloydRegister;
const isNullVec = global.floyd.utils.isNullVec;
const clearBlankStands = global.floyd.utils.clearBlankStands;

FloydRegister("step", () => { 
    const ents = World.getAllEntitiesOfType(Java.type("net.minecraft.client.entity.EntityOtherPlayerMP"))
    ents.forEach(e => {
        if(e.field_70128_L) {
            ents.remove(e)
        }

        if(isNullVec(e)) {
            if(e.field_145783_c == undefined) return; // this sometimes happens and sometimes doesnt idk why but :shrug:
            World.getWorld().func_73028_b(e.field_145783_c) // func_73028_b = removeEntityFromWorld || field_145783_c = entityId
        }
    })
    
    clearBlankStands()
}).setFps(0.03)