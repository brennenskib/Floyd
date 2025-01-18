const C0EPacketClickWindow = Java.type("net.minecraft.network.play.client.C0EPacketClickWindow");
const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow");

class TerminalHandler {
    constructor() {
        this.windowId = false;

        register('guiOpened', (event) => {
            this.windowId = Client.currentGui.get()
            ChatLib.chat(this.windowId instanceof Java.type("me.odinmain.features.impl.floor7.p3.termsim.TermSimGui"))
        })

        register("tick", () => {
            if(Player.getContainer().getName() == "Click in order!") {
                click(this.getClickInOrderIndex());
            }
        })
    }
    
    getClickInOrderIndex() {
        let indexes = [];
        Player.getContainer().getItems().forEach((item, index) => {
            if (item?.getMetadata() === 14) {
                indexes[parseInt(item.getStackSize()) - 1] = index;
            } else return;
        });

        return indexes.find(index => index !== undefined)
    }

    click(slot) {
        new Thread(() => {
            let windowId = Player.getPlayer().field_71070_bA.field_75152_c
            ChatLib.chat(windowId)
            if (Client.currentGui.get() == null) return;
            Client.getMinecraft().field_71442_b.func_78753_a(windowId, slot, 2, 3, Player.getPlayer());
        }).start();
    }
}

new TerminalHandler();