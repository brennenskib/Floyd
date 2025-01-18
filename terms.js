const C0EPacketClickWindow = Java.type("net.minecraft.network.play.client.C0EPacketClickWindow");
const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow");

class TerminalHandler {
    constructor() {
        this.windowId = false;
        
        this.colorList = {
            "light gray": "silver",
            "light grey": "silver",
            "wool": "white wool",
            "ink": "black ink",
            "lapis": "blue lapis",
            "cocoa": "brown cocoa"
        };

        // ChatLib.chat(this.windowId instanceof Java.type("me.odinmain.features.impl.floor7.p3.termsim.TermSimGui"))

        register('guiOpened', (event) => {
            this.windowId = Player.getPlayer().field_71070_bA.field_75152_c
            ChatLib.chat(this.windowId instanceof Java.type("me.odinmain.features.impl.floor7.p3.termsim.TermSimGui"))
        })

        /*
        register('packetReceived', (p, e) => {
            this.windowId = p.func_148901_c(); // getWindowId
        }).setFilteredClass(S2DPacketOpenWindow);
        */

        register("step", () => {
            if(Player.getContainer().getName() == "Click in order!") {
                this.click(this.getClickInOrderIndex());
            }

            if (Player.getContainer().getName().startsWith("Select all the ")) {
                ChatLib.chat(this.getColorIndex());
            }
        }).setFps(500)
    }
    
    getColorIndex() {
        let color = Player.getContainer().getName().match(/Select all the (.+) items!/)[1].toLowerCase();

        return Player.getContainer().getItems().findIndex((item, index) => {
            if (index === 0 || index === undefined) return false; // Ensure valid index
            let itemName = ChatLib.removeFormatting(item?.getName()).toLowerCase();
            Object.keys(this.colorList).forEach((key) => itemName = itemName.replace(key, this.colorList[key]));
            return itemName.includes(color) && index < 44;
        });
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