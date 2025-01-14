const FloydRegister = global.floyd.DynamicReload.FloydRegister;
const obj = global.floyd.obj;
const isFloor7 = global.floyd.utils.isFloor7;
const prefix = global.floyd.utils.prefix;
const pressAllPressedMovementKeys = global.floyd.utils.pressAllPressedMovementKeys;

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
            if (obj.AutoTerms/* && isFloor7()*/) {
                if (!(Client.currentGui.get() instanceof net.minecraft.client.gui.inventory.GuiChest)) this.exitTerm() 
                this.getCorrectPanes()
                pressAllPressedMovementKeys()
            }
        })

        FloydRegister(net.minecraftforge.client.event.GuiScreenEvent.DrawScreenEvent.Pre, event => {
            if(this.inTerm) {
                cancel(event);
            }
        });
    }

    mode(array) {
        return array.sort((a,b) => array.filter(v => v===a).length - array.filter(v => v===b).length).pop()
    }

    click(wid, slot, mbc, m, p) {
        Client.getMinecraft().field_71442_b.func_78753_a(wid, slot, mbc, m, p)
        ChatLib.chat(`${prefix} AutoTerms: Clicking Slot ${slot}`)
        
        if(slot == 33) {
            if(Client?.isInGui()) {
                Client.scheduleTask(1,() => { Client?.currentGui?.close() })
            }
        }
    }

    getCorrectPanes() {
        if (this.inTerm) return;
        this.correctPanes = [];
        let inventoryName = Player.getContainer().getName();

        if (inventoryName == "Correct all the panes!") {
            for (let index = 11; index < 34; index++) {
                if (Player.getContainer().getStackInSlot(index)?.getMetadata() === 14) this.correctPanes.push(index);
            }
        } else if (inventoryName == "Click in order!") {
            Player.getContainer().getItems().forEach((item, index) => {
                if (item?.getMetadata() === 14) this.correctPanes[parseInt(ChatLib.removeFormatting(item.getName())) - 1] = index;
            });
        } else if (inventoryName.startsWith("What starts with: ")) {
            let letter = inventoryName.match(/What starts with: '(\w+)'?/)[1];
            Player.getContainer().getItems().forEach((item, index) => {
                if (ChatLib.removeFormatting(item?.getName()).startsWith(letter) && index < 44) this.correctPanes.push(index);
            });
        } else if (inventoryName.startsWith("Select all the ")) {
            let color = inventoryName.match(/Select all the (.+) items!/)[1].toLowerCase();
            Player.getContainer().getItems().forEach((item, index) => {
                let itemName = ChatLib.removeFormatting(item?.getName()).toLowerCase();
                Object.keys(this.colorList).forEach((key) => itemName = itemName.replace(key, this.colorList[key]));
                if (itemName.includes(color) && index < 44) this.correctPanes.push(index);
            });
        } else if (inventoryName == "Navigate the maze!") {
            const getColour = (colour) => Array.from(Array(54).keys()).filter(slot => Player.getContainer().getStackInSlot(slot)?.getDamage() == colour);
            const adjacent = (slot1, slot2) => [slot1 % 9 == 0 ? -1 : slot1 - 1, slot1 % 9 == 8 ? -1 : slot1 + 1, slot1 + 9, slot1 - 9].filter(slot => slot >= 0).some(slot => slot == slot2);
            let unvisited = getColour(0);
            let previous = getColour(5);
            let red = getColour(14);
            while (!adjacent(previous, red)) {
                let nextStep = unvisited.filter(pane => adjacent(pane, previous) && !this.correctPanes.includes(pane))[0];
                previous = nextStep;
                if (previous == null) break;
                this.correctPanes.push(nextStep);
            }
        } else if (inventoryName == "Change all to same color!") {
            let optimal = this.mode(Player.getContainer().getItems().filter((item, index) => item?.getDamage() != 15 && index <= 33).map(pane => pane?.getDamage()));
            Player.getContainer().getItems().forEach((pane, index) => {
                if (pane?.getDamage() == 15 || !pane) return;
                for (let i = 0; i < Math.abs(this.colorCycle.indexOf(optimal) - this.colorCycle.indexOf(pane.getDamage())); i++) this.correctPanes.push(index);
            });
        } else if (inventoryName == "Click the button on time!") {
            this.inTerm = true;
            let stage = 9;
            new Thread(() => {
                while (this.inTerm) {
                    let slot = this.onTimeSolver() ?? 0;
                    if (Player.getContainer().getStackInSlot(slot + stage)?.getMetadata() == 5) {
                        this.click(Player.getPlayer().field_71070_bA.field_75152_c, (7 + stage), 2, 3, Player.getPlayer());
                        Thread.sleep(750);
                        stage += 9;
                    }
                    if (stage > 36) {
                        this.inTerm = false;
                    }
                }
                this.terminals++;
            }).start();
        }

        if (this.correctPanes.length) {
            this.inTerm = true;
            this.terminals++;
            this.clickTerms();
        }
    }

    onTimeSolver() {
        Player.getContainer().getItems().forEach((item, index) => {
            if (index > 8) return;
            if (item?.getMetadata() == 10) this.slot = index;
        });
        return this.slot;
    }

    clickTerms() {
        new Thread(() => {
            let windowId = Player.getPlayer().field_71070_bA.field_75152_c;
            this.correctPanes.forEach((slot) => {
                if (windowId <= Player.getPlayer().field_71070_bA.field_75152_c) windowId = Player.getPlayer().field_71070_bA.field_75152_c;
                if (Client.currentGui.get() == null) return;
                this.click(windowId, slot, 2, 3, Player.getPlayer());
                Thread.sleep(this.randomDelay());
                windowId++;
            });
            this.inTerm = false;
        }).start();
    }

    exitTerm() {
        this.inTerm = false;
    }

    randomDelay() {
        return Math.floor(Math.random() * (250) + 150);
    }
}

new TerminalHandler();