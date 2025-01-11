let prefix = `&l&8Floyd &r&l&f>&r&f`

const KeyBinding = Java.type("net.minecraft.client.settings.KeyBinding");

function isNullVec(e) { // "e" must be a minecraft entity, NOT a chattriggers entity
    return e.field_70165_t == 0 && e.field_70163_u == 0 && e.field_70161_v == 0 // posX, posY, posZ
}

function clearBlankStands() {
    if(!World.isLoaded()) return;
    const currentEnts = World?.getWorld()?.field_72996_f
    currentEnts.forEach(e => {
        if(e instanceof Java.type("net.minecraft.entity.item.EntityArmorStand")) {
            if(e.func_145818_k_()) return; // hasCustomName
            if(e.field_70173_aa < 1200) return; // ticksExisted
            if(e.field_145783_c == undefined) return; // this sometimes happens and sometimes doesnt idk why but :shrug:
            World.getWorld().func_73028_b(e.field_145783_c) // func_73028_b = removeEntityFromWorld || field_145783_c = entityId
        }
    })
}

// from Catgirl Yharim Addons, not me :)
function jump() {
    Client.scheduleTask(() => { KeyBinding.func_74510_a(Client.getMinecraft().field_71474_y.field_74314_A.func_151463_i(), true) })
    Client.scheduleTask(2, () => { KeyBinding.func_74510_a(Client.getMinecraft().field_71474_y.field_74314_A.func_151463_i(), false) })
}

const keybinds = [
    Client.getMinecraft().field_71474_y.field_74351_w.func_151463_i(),
    Client.getMinecraft().field_71474_y.field_74370_x.func_151463_i(),
    Client.getMinecraft().field_71474_y.field_74366_z.func_151463_i(),
    Client.getMinecraft().field_71474_y.field_74368_y.func_151463_i()
];

function stop() {
    Player.getPlayer().field_70159_w = 0;
    Player.getPlayer().field_70179_y = 0;
}
function unpressAllMovementKeys() {
    keybinds.forEach(keybind => KeyBinding.func_74510_a(keybind, false))
}

function pressAllPressedMovementKeys() {
    keybinds.forEach(keybind => KeyBinding.func_74510_a(keybind, Keyboard.isKeyDown(keybind))) // Press down all keys that are physically pressed
}

function setVelocity(x, y, z) {
    Player.getPlayer().func_70016_h(x, y, z);
}

function HClip() {
    const speed = Player.getPlayer().field_71075_bZ.func_75094_b() * 2.8;
    const onGround = Player.getPlayer().field_70122_E;
    if (onGround) {
        jump()
    }

    unpressAllMovementKeys();
    setVelocity(0, Player.getPlayer().field_70181_x, 0);

    Client.scheduleTask(0, () => {
        Player.getPlayer().field_70159_w = -Math.sin((Player.getYaw()) * Math.PI / 180) * speed;
        Player.getPlayer().field_70179_y = Math.cos((Player.getYaw()) * Math.PI / 180) * speed;
        pressAllPressedMovementKeys();
    })
}

const sneakBind = new KeyBind(Client.getMinecraft().field_71474_y.field_74311_E);
const jumpBind = new KeyBind(Client.getMinecraft().field_71474_y.field_74314_A);

const sneak = () => {
    sneakBind.setState(true)
    Client.scheduleTask(2, () => { sneakBind.setState(false) })
}

let inDungeon = false;

register("worldLoad", () => {
  inDungeon = false;
  Client.scheduleTask(150, () => {
    inDungeon = TabList.getNames()?.includes("§r       §r§3§lDungeon Stats§r");
  });
});

function isInDungeon() {
    return inDungeon;
}

function setToAir(x, y, z) {
    const pos = new BlockPos(x * 1, y * 1, z * 1);
    Client.getMinecraft().func_71410_x().field_71441_e.func_175698_g(pos.toMCBlock());
}

const mc = Client.getMinecraft();
const rightClickMethod = Client.getMinecraft().getClass().getDeclaredMethod("func_147121_ag", null);
const leftClickMethod = Client.getMinecraft().getClass().getDeclaredMethod("func_147116_af", null);

function rightClick() {
    rightClickMethod.setAccessible(true)
    rightClickMethod.invoke(Client.getMinecraft(), null);
}

function leftClick() {
    leftClickMethod.setAccessible(true)
    leftClickMethod.invoke(Client.getMinecraft(), null);
}

function setSlot(index) {
    Client.getMinecraft().field_71439_g.field_71071_by.field_70461_c = index;
}

function swapFromName(items) {
    index = Player?.getInventory()?.getItems()?.findIndex(item => item?.getName()?.toLowerCase()?.includes(items.toLowerCase()))
    if (index < 0 || index > 8) {
        ChatLib.chat(`${prefix} ${items} -> Not found in hotbar.`)
        return false;
    }

    setSlot(index);
    return true;
}

global.floyd.utils = { 
    mc,
    prefix, 
    isNullVec, 
    clearBlankStands, 
    jump, 
    HClip, 
    unpressAllMovementKeys, 
    pressAllPressedMovementKeys, 
    sneakBind, 
    jumpBind, 
    sneak, 
    stop,
    isInDungeon, 
    setToAir,
    leftClick,
    rightClick,
    swapFromName,
    setSlot
}