const obj = global.floyd.obj;

const MainMenu = Java.type('net.minecraft.client.gui.GuiMainMenu');
const splashText = MainMenu.class.getDeclaredField('field_73975_c');

splashText.setAccessible(true);

register(net.minecraftforge.client.event.GuiScreenEvent.DrawScreenEvent.Pre, (event) => {
   if(!(Client.currentGui.get() instanceof MainMenu) || !obj.splashText) return;
   splashText.set(Client.currentGui.get(), 'Floyd Client on top');
});