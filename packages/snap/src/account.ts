import { HardenedSLIP10Node, SLIP10Node } from '@metamask/key-tree';
import { Account, Ed25519PrivateKey } from '@aptos-labs/ts-sdk';

export const getAccount = async (index: number = 0) => {
  const rootNode = await snap.request({
    method: 'snap_getBip32Entropy',
    params: {
      path: [`m`, `44'`, `637'`],
      curve: 'ed25519',
    },
  });
  const node = await SLIP10Node.fromJSON(rootNode);
  const path = [`${index}'`, `0'`, `0'`];
  const keypair = await node.derive(
    path.map((segment) => `slip10:${segment}` as HardenedSLIP10Node),
  );
  const account = Account.fromPrivateKey({
    privateKey: new Ed25519PrivateKey(keypair.privateKeyBytes!),
  });
  return account;
};
