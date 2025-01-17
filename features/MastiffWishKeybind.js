const { FloydRegister, FloydKeybind} = global.floyd.DynamicReload;
const { prefix, unpressAllMovementKeys, setSlot, pressAllPressedMovementKeys } = global.floyd.utils;
const toggle = global.floyd.ToggleNDMS

const C0EPacketClickWindow = Java.type("net.minecraft.network.play.client.C0EPacketClickWindow");
const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow");
const C0DPacketCloseWindow = Java.type("net.minecraft.network.play.client.C0DPacketCloseWindow")
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

function sendPacket(packet) {
    Client.sendPacket(packet);
}

FloydRegister("packetReceived", (packet, event) => {
    if(!shouldOpen) return;
    new Thread(() => {
        if(!first && !second) {
            Thread.sleep(50)
            sendPacket(new C0EPacketClickWindow(packet.func_148901_c(), 35 + mastiffSlot, 0, 0, null, 0));
            Thread.sleep(50)
            Client?.currentGui?.close()
            Thread.sleep(delay + 150)
            Player.getPlayer()?.func_71040_bB(false)
            ChatLib.command("wardrobe")
            first = true;
        } else if(first && !second) {
            sendPacket(new C0EPacketClickWindow(packet.func_148901_c(), 35 + ogArmourSlot, 0, 0, null, 0));
            Thread.sleep(50)
            Client?.currentGui?.close()
            Thread.sleep(50)
            ChatLib.chat(`${prefix} Finished Mastiff Wish!`)
            second = true;
            shouldOpen = false;
        } else if(first && second) {
            Client.currentGui.close()
            shouldOpen = false;
            toggle(true)
        }
    }).start()

}).setFilteredClass(S2DPacketOpenWindow)

register("renderOverlay", () => {
    if(!shouldOpen) return;
    Renderer.drawString("Mastiff Wishing", Renderer.screen.getWidth()/2 - (Renderer.getStringWidth("Mastiff Wishing") / 2), Renderer.screen.getHeight()/2, true)
})

function start() {
    if(!World.isLoaded() || !Server?.getIP()?.toLowerCase()?.includes('hypixel')) return;
    ChatLib.chat(`${prefix} Mastiff Wishing`)
    setSlot(swordSlot)
    toggle(false)
    Client.scheduleTask(1, () => {
        ChatLib.command("wardrobe")
        shouldOpen = true;
        first = false;
        second = false;
    })
}

register('tick', () => {
    if(shouldOpen && Client.isInGui()) pressAllPressedMovementKeys()
})
key.registerKeyPress(() => {
    start();
})