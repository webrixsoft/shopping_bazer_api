const dotenv = require('dotenv');
const crypto = require('crypto');
const algorithm = "aes-256-cbc";
const algorithmPassword = "hhjbjhguguyguiguyguyg";
const IV = "5183666c72eec9e4";

exports.encryptText = async (text) => {
        let cipher = await crypto.createCipheriv(algorithm, algorithmPassword, IV);
        let encrypted = await cipher.update(text, 'utf8', 'base64');
        encrypted += await cipher.final('base64');
        if (await encrypted) {
                return encrypted;
        } else {
                return false;
        }
};


exports.decryptText = async (encryptText) => {
        let decipher = await crypto.createDecipheriv(algorithm, algorithmPassword, IV);
        let decrypted = await decipher.update(encryptText, 'base64', 'utf8');
        decrypted += await decipher.final('utf8');
        if (await decrypted) {
                return decrypted;
        } else {
                return false;
        }
};