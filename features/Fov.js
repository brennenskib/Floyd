const FloydRegister = global.floyd.DynamicReload.FloydRegister;
const obj = global.floyd.obj;

let initVal = Client.settings.getFOV();

FloydRegister("step", () => {
    return;
    if(!obj.Fov_Increase) return;
    if(Client.settings.getSettings().field_74320_O !== 1) {
        initVal = Client.settings.getSettings().field_74334_X;
    }
}).setFps(1);

FloydRegister("renderWorld", () => {
    return;
    if(!obj.Fov_Increase) return;
    if(Client.settings.getSettings().field_74320_O == 1) {
        Client.settings.getSettings().field_74334_X = initVal + obj.FovIncreaseAmount;
    } else {
        Client.settings.getSettings().field_74334_X = initVal;
    }
})