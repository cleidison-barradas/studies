const { AES, enc } = require('crypto-js');

async function encriptText(encriptPassword, encriptText) {
  return AES.encrypt(encriptText, encriptPassword).toString();
}

async function decriptText(decriptPassword, decriptText) {
  return AES.decrypt(decriptText, decriptPassword).toString(enc.Utf8);
}

module.exports = {
  encriptText,
  decriptText,
};
