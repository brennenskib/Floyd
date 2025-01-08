global.floyd = {};

const File = Java.type("java.io.File");
const features = new File(`${Client.getMinecraft().field_71412_D.getPath()}/config/ChatTriggers/modules/Floyd/features`)

const order = ['data','utils','socketUtil','rot','dynamic_reload','RouteTils'];

order.forEach(file => {
    try {
        eval(FileLib.read("Floyd", `util/${file}.js`));
    } catch(err) {
        ChatLib.chat(`${file} ERROR!: ${err}`)
    }
})

features.listFiles().forEach((file) => {
    try {
        eval(FileLib.read("Floyd", `features/${file.getName()}`))
    } catch(err) {
        ChatLib.chat(`${file.getName()} ERROR!: ${err}`)
    }
})

function getModuleVersion() {
    return JSON.parse(FileLib.read("Floyd", "metadata.json")).version;
}

let s = `Floyd Client v${getModuleVersion()}`
let fps = `FPS: ${Client.getMinecraft().func_175610_ah()}`

register('step', () => {
    fps = `FPS: ${Client.getMinecraft().func_175610_ah()}`
}).setFps(1);

register('renderOverlay', () => {
    Renderer.drawString(s, Renderer.screen.getWidth() - 5 - Renderer.getStringWidth(s), 5, true)
    Renderer.drawString(fps, Renderer.screen.getWidth() - 5 - Renderer.getStringWidth(fps), 15, true)
})