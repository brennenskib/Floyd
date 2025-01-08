const FloydKeybind = global.floyd.DynamicReload.FloydKeybind;
const HClip = global.floyd.utils.HClip;

const key = new FloydKeybind("HClip", Keyboard.KEY_NONE)

key.registerKeyPress(() => {
    if(Client.isInChat() || Client.isInGui()) return;
    HClip();
})