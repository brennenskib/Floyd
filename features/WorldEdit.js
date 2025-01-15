const dat = JSON.parse(FileLib.read("Floyd-main", "WorldEdit.json")) ? JSON.parse(FileLib.read("Floyd-main", "WorldEdit.json")) : [];
 

register('packetSent', (packet, event) => {
    let pos = new BlockPos(packet.func_179724_a());

    let dat = {
        pos: pos,
        blockType: World.getBlockAt(pos).type.getID()
    }
}).setPacketClass(net.minecraft.network.play.client.C08PacketPlayerBlockPlacement)
