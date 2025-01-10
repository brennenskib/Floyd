const { FloydRegister, FloydKeybind} = global.floyd.DynamicReload;
const { prefix, unpressAllMovementKeys, isInDungeon, setSlot } = global.floyd.utils;

const C0EPacketClickWindow = Java.type("net.minecraft.network.play.client.C0EPacketClickWindow");
const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow");

const key = new FloydKeybind("Mastiff Wish")

let shouldOpen = false;

FloydRegister(net.minecraftforge.client.event.GuiScreenEvent.DrawScreenEvent.Pre, event => {
    if(shouldOpen) {
        cancel(event);
    }
})

let mastiffSlot = 1; 
let ogArmourSlot = 2;
let swordSlot = 0;

let first = false;
let second = false;

let tickDelay = 20;
let delay = tickDelay*50

FloydRegister("packetReceived", (packet, event) => {
    if(!shouldOpen) return;
    unpressAllMovementKeys()
    new Thread(() => {
        if(!first && !second) {
            // set wardrobe slot
            Thread.sleep(150)
            Client.sendPacket(new C0EPacketClickWindow(packet.func_148901_c(), 35 + mastiffSlot, 0, 0, null, 0));

            // close wardrobe
            Thread.sleep(150)
            Client.sendPacket(new C0EPacketClickWindow(packet.func_148901_c(), 49, 0, 0, null, 0));

            // set slot
            Thread.sleep(150)
            setSlot(0)
            ChatLib.chat(`${prefix} Waiting ${tickDelay}t/${delay}ms Before Wishing...`);

            // wait delay and drop item -> func_71040_bB == dropOneItem(false)
            Thread.sleep(delay + 150)
            Player.getPlayer()?.func_71040_bB(false)
            ChatLib.command("wardrobe")

            first = true;
        } else if(first && !second) {
            // swap back
            Thread.sleep(150)
            Client.sendPacket(new C0EPacketClickWindow(packet.func_148901_c(), 35 + ogArmourSlot, 0, 0, null, 0));

            // close gui
            Thread.sleep(150)
            Client.sendPacket(new C0EPacketClickWindow(packet.func_148901_c(), 49, 0, 0, null, 0));

            // wait before allowing gui's to render again
            Thread.sleep(150)
            ChatLib.chat(`${prefix} Finished Mastiff Wish!`)

            second = true;
            shouldOpen = false;
        } else if(first && second) {
            Client.currentGui.close()
            shouldOpen = false;
        }
    }).start()

}).setFilteredClass(S2DPacketOpenWindow)

function start() {
    if(isInDungeon() || !World.isLoaded() || !Server?.getIP()?.toLowerCase()?.includes('hypixel')) return;
    ChatLib.chat(`${prefix} Mastiff Wishing`)
    ChatLib.command("wardrobe")
    shouldOpen = true;
    first = false;
    second = false;
}

key.registerKeyPress(() => {
    start();
})