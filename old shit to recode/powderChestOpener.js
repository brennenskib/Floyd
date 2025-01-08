class PowderChestOpener {
    constructor() {
        this.enabled = false;
        this.chest = false;
        this.vec3 = net.minecraft.util.Vec3
        this.rotInst = new global.conatus.Rotation(100)
        this.prevYaw;

        register("packetReceived", (p, Event) => {
            if(!this.enabled) return;
            if(!this.chest) return;
            let x = p.func_149220_d()
            let y = p.func_149226_e()
            let z = p.func_149225_f()
            if(
                p.func_179749_a().toString() === "CRIT" && 
                Player.asPlayerMP().distanceTo(new BlockPos(x, y, z)) < 4
            ) {
                this.particle = new this.vec3(x,y,z)
                this.rotInst.lookAtBlock(this.particle)
            }
        }).setFilteredClasses([net.minecraft.network.play.server.S2APacketParticles])

        register('chat', () => {
            if(!this.enabled) return;
            this.chest = true;
            this.prevYaw = Player.getPlayer().func_70040_Z();
        }).setCriteria('You uncovered a treasure chest!').setContains();
    
        register('chat', () => {
            this.chest = false;
            setTimeout(() => {
                this.rotInst.lookAtBlock(this.prevYaw)
            }, 1000);
        }).setCriteria('CHEST LOCKPICKED').setContains();
    }

    _getAngles(vector) {
        if(vector == undefined || !vector) return;
        function to180(angle) {
            angle %= 360.0
            while (angle >= 180.0)
            angle -= 360.0
            while (angle < -180.0)
            angle += 360.0
            return angle
        }

        let eyes = Player.getPlayer().func_174824_e(1)
        let diffX = vector.field_72450_a - eyes.field_72450_a
        let diffY = vector.field_72448_b - eyes.field_72448_b
        let diffZ = vector.field_72449_c - eyes.field_72449_c
        let dist = Math.sqrt(diffX * diffX + diffZ * diffZ)
        let pitch = -Math.atan2(dist, diffY)
        let yaw = Math.atan2(diffZ, diffX)

        pitch = to180(((pitch * 180.0) / Math.PI + 90.0) * -1.0 - Player.getPlayer().field_70125_A)
        yaw = to180((yaw * 180.0) / Math.PI - 90.0 - Player.getPlayer().field_70177_z)

        return [ yaw, pitch ]
    }

    setStatus(bool) {
        this.enabled = bool;
    }
}

global.conatus.pce = PowderChestOpener

