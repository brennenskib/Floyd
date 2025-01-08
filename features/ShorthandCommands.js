const FloydRegister = global.floyd.DynamicReload.FloydRegister;
const prefix = global.floyd.utils.prefix;

FloydRegister("command", () => {
    ChatLib.chat(`${prefix} Warping: Dungeon Hub`)
    ChatLib.command('warp dh')
}).setCommandName('dn')

FloydRegister("command", () => {
    ChatLib.chat(`${prefix} Warping: Hub`)
    ChatLib.command('warp hub')
}).setCommandName('h')