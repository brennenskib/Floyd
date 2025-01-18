const C0EPacketClickWindow = Java.type("net.minecraft.network.play.client.C0EPacketClickWindow");
const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow");

const GuiContainer = Java.type("net.minecraft.client.gui.inventory.GuiContainer")
const guiContainerLeftField = GuiContainer.class.getDeclaredField("field_147003_i")
const guiContainerTopField = GuiContainer.class.getDeclaredField("field_147009_r")
guiContainerLeftField.setAccessible(true)
guiContainerTopField.setAccessible(true)

class TerminalHandler {
    constructor() {
        this.windowId = 0;
        this.slotsToRender = [];
        this.inTerminal = false;
        this.colorList = {
            "light gray": "silver",
            "light grey": "silver",
            "wool": "white wool",
            "ink": "black ink",
            "lapis": "blue lapis",
            "cocoa": "brown cocoa"
        };

        register('guiClosed', (event) => {
            this.inTerminal = false;
        })
        
        register('renderOverlay', () => {
            if(!Client.isInGui()) return;
            this.slotsToRender.forEach(slotIndx => {
                const x = guiContainerLeftField.get(Client.currentGui.get())
                const y = guiContainerTopField.get(Client.currentGui.get())
                const slot = Client.currentGui.get().field_147002_h.func_75139_a(slotIndx)   
                
                Renderer.translate(0, 0, 100)
                Renderer.drawRect(
                    Renderer.GREEN,
                    x + slot.field_75223_e,
                    y + slot.field_75221_f,
                    16,
                    16
                )
            })
        })  

        register('packetReceived', (p, e) => {
            ChatLib.chat('opening new gui')
            this.windowId = p.func_148901_c(); // getWindowId
        }).setFilteredClass(S2DPacketOpenWindow);

        register("tick", () => {
            if(this.inTerminal || !Player.getContainer()) return;
            if(Player.getContainer().getName() == "Click in order!") {
                new Thread(() => {
                    this.inTerminal = true;

                    let a = this.getClickInOrderIndex();

                    a.forEach((slot, index) => {
                        this.click(slot);
                        
                        Thread.sleep(100)
                    })

                    this.inTerminal = false;
                }).start()
            } else if (Player.getContainer().getName().startsWith("Select all the ")) {
                new Thread(() => {
                    this.inTerminal = true;

                    let a = this.getColorIndex() 

                    a.forEach((slot) => {
                        this.click(slot);
                        Thread.sleep(100)
                    })

                    this.inTerminal = false;
                }).start()
            }
        })
    }

    getColorIndex() {
        let color = Player?.getContainer()?.getName()?.match(/Select all the (.+) items!/)[1]?.toLowerCase();
        let r = [];

        Player.getContainer().getItems().forEach((item, index) => {
            let itemName = ChatLib.removeFormatting(item?.getName()).toLowerCase();
            Object.keys(this.colorList).forEach((key) => itemName = itemName.replace(key, this.colorList[key]));
            if (itemName.includes(color) && index < 44) r.push(index);
        });
        
        return r;
    }

    getClickInOrderIndex() {
        let indexes = [];

        Player.getContainer().getItems().forEach((item, index) => {
            if (item?.getMetadata() === 14) {
                indexes[parseInt(item.getStackSize()) - 1] = index;
            } else return;
        });

        return indexes
    }

    click(slot) {
        if(!this.inTerminal) return;
        this.slotsToRender.push(slot);
        Client.sendPacket(new C0EPacketClickWindow(this.windowId, slot, 0, 0, null, 0))
    }
}

new TerminalHandler();