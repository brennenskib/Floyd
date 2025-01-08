const FloydRegister = global.floyd.DynamicReload.FloydRegister;
const obj = global.floyd.obj;

let sprint = new KeyBind(Client.getMinecraft().field_71474_y.field_151444_V)

FloydRegister("tick", () => {
    if(!obj.Toggle_Sprint) return;
    sprint.setState(true);
})