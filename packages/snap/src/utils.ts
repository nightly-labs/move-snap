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
  // Check if the state is null
  if (snapState === null) {
    // Update the state with default values
    // Ignore the error if the state is not updated
    await snap.request({
      method: 'snap_manageState',
      params: {
        operation: ManageStateOperation.UpdateState,
        encrypted: false,
        // @ts-ignore
        newState: DEFAULT_SNAP_STATE,
      },
    });
    return DEFAULT_SNAP_STATE;
  }
  // @ts-ignore
  return snapState as SnapState;
}

export async function updateState(newState: SnapState) {
  return await snap.request({
    method: 'snap_manageState',
    params: {
      operation: ManageStateOperation.UpdateState,
      encrypted: false,
      // @ts-ignore
      newState: newState,
    },
  });
}

export const isAptosSignAndSubmitTransactionInput = (
  input: any,
): input is AptosSignAndSubmitTransactionInput => {
  return 'payload' in input;
};
