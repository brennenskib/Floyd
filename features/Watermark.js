const FloydRegister = global.floyd.DynamicReload.FloydRegister;

function getModuleVersion() {
    return JSON.parse(FileLib.read("Floyd", "metadata.json")).version;
}

let s = `Floyd Client v${getModuleVersion()}`;
let fps = `FPS: ${Client.getMinecraft().func_175610_ah()}`;

FloydRegister('step', () => {
    fps = `FPS: ${Client.getMinecraft().func_175610_ah()}`
}).setFps(1);

FloydRegister('renderOverlay', () => {
    Renderer.drawString(s, Renderer.screen.getWidth() - 5 - Renderer.getStringWidth(s), 5, true)
    Renderer.drawString(fps, Renderer.screen.getWidth() - 5 - Renderer.getStringWidth(fps), 15, true)
})