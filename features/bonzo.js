const FloydKeybind = global.floyd.DynamicReload.FloydKeybind;
const sneakBind = global.floyd.utils.sneakBind
const jump = global.floyd.utils.jump;
const rightClick = global.floyd.utils.rightClick;
const swapFromName = global.floyd.utils.swapFromName;
const setSlot = global.floyd.utils.setSlot;
const rot = global.floyd.rot;

const key = new FloydKeybind("Use Bonzo Staff", Keyboard.KEY_NONE)

const gameSettings = Client.getMinecraft().field_71474_y;
const keyForward = new KeyBind(gameSettings.field_74351_w);

key.registerKeyPress(() => {
    if(Player?.getHeldItem()?.getName()?.toLocaleLowerCase()?.includes("bonzo's")) {
        let ogYaw = Player.getYaw();
        let ogPitch = Player.getPitch();

        keyForward.setState(true);
        sneakBind.setState(true);
        rot.toAngles(0, 75 - Player.getPitch(), 100, () => {
            sneakBind.setState(false); 
            rightClick()
            setTimeout(() => {
                jump()   
            }, 150)
            rot.toAngles(ogYaw - Player.getYaw(), ogPitch - Player.getPitch(), 100, () => {
                Client.isInGui() ? false : keyForward.setState(keyForward.isKeyDown())
            })
        })
    } else {
        let ogSlot = Player.getHeldItemIndex();
        let ogYaw = Player.getYaw();
        let ogPitch = Player.getPitch();

        let t = swapFromName("Bonzo's Staff")
        if(!t) return;

        keyForward.setState(true);
        sneakBind.setState(true);
        rot.toAngles(0, 75 - Player.getPitch(), 100, () => {
            sneakBind.setState(false); 
            rightClick()
            setTimeout(() => {
                jump()   
            }, 150)
            rot.toAngles(ogYaw - Player.getYaw(), ogPitch - Player.getPitch(), 100, () => {
                setSlot(ogSlot)
                if(!Keyboard.isKeyDown(keyForward.getKeyCode())) keyForward.setState(false);
            })
        })
    }
})