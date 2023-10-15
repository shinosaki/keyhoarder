import { PacketList, armor, enums } from 'openpgp';
import { envs } from './index.js';

export const algoName = {
  rsaEncryptSign: 'RSA',
  rsaEncrypt: 'RSA',
  rsaSign: 'RSA',
  elgamal: 'ElGamal',
  dsa: 'DSA',
};

// new Set(Object.values(openpgp.enums.curve))
export const keylen = {
  p256: 256,
  p384: 384,
  p521: 521,
  secp256k1: 256,
  ed25519: 255,
  curve25519: 255,
  brainpoolP256r1: 256,
  brainpoolP384r1: 384,
  brainpoolP512r1: 512,
};


export const parseKey = async (key) => {
  const { algorithm, curve, bits } = key.getAlgorithmInfo();

  return {
    fingerprint: key.getFingerprint(),
    keylen: bits ?? keylen[curve],
    algo: {
      id: enums.publicKey[algorithm],
      name: curve ?? algoName[algorithm] + bits,
    },
    created: key.getCreationTime().getTime(),
    expired: await key.getExpirationTime().then(r => (!r || r === Infinity) ? null : r.getTime())
  };
};

export const keys2armor = keys => {
  const packetList = new PacketList();
  keys.map(k => k.toPacketList().map(p => packetList.push(p)));

  return armor(enums.armor.publicKey, packetList.write());
};
