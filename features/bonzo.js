const FloydKeybind = global.floyd.DynamicReload.FloydKeybind;
const jump = global.floyd.utils.jump;
const rightClick = global.floyd.utils.rightClick;
const swapFromName = global.floyd.utils.swapFromName;
const setSlot = global.floyd.utils.setSlot;
const rot = global.floyd.rot;

const key = new FloydKeybind("Use Bonzo Staff", Keyboard.KEY_NONE)

key.registerKeyPress(() => {
    if(Player?.getHeldItem()?.getName()?.toLocaleLowerCase()?.includes("bonzo's")) {
        let ogYaw = Player.getYaw();
        let ogPitch = Player.getPitch();

        rot.toAngles(0, 87.5 - Player.getPitch(), 100, () => {
            rightClick()
            jump()
            rot.toAngles(ogYaw - Player.getYaw(), ogPitch - Player.getPitch(), 100)
        })
    } else {
        let ogSlot = Player.getHeldItemIndex();
        let ogYaw = Player.getYaw();
        let ogPitch = Player.getPitch();

        let t = swapFromName("bonzo's")
        if(!t) return;

        rot.toAngles(0, 87.5 - Player.getPitch(), 100, () => {
            rightClick()
            jump()
            rot.toAngles(ogYaw - Player.getYaw(), ogPitch - Player.getPitch(), 100)
            setSlot(ogSlot)
        })
    }
})