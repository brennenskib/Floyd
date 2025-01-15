const dat = JSON.parse(FileLib.read("Floyd-main", "WorldEdit.json")) ? JSON.parse(FileLib.read("Floyd-main", "WorldEdit.json")) : [];
FileLib.write("Floyd-main", "WorldEdit.json", JSON.stringify(dat), true);

register('packetSent', (packet, event) => {
    ChatLib.chat('test')
    let pos = new BlockPos(packet.func_179724_a());
    ChatLib.command('ct copy ' + `{ x: ${pos.x}, y: ${pos.y}, z: ${pos.z}, blockType: ${World.getBlockAt(pos).type.getID()}`, true)
}).setPacketClass(net.minecraft.network.play.client.C08PacketPlayerBlockPlacement)
