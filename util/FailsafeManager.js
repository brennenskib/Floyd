const prefix = global.floyd.utils.prefix

const keybinds = [
    Client.getMinecraft().field_71474_y.field_74351_w,
    Client.getMinecraft().field_71474_y.field_74370_x,
    Client.getMinecraft().field_71474_y.field_74366_z,
    Client.getMinecraft().field_71474_y.field_74368_y,
    Client.getMinecraft().field_71474_y.field_74314_A,
    Client.getMinecraft().field_71474_y.field_74311_E
];

class failsafes {

    startFailsafe() {
        ChatLib.chat(`${prefix} Starting Failsafe...`)
        
        keybinds.forEach(mcBind => {
            new KeyBind(mcBind).setState(false);
        })
    }
}

global.floyd.Failsafe = new failsafes();