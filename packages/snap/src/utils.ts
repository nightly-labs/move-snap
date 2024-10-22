import { ManageStateOperation } from '@metamask/snaps-sdk';
import { DEFAULT_SNAP_STATE, SnapState } from './types';
import { AptosSignAndSubmitTransactionInput } from '@aptos-labs/wallet-standard';
export async function getState(): Promise<SnapState> {
  const snapState = await snap.request({
    method: 'snap_manageState',
    params: {
      operation: ManageStateOperation.GetState,
      encrypted: false,
    },
  });
  console.log({ snapState });
  // Check if the state is null
  if (snapState === null) {
    // Update the state with default values
    const result = await snap.request({
      method: 'snap_manageState',
      params: {
        operation: ManageStateOperation.UpdateState,
        encrypted: false,
        // @ts-ignore
        newState: DEFAULT_SNAP_STATE,
      },
    });
    console.log({ result });
    return DEFAULT_SNAP_STATE;
  }
  // @ts-ignore
  return snapState as SnapState;
}

export async function updateState(newState: SnapState) {
  const result = await snap.request({
    method: 'snap_manageState',
    params: {
      operation: ManageStateOperation.UpdateState,
      encrypted: false,
      // @ts-ignore
      newState: newState,
    },
  });
  console.log({ result });
}

export const isAptosSignAndSubmitTransactionInput = (
  input: any,
): input is AptosSignAndSubmitTransactionInput => {
  return 'payload' in input;
};
