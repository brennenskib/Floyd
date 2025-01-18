const C0EPacketClickWindow = Java.type("net.minecraft.network.play.client.C0EPacketClickWindow");
const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow");

class TerminalHandler {
    constructor() {
        this.windowId = false;
        
        this.colorList = {
            "silver": "light gray",
            "white wool": "wool",
            "black ink": "ink",
            "blue lapis": "lapis",
            "brown cocoa": "cocoa",
            "purple": "purple",
            "black": "black",
            "pink": "pink",
            "lime": "lime",
            "brown": "brown",
            "light blue": "light blue",
            "yellow": "yellow",
            "magenta": "magenta",
            "cyan": "cyan",
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

        register("tick", () => {
            if(Player.getContainer().getName() == "Click in order!") {
                this.click(this.getClickInOrderIndex());
            }

            if (Player.getContainer().getName().startsWith("Select all the ")) {
                this.click(this.getColorIndex());
            }
        })//.setFps(500)
    }
    
    getColorIndex() {
        let color = Player.getContainer().getName().match(/Select all the (.+) items!/)[1].toLowerCase();

        ChatLib.chat(color)
        return Player.getContainer().getItems().findIndex((item, index) => {
            let itemName = ChatLib.removeFormatting(item?.getName()).toLowerCase();
            Object.keys(this.colorList).forEach((key) => itemName = itemName.replace(key, this.colorList[key]));
            ChatLib(itemName.includes(color) && index < 44 ? index : "false");
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
            //if (Client.currentGui.get() == null) return;
            Client.getMinecraft().field_71442_b.func_78753_a(windowId, slot, 2, 3, Player.getPlayer());
        }).start();
    }
}

new TerminalHandler();