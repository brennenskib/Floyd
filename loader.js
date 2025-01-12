global.floyd = {};

const File = Java.type("java.io.File");
const features = new File(`${Client.getMinecraft().field_71412_D.getPath()}/config/ChatTriggers/modules/Floyd/features`)

const order = ['data','utils','rot','dynamic_reload','RouteTils',"MouseUngrab", "FailsafeManager"];
const otherOrder = ['NoDropMySlots', 'MastiffWishKeybind'];

const FloydPath = FileLib.isDirectory(`./config/ChatTriggers/modules/Floyd-main`) ? "Floyd-main" : "Floyd"

order.forEach(file => {
    try {
        eval(FileLib.read("Floyd", `util/${file}.js`));
    } catch(err) {
        ChatLib.chat(`${file} ERROR!: ${err}`)
    }
})

otherOrder.forEach(file => {
    try {
        eval(FileLib.read("Floyd", `features/${file}.js`));
    } catch(err) {
        ChatLib.chat(`${file} ERROR!: ${err}`)
    }
})

features.listFiles().forEach((file) => {
    let name = file.getName();

    if(name == "NoDropMySlots.js" || name == "MastiffWishKeybind.js") return;
    else {
        try {
            eval(FileLib.read("Floyd", `features/${file.getName()}`))
        } catch(err) {
            ChatLib.chat(`${file.getName()} ERROR!: ${err}`)
        }
    }
})