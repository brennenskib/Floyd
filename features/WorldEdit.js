const dat = JSON.parse(FileLib.read("Floyd-main", "WorldEdit.json")) ? JSON.parse(FileLib.read("Floyd-main", "WorldEdit.json")) : [];
FileLib.write("Floyd-main", "WorldEdit.json", JSON.stringify(dat), true);

register('packetSent', (packet, event) => {
    ChatLib.chat('test')
    let pos = new BlockPos(packet.func_179724_a());
    ChatLib.command('ct copy ' + `{ x: ${pos.x}, y: ${pos.y}, z: ${pos.z}, blockType: ${World.getBlockAt(pos).type.getID()}, dir: ${packet.func_149568_f()} }`, true)
}).setPacketClass(net.minecraft.network.play.client.C08PacketPlayerBlockPlacement)

let blocks = [
    { x: 56, y: 113, z: 111, blockType: 41, dir: 1 },
    { x: 55, y: 113, z: 111, blockType: 7 },
    { x: 55, y: 114, z: 111, blockType: 7 },
    { x: 56, y: 112, z: 110, blockType: 1 }
