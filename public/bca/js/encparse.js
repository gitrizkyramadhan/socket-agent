var aesjs = require('aes-js');
var conv = require('binstring');
var crypto = require('crypto');
//var randbuffer = require('random-bufferrandom-buffer');
var encmd5 = '23cf0a2cee744a1d8e60c8c15c893d14';
console.log(encmd5);
function pad(n, width, z) {

  z = z || ' ';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

 function encryptMsg(text, passpharse){
    text = pad(text, 16)
    var key = Array.prototype.slice.call(conv(passpharse.substring(0,16), { in:'binary' }), 0);
    var iv = Array.prototype.slice.call(conv(crypto.randomBytes(16), { in:'binary' }), 0);
    var textBytes = aesjs.utils.utf8.toBytes(text);
    var segmentSize = 16;
    var aesCfb = new aesjs.ModeOfOperation.cfb(key, iv, segmentSize);
    var encryptedBytes = aesCfb.encrypt(textBytes);
    iv = conv(iv, { out:'hex' });
    return iv + aesjs.utils.hex.fromBytes(encryptedBytes);
}

function decryptMsg(text, passpharse){
    var key = Array.prototype.slice.call(conv(passpharse.substring(0,16), { in:'binary' }), 0);
    var iv = Array.prototype.slice.call(conv(text.substring(0,32), { in:'hex' }), 0);
    text = text.substring(32,64);
    var encryptedBytes = aesjs.utils.hex.toBytes(text);
    var aesCfb = new aesjs.ModeOfOperation.cfb(key, iv, 16);
    var decryptedBytes = aesCfb.decrypt(encryptedBytes);
    return aesjs.utils.utf8.fromBytes(decryptedBytes).trim();
}
//console.log(conv(crypto.randomBytes(8), {out:'hex'}));