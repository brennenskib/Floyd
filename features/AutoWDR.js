/* 

WARNING:
Bad code, doesnt work :)

import { FloydRegister } from "../util/dynamic_reload";
import { prefix } from "../util/utils";
// slot 11;

const C0EPacketClickWindow = Java.type("net.minecraft.network.play.client.C0EPacketClickWindow");
const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow");

let shouldOpen = false;
let target = '';
let interval = 1;

FloydRegister(net.minecraftforge.client.event.GuiScreenEvent.DrawScreenEvent.Pre, event => {
	if(!shouldOpen) return;
    cancel(event);
})

FloydRegister("packetReceived", (packet, event) => {
    if(!shouldOpen) return;
    setTimeout(() => {
        Client.sendPacket(new C0EPacketClickWindow(packet.func_148901_c(), 11, 2, 0, null, 0));
        shouldOpen = false;
    }, 50)
}).setFilteredClass(S2DPacketOpenWindow)

let reporter = FloydRegister("step", () => {
    ChatLib.command(`wdr ${target}`)
    shouldOpen = true;
}).setFps(0.006)
reporter.unregister()

FloydRegister('command', (arg1, arg2) => {
    if(!arg1 || arg1  == '') return ChatLib.chat(`${prefix} Usage: /autowdr name interval-in-minutes`);
    target = arg1;
    interval = arg2 ? parseInt(arg2) : 1;
    reporter.register();
}).setCommandName('autowdr')
*/