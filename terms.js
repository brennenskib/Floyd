const C0EPacketClickWindow = Java.type("net.minecraft.network.play.client.C0EPacketClickWindow");
const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow");

class TerminalHandler {
    constructor() {
        this.inTerm = false;
        this.correctPanes = [];
        this.colorList = {
            "light gray": "silver",
            "light grey": "silver",
            "wool": "white wool",
            "ink": "black ink",
            "lapis": "blue lapis",
            "cocoa": "brown cocoa"
        };

        this.colorCycle = [4, 13, 11, 14, 1];

        register("tick", () => {
            //if (obj.AutoTerms && isFloor7()) {
                if(Player.getContainer().getName() == "Click in order!") {
                    this.clickTerms(this.getClickInOrderIndex());
                }
            //}
        })
    }
    
    getClickInOrderIndex() {
        let indexes = [];
        Player.getContainer().getItems().forEach((item, index) => {
            if (item?.getMetadata() === 14) {
                indexes[parseInt(ChatLib.removeFormatting(item.getName())) - 1] = index;
            }
        });

        return indexes.find(index => index !== undefined);
    }

    clickTerms(slot) {
        new Thread(() => {
            let windowId = Player.getContainer().getWindowId();
            if (Client.currentGui.get() == null) return;
            Client.getMinecraft().field_71442_b.func_78753_a(windowId, slot, 2, 3, Player.getPlayer());
        }).start();
    }
}

new TerminalHandler();