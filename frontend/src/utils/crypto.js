import CryptoJS from "crypto-js";

const SECRET_KEY = CryptoJS.enc.Utf8.parse("fallback_secret_key_32bytes_ok!!");

export function encryptPayload(data) {
  const jsonStr = JSON.stringify(data);
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(jsonStr, SECRET_KEY, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  
  const combined = iv.clone().concat(encrypted.ciphertext);
  return combined.toString(CryptoJS.enc.Base64);
}

export function decryptPayload(b64Str) {
  const combined = CryptoJS.enc.Base64.parse(b64Str);
  
  const iv = CryptoJS.lib.WordArray.create(combined.words.slice(0, 4));
  const ciphertext = CryptoJS.lib.WordArray.create(combined.words.slice(4), combined.sigBytes - 16);
  
  const cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext: ciphertext });
  
  const decrypted = CryptoJS.AES.decrypt(cipherParams, SECRET_KEY, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  
  return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
}
