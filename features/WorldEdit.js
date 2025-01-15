const dat = JSON.parse(FileLib.read("Floyd-main", "WorldEdit.json")) ? JSON.parse(FileLib.read("Floyd-main", "WorldEdit.json")) : [];
FileLib.write("Floyd-main", "WorldEdit.json", JSON.stringify(dat), true);

register('packetSent', (packet, event) => {
    let pos = new BlockPos(packet.func_179724_a());

    let data = {
        pos: pos,
        blockType: World.getBlockAt(pos).type.getID()
    }

    dat.push(data)

    FileLib.write("Floyd-main", "WorldEdit.json", JSON.stringify(dat), true);

}).setPacketClass(net.minecraft.network.play.client.C08PacketPlayerBlockPlacement)
