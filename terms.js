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

        FloydRegister("tick", () => {
            if (obj.AutoTerms && isFloor7()) {
                if (!(Client.currentGui.get() instanceof net.minecraft.client.gui.inventory.GuiChest)) this.exitTerm() 
                this.getCorrectPanes()
            }
        })

        FloydRegister(net.minecraftforge.client.event.GuiScreenEvent.DrawScreenEvent.Pre, event => {
            if(this.inTerm) {
                cancel(event);
                pressAllPressedMovementKeys()
            }
        });
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

    clickTerms() {
        new Thread(() => {
            let windowId = Player.getPlayer().field_71070_bA.field_75152_c;
            if (Client.currentGui.get() == null) return;
            this.click(windowId, slot, 2, 3, Player.getPlayer());
            Thread.sleep(this.randomDelay());
        }).start();
    }
}

new TerminalHandler();