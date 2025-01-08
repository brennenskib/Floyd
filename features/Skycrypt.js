const FloydRegister = global.floyd.DynamicReload.FloydRegister;

const Desktop = Java.type('java.awt.Desktop');
const URI = Java.type('java.net.URI');

FloydRegister("command", (arg1) => {
    Desktop.getDesktop().browse(new URI(`https://sky.shiiyu.moe/stats/${(arg1 || arg1 !== undefined) ? arg1 : Player.getName()}`));
}).setName("skycrypt").setAliases("sc")