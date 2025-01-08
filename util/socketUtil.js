function encrypt(text, key) {
    let encrypted = '';
    for (let i = 0; i < text.length; i++) {
        encrypted += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return encrypted;
}

function decrypt(encryptedText, key) {
    let decrypted = '';
    for (let i = 0; i < encryptedText.length; i++) {
        decrypted += String.fromCharCode(encryptedText.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return decrypted;
}

function keyGen(len) {
    let key = ""

    for(let i = 0; i < len; i++) {
        key += String.fromCharCode(Math.round(Math.random()*65535))
    }

    return key;
}

global.floyd.socketUtil = { 
    encrypt, 
    decrypt, 
    keyGen 
}