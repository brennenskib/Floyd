const prefix = global.floyd.utils.prefix;

const JSLoader = Java.type("com.chattriggers.ctjs.engine.langs.js.JSLoader")
const UrlModuleSourceProvider = Java.type("org.mozilla.javascript.commonjs.module.provider.UrlModuleSourceProvider")
const UrlModuleSourceProviderInstance = new UrlModuleSourceProvider(null, null)
const StrongCachingModuleScriptProviderClass = Java.type("org.mozilla.javascript.commonjs.module.provider.StrongCachingModuleScriptProvider")

let StrongCachingModuleScriptProvider = new StrongCachingModuleScriptProviderClass(UrlModuleSourceProviderInstance)
let CTRequire = new JSLoader.CTRequire(StrongCachingModuleScriptProvider)

let registers = [];
let commandRegisters = [];
let keys = [];

let onWorldLoad = [];
let onTick = [];

function FloydRegister(type, func) {
    if(type instanceof String) {
        let t = type.toLowerCase()
        let reg;

        switch(t) {
            case "command": () => {
                reg = register(type, func);
                commandRegisters.push(reg)
            }

            case "worldLoad": () => {
                onWorldLoad.push(func)
                return;
            }

            case "tick": () => {
                onTick.push(func)
                return;
            }

            default: () => {
                reg = register(type, func);
                registers.push(reg)
            }
        }

        return reg;
    } else {
        let reg = register(type, func)
        registers.push(reg)
        return reg;
    }
}

function FloydKeybind(desc, ssss = Keyboard.KEY_NONE, category = "! FloydPlus v" + JSON.parse(FileLib.read(global.floyd.getPath(), "metadata.json")).version) {
    let key = new KeyBind(desc, ssss, category);
    keys.push(key);
    return key;
}

function FloydUnload() {
    registers.forEach(reg => {
        reg.unregister();
        reg = null;
    })

    keys.forEach(keyBind => {
        KeyBind.removeKeyBind(keyBind)
        keyBind = null;
    })

    commandRegisters.forEach(reg => {
        reg.unregister();
        reg.setCommandName('');
        reg = null;
    })
}

function FloydReload() {
    StrongCachingModuleScriptProvider = new StrongCachingModuleScriptProviderClass(UrlModuleSourceProviderInstance)
    CTRequire = new JSLoader.CTRequire(StrongCachingModuleScriptProvider)
    CTRequire("../index.js")
}

function LoadFile(path) {
    StrongCachingModuleScriptProvider = new StrongCachingModuleScriptProviderClass(UrlModuleSourceProviderInstance)
    CTRequire = new JSLoader.CTRequire(StrongCachingModuleScriptProvider)
    CTRequire(`../${path}`)
}

FloydRegister('command', () => {
    FloydUnload();
    ChatLib.chat(`${prefix} Reloading.`)
    FloydReload();
}).setCommandName("reloadfloyd").setAliases(['floydreload', 'refreshfloyd', 'fr'])

register('tick', () => {
    onTick.forEach(func => {
        func();
    }) 
})

register('worldLoad', () => {
    onWorldLoad.forEach(func => {
        func();
    }) 
})

register('gameUnload', () => {
    FloydUnload()

    onWorldLoad.forEach(reg => {
        reg.unregister()
        reg = null;
    })

    onTick.forEach(reg => {
        reg.unregister()
        reg = null;
    })
})

global.floyd.DynamicReload = { 
    FloydRegister, 
    FloydKeybind, 
    FloydUnload, 
    LoadFile
};