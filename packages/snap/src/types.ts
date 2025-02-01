import {
  Network,
  type TransactionPayloadEntryFunction,
  type TransactionPayloadMultiSig,
  type TransactionPayloadScript,
} from '@aptos-labs/ts-sdk';
import { type NetworkInfo } from '@aptos-labs/wallet-standard';
export const DEFAULT_NETWORK: NetworkInfo = {
  name: Network.MAINNET,
  chainId: 1,
};
export type SnapState = {
  network: NetworkInfo;
};

export const DEFAULT_SNAP_STATE: SnapState = {
  network: DEFAULT_NETWORK,
};

export type TxPayload =
  | TransactionPayloadScript
  | TransactionPayloadEntryFunction
  | TransactionPayloadMultiSig;
export type TxPayloadType = 'script' | 'entryFunction' | 'multiSig';
