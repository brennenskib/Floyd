const { FloydRegister } = global.floyd.DynamicReload;
const { prefix, unpressAllMovementKeys, isInDungeon } = global.floyd.utils;

import WebSocket from "../WebSocket/index";

const C0EPacketClickWindow = Java.type("net.minecraft.network.play.client.C0EPacketClickWindow");
const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow");

let shouldOpen = false;

FloydRegister(net.minecraftforge.client.event.GuiScreenEvent.DrawScreenEvent.Pre, event => {
	if(shouldOpen) {
        cancel(event);
    }
})

FloydRegister("packetReceived", (packet, event) => {
    if(!shouldOpen) return;
    unpressAllMovementKeys()
    setTimeout(() => {
        Client.sendPacket(new C0EPacketClickWindow(packet.func_148901_c(), 11, 0, 0, null, 0));
        setTimeout(() => {
            shouldOpen = false;
        }, 250)
    }, 750)
}).setFilteredClass(S2DPacketOpenWindow)

function reportUser(user) {
    if(isInDungeon() || !World.isLoaded() || !Server?.getIP()?.toLowerCase()?.includes('hypixel')) return;
    ChatLib.chat(`${prefix} AutoWDR: Reporting ${user}!`)
    ChatLib.command(`wdr ${user}`)
    shouldOpen = true;
}

FloydRegister("chat", () => {
    shouldOpen = false;
}).setCriteria("Please wait before reporting this player again!")

const ws = new WebSocket("ws://23.94.85.179:8080")

ws.onMessage = (msg) => {
    const jsn = JSON.parse(msg.toString())
    reportUser(jsn.user)
}

ws.onClose = () => {
    ChatLib.chat(`${prefix} socket gone :(`)
}

FloydRegister('gameUnload', () => {
    ws.close()
})

ws.connect();