
const FloydRegister = global.floyd.DynamicReload.FloydRegister;const obj = global.floyd.obj;
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

    mode(array) {
        return array.sort((a,b) => array.filter(v => v===a).length - array.filter(v => v===b).length).pop()
    }

    getCorrectPanes() {
        if (this.inTerm) return;
        let inventoryName = Player.getContainer().getName();
    
        if (inventoryName == "Correct all the panes!") {
            return this.getCorrectPanesIndexes();
        } else if (inventoryName == "Click in order!") {
            return this.getClickInOrderIndex();
        } else if (inventoryName.startsWith("What starts with: ")) {
            return this.getStartsWithIndex();
        } else if (inventoryName.startsWith("Select all the ")) {
            return this.getSelectAllIndex();
        } else if (inventoryName == "Navigate the maze!") {
            return this.getMazePathIndex();
        } else if (inventoryName == "Change all to same color!") {
            return this.getChangeColorIndex();
        } else if (inventoryName == "Click the button on time!") {
            this.handleOnTimeClick();
            return;
        }
    }
    
    getCorrectPanesIndexes() {
        for (let index = 11; index < 34; index++) {
            if (Player.getContainer().getStackInSlot(index)?.getMetadata() === 14) return index;
        }
        return null;
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
    
    getStartsWithIndex() {
        let letter = Player.getContainer().getName().match(/What starts with: '(\w+)'?/)[1];
        return Player.getContainer().getItems().findIndex((item, index) => ChatLib.removeFormatting(item?.getName()).startsWith(letter) && index < 44);
    }
    
    getSelectAllIndex() {
        let color = Player.getContainer().getName().match(/Select all the (.+) items!/)[1].toLowerCase();
        return Player.getContainer().getItems().findIndex((item, index) => {
            let itemName = ChatLib.removeFormatting(item?.getName()).toLowerCase();
            Object.keys(this.colorList).forEach((key) => itemName = itemName.replace(key, this.colorList[key]));
            return itemName.includes(color) && index < 44;
        });
    }
    
    getMazePathIndex() {
        const getColour = (colour) => Array.from(Array(54).keys()).filter(slot => Player.getContainer().getStackInSlot(slot)?.getDamage() == colour);
        const adjacent = (slot1, slot2) => [slot1 % 9 == 0 ? -1 : slot1 - 1, slot1 % 9 == 8 ? -1 : slot1 + 1, slot1 + 9, slot1 - 9].filter(slot => slot >= 0).some(slot => slot == slot2);
    
        let unvisited = getColour(0);
        let previous = getColour(5);
        let red = getColour(14);
    
        while (!adjacent(previous, red)) {
            let nextStep = unvisited.find(pane => adjacent(pane, previous));
            if (!nextStep) return null;
            previous = nextStep;
        }
        return previous;
    }
    
    getChangeColorIndex() {
        let optimal = this.mode(Player.getContainer().getItems().filter((item, index) => item?.getDamage() != 15 && index <= 33).map(pane => pane?.getDamage()));
        return Player.getContainer().getItems().findIndex((pane, index) => {
            if (pane?.getDamage() == 15 || !pane) return false;
            return Math.abs(this.colorCycle.indexOf(optimal) - this.colorCycle.indexOf(pane.getDamage())) > 0;
        });
    }
}

new TerminalHandler();