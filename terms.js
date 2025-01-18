const C0EPacketClickWindow = Java.type("net.minecraft.network.play.client.C0EPacketClickWindow");
const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow");

class TerminalHandler {
    constructor() {
        this.windowId = 0;
        this.inTerminal = false;
        this.colorList = {
            "light gray": "silver",
            "light grey": "silver",
            "wool": "white wool",
            "ink": "black ink",
            "lapis": "blue lapis",
            "cocoa": "brown cocoa"
        };

        register('packetReceived', (p, e) => {
            this.windowId = p.func_148901_c(); // getWindowId
        }).setFilteredClass(S2DPacketOpenWindow);

        register("step", () => {
            if(this.inTerminal && !Player.getContainer()) return;
            if(Player.getContainer().getName() == "Click in order!") {
                new Thread(() => {
                    this.inTerminal = true;

                    let a = this.getClickInOrderIndex();

                    a.forEach((slot) => {
                        this.click(slot);
                        Thread.sleep(150 + (Math.random()*150))
                    })

                    this.inTerminal = false;
                }).start()
            }

            if (Player.getContainer().getName().startsWith("Select all the ")) {
                new Thread(() => {
                    this.inTerminal = true;

                    let a = this.getColorIndex() 

                    a.forEach((slot) => {
                        this.click(slot);
                        Thread.sleep(150 + (Math.random()*150))
                    })

                    this.inTerminal = false;
                }).start()
            }

            if (Player.getContainer().getName().startsWith("What starts with: ")) {
                this.inTerminal = true;

                let color = Player.getContainer().getName().match(/Select all the (.+) items!/)[1].toLowerCase();
                let r = [];
        
                Player.getContainer().getItems().forEach((item, index) => {
                    let itemName = ChatLib.removeFormatting(item?.getName()).toLowerCase();
                    Object.keys(this.colorList).forEach((key) => itemName = itemName.replace(key, this.colorList[key]));
                    if (itemName.includes(color) && index < 44) r.push(index);
                });
                
                a.forEach(slot => {
                    this.click(parseInt(slot));
                    Thread.sleep(150 + (Math.random()*150))
                })

                this.inTerminal = false;
            }
        })
    }
    
    getStartsWith() {
        let letter = Player.getContainer().getName().match(/What starts with: '(\w+)'?/)[1];
        let r = [];

        Player.getContainer().getItems().forEach((item, index) => {
            if (ChatLib.removeFormatting(item?.getName()).startsWith(letter) && index < 44) r.push(index);
        });

        return r;
    }

    getColorIndex() {
        let color = Player.getContainer().getName().match(/Select all the (.+) items!/)[1].toLowerCase();
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