const File = Java.type("java.io.File");
const features = new File(`${Client.getMinecraft().field_71412_D.getPath()}/config/ChatTriggers/modules/${global.floyd.getPath()}/songs`)
const sounds = [];

features.listFiles().forEach(file => {
    if(!file.getName().toLowerCase().includes(".ogg")) return;
    const s = new Sound({ source: " "})
})
order.forEach(file => {
    try {
        eval(FileLib.read(global.floyd.getPath(), `util/${file}.js`));
    } catch(err) {
        ChatLib.chat(`${file} ERROR!: ${err}`)
    }
})