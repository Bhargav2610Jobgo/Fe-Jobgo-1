import JSEncrypt from "jsencrypt";
export function useEncryption(text) {
  const publicKey = import.meta.env.VITE_PUBLIC_KEY;
  const RSAEncrypt = new JSEncrypt();
  RSAEncrypt.setPublicKey(publicKey);
  return RSAEncrypt.encrypt(text);
}

export function useDecryption(encryptedData) {
  const privateKey = import.meta.env.VITE_PRIVATE_KEY;
  const RSADecrypt = new JSEncrypt();
  RSADecrypt.setPrivateKey(privateKey);
  return RSADecrypt.decrypt(encryptedData);
}
