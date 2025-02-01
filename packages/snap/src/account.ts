import { type HardenedSLIP10Node, SLIP10Node } from '@metamask/key-tree';
import {
  Account,
  type Ed25519Account,
  Ed25519PrivateKey,
} from '@aptos-labs/ts-sdk';

export const getAccount = async (
  index: number = 0,
): Promise<Ed25519Account> => {
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

  if (!keypair.privateKeyBytes) {
    throw new Error('Failed to derive private key bytes');
  }

  const account = Account.fromPrivateKey({
    privateKey: new Ed25519PrivateKey(keypair.privateKeyBytes),
  });

  return account;
};
