import { Network } from '@aptos-labs/ts-sdk';
import { NetworkInfo } from '@aptos-labs/wallet-standard';
export const DEFAULT_NETWORK: NetworkInfo = {
  name: Network.MAINNET,
  chainId: 1,
};
export interface SnapState {
  network: NetworkInfo;
}

export const DEFAULT_SNAP_STATE: SnapState = {
  network: DEFAULT_NETWORK,
};
