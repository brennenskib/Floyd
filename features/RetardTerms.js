class RetardTerms {
    function getNextSlot() {
        const allowedSlots = [10, 11, 12, 13, 14, 15, 16, 19, 20, 21, 22, 23, 24, 25, 28, 29, 30, 31, 32, 33, 34, 37, 38, 39, 40, 41, 42, 43];
        const replacements = { "light gray": "silver", "wool": "white", "bone": "white", "ink": "black", "lapis": "blue", "cocoa": "brown", "dandelion": "yellow", "rose": "red", "cactus": "green" };
        
        const fixName = name => {
          Object.entries(replacements).forEach(([k, v]) => {
            name = name.replace(new RegExp("^" + k), v);
          });
          return name;
        };
      
        // Filter slots that are valid and not enchanted, matching the desired item color
        const nextSlot = slots
          .filter(slot => slot && allowedSlots.includes(slot.slot) && !slot.enchanted && fixName(slot.name.toLowerCase()).startsWith(extra))
          .map(slot => slot.slot)[0]; // Get the first valid slot (the "next" slot)
      
        return nextSlot; // Return the next slot
      }
}