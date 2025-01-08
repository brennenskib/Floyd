function setAngles(yaw, pitch) {
    if(!World.isLoaded()) return;
    const player = Client.getMinecraft().field_71439_g
    player.field_70177_z = yaw
    player.field_70125_A = pitch
}

class Rotations {
    working = false;

    sides = [[0.5, 0.01, 0.5], [0.5, 0.98, 0.5], [0.01, 0.5, 0.5], [0.98, 0.5, 0.5], [0.5, 0.5, 0.01], [0.5, 0.5, 0.99]];

    canSeePos(pos, reachCheck=true) {
        for(let i = 0; i < this.sides.length; i++) {
            let side = this.sides[i];
            let point = [pos.x + side[0], pos.y + side[1], pos.z + side[2]];
            let vector = new net.minecraft.util.Vec3(point[0], point[1], point[2])
            let castResult = World.getWorld().func_147447_a(Player.getPlayer().func_174824_e(1), vector, false, false, true)

            if(castResult && castResult.func_178782_a().equals(pos.toMCBlock()) && (!reachCheck || vector.func_72438_d(Player.getPlayer().func_174824_e(1)) < 4.5)) {
                return { result: true, point: vector };
            }
        }
        return { result: false };
    }
    
    getVector(yaw, pitch) {
        let vector = Player.getPlayer().func_174824_e(1).func_178787_e(new net.minecraft.util.Vec3(
            Math.sin(-yaw * (Math.PI/180) - Math.PI) * -Math.cos(-pitch * (Math.PI/180)),
            Math.sin(-pitch * (Math.PI/180)),
            Math.cos(-yaw * (Math.PI/180) - Math.PI) * -Math.cos(-pitch * (Math.PI/180)),
        ));

        return vector
    }

    wrap180(angle) {
        angle %= 360.0
        while (angle >= 180.0)
          angle -= 360.0
        while (angle < -180.0)
          angle += 360.0
        return angle
    }

    _180(angle) {
        return (angle - Math.floor(angle / 360 + 0.5) * 360);
    } 

    easeOutQuad(t) {
        return t === 0 ? 0 : t === 1 ? 1 
            : ((t -= 1) * t * ((1.70158 + 1) * t + 1.70158) + 1);
    }

    isWorking() {
        return this.working;
    }

    getChange(yaw, pitch) {
        if(!yaw || !pitch) return;
        let currAngle = [Player.getYaw(), Player.getPitch()]

        let yDiff = Math.abs(this._180(yaw) - this._180(currAngle[0]))
        let pDiff = Math.abs(this._180(pitch - this._180(currAngle[1])))

        return (yDiff+pDiff);
    }

    lookAt(vec, velocity, additiveFactor = 15, then) {
        if (
            Client.getMinecraft().field_71462_r == null || 
            Client.getMinecraft().field_71462_r instanceof net.minecraft.client.gui.GuiIngameMenu || 
            Client.getMinecraft().field_71462_r instanceof net.minecraft.client.gui.GuiChat
        ) {
            if(this.working) return;
            new Thread(() => {
                    this.working = true;
                    let eyes = Player.getPlayer().func_174824_e(1)

                    let deltaX = vec.field_72450_a - eyes.field_72450_a;
                    let deltaY = vec.field_72448_b - eyes.field_72448_b;
                    let deltaZ = vec.field_72449_c - eyes.field_72449_c;

                    let dist = Math.sqrt(deltaX * deltaX + deltaZ * deltaZ)
                    let pitch = -Math.atan2(dist, deltaY)
                    let yaw = Math.atan2(deltaZ, deltaX)

                    pitch = this.wrap180(((pitch * 180.0) / Math.PI + 90.0) * - 1.0 - Player.getPlayer().field_70125_A)
                    yaw = this.wrap180((yaw * 180.0) / Math.PI - 90.0 - Player.getPlayer().field_70177_z)

                    if(Math.round(yaw) == 0 && Math.round(pitch) == 0) {
                        this.working = false;
                        if(then) then();
                    }

                    let change = this.getChange(yaw, pitch) / 7.5;

                    let DynamicAdditive = (factor) => {
                        let totalChange = Math.abs(Math.round(yaw + pitch));
                        
                        if(totalChange <= 10) return factor *= 0.5
                        else if(totalChange <= 25) return factor *= 0.75
                        else return factor*=1.25;
                    }

                    let adding = (change/5) + (DynamicAdditive(additiveFactor))

                    for (i = 0; i < velocity; i++) {
                        if(!this.working) return;
                        let half = velocity / 2;
                        let additive = 0;
                        
                        if (i < half) {
                            change > 4 ? additive += (adding) / half : 0;
                        } else if (i > half) {
                            change > 4 ? additive -= (adding) / half : 0;
                        } else {
                            additive = 0;
                        }
                        
                        Player.getPlayer().field_70177_z += (yaw / velocity) + additive
                        Player.getPlayer().field_70125_A += (pitch / velocity) + additive
                        Thread.sleep(1)
                    }

                    this.working = false;
                    if(then) then();
                    else return;
            }).start()
        }
    }

    toAngles(yaw,pitch,velocity,then) {
        if (
            Client.getMinecraft().field_71462_r == null || 
            Client.getMinecraft().field_71462_r instanceof net.minecraft.client.gui.GuiIngameMenu || 
            Client.getMinecraft().field_71462_r instanceof net.minecraft.client.gui.GuiChat
        ) {    
            if (!this.working) {
                new Thread(() => {
                    for (let i = 0; i < velocity; i++) {
                        Player.getPlayer().field_70177_z += yaw / velocity
                        Player.getPlayer().field_70125_A += pitch / velocity
                        Thread.sleep(1)
                    }
                    this.working = false
                    if(then) then()
                }).start()
            }
        }
    }

    snapLook(vec, velocity, then) {
        if (
            Client.getMinecraft().field_71462_r == null || 
            Client.getMinecraft().field_71462_r instanceof net.minecraft.client.gui.GuiIngameMenu || 
            Client.getMinecraft().field_71462_r instanceof net.minecraft.client.gui.GuiChat
        ) {
            if(this.working) return;
            new Thread(() => {
                    this.working = true;
                    let eyes = Player.getPlayer().func_174824_e(1)

                    let deltaX = vec.field_72450_a - eyes.field_72450_a;
                    let deltaY = vec.field_72448_b - eyes.field_72448_b;
                    let deltaZ = vec.field_72449_c - eyes.field_72449_c;

                    let dist = Math.sqrt(deltaX * deltaX + deltaZ * deltaZ)
                    let pitch = -Math.atan2(dist, deltaY)
                    let yaw = Math.atan2(deltaZ, deltaX)

                    pitch = this.wrap180(((pitch * 180.0) / Math.PI + 90.0) * - 1.0 - Player.getPlayer().field_70125_A)
                    yaw = this.wrap180((yaw * 180.0) / Math.PI - 90.0 - Player.getPlayer().field_70177_z)

                    for (i = 0; i < velocity; i++) {
                        if(!this.working) return;

                        // not +=, just =
                        // makes it so the player canNOT move the cursor while a rotation is occuring
                        // if this fails, its only use case is secretaura so the problem is there :shrug:

                        Player.getPlayer().field_70177_z = Player.getPlayer().field_70177_z + (yaw / velocity)
                        Player.getPlayer().field_70125_A =  Player.getPlayer().field_70125_A + (pitch / velocity)
                        Thread.sleep(1)
                    }

                    this.working = false;
                    
                    if(then) then();
                    else return;
            }).start()
        }
    }
}

global.floyd.rot = new Rotations()