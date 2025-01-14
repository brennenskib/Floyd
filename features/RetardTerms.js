class RetardTerms {
    constructor() {
        this.ColourTitle = /^Select all the ([\w ]+) items!$/;

        this.data = {};

        this.slots = [];
        this.queue = [];
    }

    onCloseWIndow() {
        this.data.inTerminal = false;
        while (this.queue.length) this.queue.shift();
    }

    onOpenWindow(title, windowId, _0, slotCount) {
        this.data.ID = windowId;
        const colorsMatch = title.match(this.ColourTitle);

        if (colorsMatch !== null) {
            this.data.extra = colorsMatch[1].toLowerCase();
            this.data.inTerminal = true;
            this.data.clicked = false;
            while (this.slots.length) slots.pop();
            this.data.windowSize = slotCount;
        } else {
            this.data.inTerminal = false;
        }
    }

    setSlotListener(itemStack, slot) {
        if (slot < 0) return;
        if (slot >= windowSize) return;
        if (itemStack?.func_77973_b()) {
            const item = new Item(itemStack);
            this.slots[slot] = {
                slot,
                id: item.getID(),
                meta: item.getMetadata(),
                size: item.getStackSize(),
                name: ChatLib.removeFormatting(item.getName()),
                enchanted: item.isEnchanted()
            };
        } else {
            this.slots[slot] = null;
        }
        if (this.slots.length === windowSize) {
            solve();
            if (queue.length > 0) {
                if (queue.every(queued => solution.includes(queued[0]))) {
                    queue.forEach(queued => predict(queued[0], queued[1]));
                    click(queue[0][0], queue[0][1]);
                    queue.shift();
                } else {
                    while (queue.length) queue.shift();
                }
            }
        }
    }

    colourSolver() {
        const allowedSlots = [10, 11, 12, 13, 14, 15, 16, 19, 20, 21, 22, 23, 24, 25, 28, 29, 30, 31, 32, 33, 34, 37, 38, 39, 40, 41, 42, 43];
        const replacements = { "light gray": "silver", "wool": "white", "bone": "white", "ink": "black", "lapis": "blue", "cocoa": "brown", "dandelion": "yellow", "rose": "red", "cactus": "green" };
        
        const fixName = name => {
          Object.entries(replacements).forEach(([k, v]) => {
            name = name.replace(new RegExp("^" + k), v);
          });
          return name;
        };
      
        const nextSlot = this.slots
          .filter(slot => slot && allowedSlots.includes(slot.slot) && !slot.enchanted && fixName(slot.name.toLowerCase()).startsWith(extra))
          .map(slot => slot.slot)[0]; 
      
        return nextSlot; 
      }
}