//import { ConatusRegister } from "../util/dynamic_reload";
//import { obj } from "../util/data";

//let ogFile = FileLib.read('floydData', 'blacklist.json');

//ConatusRegister('worldLoad', () => {
    //if(!obj.blackListUrl) return; 
    //let content = FileLib.getUrlContent(obj.blackListUrl);

    //if(content !== ogFile) {
        //ChatLib.chat(`${prefix} Blacklist Updated!`);
        //FileLib.write("floydData", 'blacklist.json', content, true);
    //}
//})

//ConatusRegister('chat', (name, othershi) => {
    //ChatLib.chat(name)
    //let dat = JSON?.parse(FileLib.read('floydData', 'blacklist.json'))
    //if(!dat) return;
    //if(dat.names.includes(name)) {
        //kickUser(name);
    //}
//}).setChatCriteria("Party Finder > ${name}")

// > ${name} joined the dungeon group! (${othershi})