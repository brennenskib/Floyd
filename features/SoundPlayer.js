const File = Java.type("java.io.File");
const features = new File(`${Client.getMinecraft().field_71412_D.getPath()}/config/ChatTriggers/modules/Floyd/songs`)
const sounds = [];

features.listFiles().forEach(file => {
    if(!file.getName().toLowerCase().includes(".ogg")) return;
    const s = new Sound({ source: " "})
})
order.forEach(file => {
    try {
        eval(FileLib.read("Floyd", `util/${file}.js`));
    } catch(err) {
        ChatLib.chat(`${file} ERROR!: ${err}`)
    }
})