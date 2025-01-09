//this isnt my code and isnt done 

const GlStateManager = Java.type("net.minecraft.client.renderer.GlStateManager");
const GL11 = Java.type("org.lwjgl.opengl.GL11");

let lividFound = false;
let lividEntity = null;
let lividName = "";
let lividTrue;

register("tick", findCorrectLivid); // find the correct entity

function isInF5() {
    if (!ChatLib.removeFormatting(Scoreboard.getTitle()).includes("SKYBLOCK")) return false;
    let foundDungeons = false;
    Scoreboard.getLines().forEach((line, i) => {
        let unformated = ChatLib.removeFormatting(line.getName());
        if (unformated.includes("(M5)") || unformated.includes("(F5)")) {
            foundDungeons = true;
        }
    });
    return foundDungeons;
}

function findCorrectLivid() {
    if (!isInF5()) {
        lividFound = false;
        lividEntity = null;
        lividTrue = null;
        lividName = "";
        return;
    }
    let lividArr = [];
    if (!lividFound) {
        World.getAllEntities().forEach((entity) => {
            let entityName = entity.getName();
            if ((entityName.includes("Livid")) && entityName.length > 5 && entityName.charAt(1) === entityName.charAt(5) && !lividArr.includes(entity)) {
                lividArr.push(entity);

                if (lividArr.length === 1) {
                    lividEntity = entity;
                }
                if (lividArr.length === 9) {
                    lividFound = true;
                    lividName = lividEntity.getName();
                    ChatLib.chat("&c[Master Livid Finder] &fCorrect livid is: " + lividName);
                }
            }
        });
    }
    else if (!lividEntity.getName().substring(0, 3).equals(lividName.substring(0, 3))) {
        lividName = lividEntity.getName();
        changedelay = 0;
        ChatLib.chat("&c[Master Livid Finder] &fLivid name change: " + lividName);
    }
    if(lividFound) {
        rgb();
        findTrueLivid();
    }
}

function findTrueLivid() {
    var sd = 10000;
    var closestLivid;
    World.getAllEntities().forEach((livid) => {
        let lividsName = livid.getName();
        if((lividsName.includes("Livid")) && lividsName.length > 5 && lividsName.charAt(1) != lividsName.charAt(5)) {
            dx = (lividEntity.getX() - livid.getX());
            dz = (lividEntity.getZ() - livid.getZ());
            if((dx*dx + dz*dz) < sd) {
                sd = (dx*dx + dz*dz);
                closestLivid = livid;
            }
        }
    });
    if(closestLivid != undefined && closestLivid != null) {
        lividTrue = closestLivid;
    }
}