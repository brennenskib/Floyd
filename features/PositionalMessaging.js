import RenderLib from "RenderLib/index";

const FloydRegister = global.floyd.DynamicReload.FloydRegister;
const prefix = global.floyd.utils.prefix;
const obj = global.floyd.obj;

let sentMessages = [];

function getPos() {
    const X = Math.floor(Player.getX());
    const Y = Player.getY()
    const Z = Math.floor(Player.getZ());

    return [ X, Y, Z ]
}

function addData(key, value) {
    let fileContent = FileLib.read("floydData", "positional.json");
    
    let data = {};

    if (fileContent) {
        try {
            data = JSON.parse(fileContent);
        } catch (error) {
            console.error("Error parsing JSON data:", error);
        }
    }
    
    data[key] = value;
    FileLib.write("floydData", "positional.json", JSON.stringify(data), true);
    ChatLib.chat(`${prefix} Added: ${key}`)
}

function removeData(key) {
    let fileContent = FileLib.read("floydData", "positional.json");
    
    let data = {};

    if (fileContent) {
        try {
            data = JSON.parse(fileContent);
        } catch (error) {
            console.error("Error parsing JSON data:", error);
        }
    }

    if (data.hasOwnProperty(key)) {
        delete data[key];
        try {
            FileLib.write("floydData", "positional.json", JSON.stringify(data), true);
            ChatLib.chat(`${prefix} Removed: ${key}`)
        } catch (writeError) {
            console.error("Error writing to file:", writeError);
        }
    } else {
        console.log(`Key '${key}' not found in the data.`);
    }
}


FloydRegister('command', (arg1, arg2, arg3) => {
    if(
        !arg1 || arg1 == "" ||
        !arg2 || arg2 == ""
    ) return ChatLib.chat(`${prefix} Usage: /positional add|remove name message`)

    switch(arg1.toLowerCase()) {
        case "add": 
            addData(arg2, JSON.stringify({ pos: getPos(), msg: arg3 }))
            break;

        case "remove":
            removeData(arg2)
            break;
    }
}).setCommandName('positional')

FloydRegister('renderWorld', () => {
    if(!obj.Positional) return;
    let jsObj = JSON.parse(FileLib.read("floydData", "positional.json"))


    for (let key in jsObj) {
        if(sentMessages.includes(key)) return;
        let dat = JSON.parse(jsObj[key])
        RenderLib.drawEspBox(dat.pos[0] + 0.5, dat.pos[1] - 1, dat.pos[2] + 0.5, 1, 1, 1, 0, 0, 1, true)
        Tessellator.drawString(key, dat.pos[0] + 0.5, dat.pos[1] + 0.75, dat.pos[2] + 0.5, Renderer.WHITE, true, 0.025, false)
    }
});

FloydRegister('tick', () => {
    if(!obj.Positional) return;
    let pos = getPos();
    let jsObj = JSON.parse(FileLib.read("floydData", "positional.json"))

    for (let key in jsObj) {
        let dat = JSON.parse(jsObj[key])

        if(
            Math.abs(pos[0] - dat.pos[0]) < 2 && 
            Math.abs(pos[1] - dat.pos[1]) < 2 && 
            Math.abs(pos[2] - dat.pos[2]) < 2 && 
            !sentMessages.includes(key)) 
        {
            ChatLib.say(dat.msg);
            sentMessages.push(key);
        }
    }
})

FloydRegister('worldLoad', () => {
    sentMessages = [];
})