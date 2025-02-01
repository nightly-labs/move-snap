import { type Json, ManageStateOperation } from '@metamask/snaps-sdk';
import {
  DEFAULT_SNAP_STATE,
  type SnapState,
  type TxPayloadType,
} from './types';
import { type TransactionPayload } from '@aptos-labs/ts-sdk';
/**
 * Get the snap state.
 * @returns The snap state.
 */
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
        newState: DEFAULT_SNAP_STATE as unknown as Record<string, Json>,
      },
    });
    return DEFAULT_SNAP_STATE;
  }
  return snapState as unknown as SnapState;
}
/**
 * Update the snap state.
 * @param newState - The new snap state.
 */
export async function updateState(newState: SnapState): Promise<void> {
  await snap.request({
    method: 'snap_manageState',
    params: {
      operation: ManageStateOperation.UpdateState,
      encrypted: false,
      newState: newState as unknown as Record<string, Json>,
    },
  });
}

export const validateUrl = (url: string | undefined): void => {
  // Validate only if the URL is provided
  if (url) {
    try {
      new URL(url);
    } catch {
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
