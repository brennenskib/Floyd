/*
function getPath() {
    return FileLib.isDirectory(`./config/ChatTriggers/modules/Floyd-main`) ? "Floyd-main" : "Floyd";
}

const FloydPath = getPath();

const File = Java.type("java.io.File");
const features = new File(`${Client.getMinecraft().field_71412_D.getPath()}/config/ChatTriggers/modules/${FloydPath}/features`)

const order = ['data','utils','rot','dynamic_reload','RouteTils',"MouseUngrab", "FailsafeManager"];
const otherOrder = ['NoDropMySlots', 'MastiffWishKeybind'];

global.floyd = {};
global.floyd.getPath = getPath;

order.forEach(file => {
    try {
        eval(FileLib.read(FloydPath, `util/${file}.js`));
    } catch(err) {
        ChatLib.chat(`${file} ERROR!: ${err}`)
    }
})

otherOrder.forEach(file => {
    try {
        eval(FileLib.read(FloydPath, `features/${file}.js`));
    } catch(err) {
        ChatLib.chat(`${file} ERROR!: ${err}`)
    }
})

features.listFiles().forEach((file) => {
    let name = file.getName();

    if(name == "NoDropMySlots.js" || name == "MastiffWishKeybind.js") return;
    else {
        try {
            eval(FileLib.read(FloydPath, `features/${file.getName()}`))
        } catch(err) {
            ChatLib.chat(`${file.getName()} ERROR!: ${err}`)
        }
    }
})
*/

// im gonna refactor the code base :)