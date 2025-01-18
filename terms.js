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
        this.inTerminal = false;
        this.colorCycle = [1, 4, 13, 11, 14];
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

        register('packetReceived', (p, e) => {
            ChatLib.chat('opening new gui')
            this.windowId = p.func_148901_c(); // getWindowId
        }).setFilteredClass(S2DPacketOpenWindow);

        register("tick", () => {
            if(this.inTerminal || !Player.getContainer()) return;
            let iName = Player.getContainer().getName()
            if(iName == "Click in order!") {
                new Thread(() => {
                    this.inTerminal = true;

                    let a = this.getClickInOrderIndex();

                    a.forEach((slot, index) => {
                        this.click(slot);
                        
                        Thread.sleep(50)
                    })

                    this.inTerminal = false;
                }).start()
            } else if (iName.startsWith("Select all the ")) {
                new Thread(() => {
                    this.inTerminal = true;

                    let a = this.getColorIndex(iName) 

                    a.forEach((slot) => {
                        this.click(slot);
                        Thread.sleep(50)
                    })

                    this.inTerminal = false;
                }).start()
            } else if (iName.startsWith("What starts with: ")) {
                new Thread(() => {
                    this.inTerminal = true;

                    let a = this.getStartsWith(iName) 

                    a.forEach((slot) => {
                        this.click(slot);
                        Thread.sleep(50)
                    })

                    this.inTerminal = false;
                }).start()
            } else if (iName == "Change all to same color!") {
                new Thread(() => {
                    this.inTerminal = true;

                    let a = this.getSetAll();

                    a.forEach((slot) => {
                        this.click(slot);
                        Thread.sleep(50)
                    })

                    this.inTerminal = false;
                }).start()
            } else if (iName == "Correct all the panes!") {
                new Thread(() => {
                    this.inTerminal = true;

                    let a = this.getCorrectAll();

                    a.forEach((slot) => {
                        this.click(slot);
                        Thread.sleep(50)
                    })

                    this.inTerminal = false;
                }).start()
            } else if (iName == "Click the button on time!") {
                
            }
        })
    }

    mode(array) {
        return array.sort((a,b) => array.filter(v => v===a).length - array.filter(v => v===b).length).pop()
    }

    getCorrectAll() {
        let r = [];

        for (let index = 11; index < 34; index++) {
            if (Player.getContainer().getStackInSlot(index)?.getMetadata() === 14) r.push(index);
        }

        return r;
    }

    getSetAll() {
        let optimal = this.mode(Player.getContainer().getItems().filter((item, index) => item?.getDamage() != 15 && index <= 33).map(pane => pane?.getDamage()));
        let r = [];

        Player.getContainer().getItems().forEach((pane, index) => {
            if (pane?.getDamage() == 15 || !pane) return;
            for (let i = 0; i < Math.abs(this.colorCycle.indexOf(optimal) - this.colorCycle.indexOf(pane.getDamage())); i++) r.push(index);
        });

        return r;
    }

    getStartsWith(iName) {
        let letter = iName.match(/What starts with: '(\w+)'?/)[1];
        let r = [];

        Player.getContainer().getItems().forEach((item, index) => {
            if (ChatLib.removeFormatting(item?.getName()).startsWith(letter) && index < 44) r.push(index);
        });

        return r;
    }

    getColorIndex(iName) {
        let color = iName.match(/Select all the (.+) items!/)[1]?.toLowerCase();
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
        Client.sendPacket(new C0EPacketClickWindow(this.windowId, slot, 0, 0, null, 0))
    }
}

new TerminalHandler();