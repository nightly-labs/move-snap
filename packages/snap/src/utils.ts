import { ManageStateOperation } from '@metamask/snaps-sdk';
import { DEFAULT_SNAP_STATE, SnapState, TxPayloadType } from './types';
import { AptosSignAndSubmitTransactionInput } from '@aptos-labs/wallet-standard';
import { TransactionPayload } from '@aptos-labs/ts-sdk';
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

export const validateUrl = (url: string | undefined) => {
  // Validate only if the URL is provided
  if (url) {
    try {
      new URL(url);
    } catch (e) {
      throw new Error('Invalid URL');
    }
  }
};
export const sanitizeString = (data: string): string => {
  return data
    .replace(/[\r\n]/gu, '')
    .replace(/\s+/gu, ' ')
    .trim();
};

export const payloadToType = (payload: TransactionPayload): TxPayloadType => {
  if ('script' in payload) {
    return 'script';
  }
  if ('entryFunction' in payload) {
    return 'entryFunction';
  }
  if ('multiAgent' in payload) {
    return 'multiSig';
  }
  throw new Error('Invalid payload');
};
