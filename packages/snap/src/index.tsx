import {
  AptosSignMessageInput,
  NetworkInfo,
} from '@aptos-labs/wallet-standard';
import type { OnRpcRequestHandler } from '@metamask/snaps-sdk';
import { Address, Bold, Box, Text } from '@metamask/snaps-sdk/jsx';
import { getAccount } from './account';
import { decodeAptosTransaction } from './aptos';

import { getState, updateState } from './utils';
/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  // Get the state
  const state = await getState();
  console.log({ state });
  console.log({ request });
  switch (request.method) {
    case 'connect': {
      const account = await getAccount();
      const response = await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: (
            <Box>
              <Text>
                <Bold>{origin}</Bold>! want to connect to your account
              </Text>
              <Text>
                <Bold>{account.accountAddress.toString()}</Bold>
              </Text>
              <Text>Confirm to connect to your account.</Text>
            </Box>
          ),
        },
      });
      if (response === true) {
        return {
          publicKey: account.publicKey.toString(),
          address: account.accountAddress.toString(),
        };
      } else {
        throw new Error('User rejected the request.');
      }
    }
    case 'getNetwork': {
      return state.network as any;
    }
    case 'changeNetwork': {
      const newNetworkInfo = request.params as unknown as NetworkInfo;
      const changeNetworkResponse = await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: (
            <Box>
              <Text>
                <Bold>{origin}</Bold> wants to change the network to
              </Text>
              <Text>
                Name: <Bold>{newNetworkInfo.name}</Bold>
              </Text>
              <Text>
                Id: <Bold>{newNetworkInfo.chainId.toString()}</Bold>
              </Text>
              {newNetworkInfo.url ? (
                <Text>
                  Url: <Bold>{newNetworkInfo.url}</Bold>
                </Text>
              ) : null}
              <Text>Confirm to change the network.</Text>
            </Box>
          ),
        },
      });
      if (changeNetworkResponse === true) {
        // Update the state
        await updateState({ ...state, network: newNetworkInfo });
        return null;
      } else {
        throw new Error('User rejected the request.');
      }
    }
    case 'signAndSubmitTransaction': {
      const account = await getAccount();

      const result = await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: (
            <Box>
              <Text>
                <Bold>{origin}</Bold> wants to sign a transaction
              </Text>
              <Text>
                using <Bold>{account.accountAddress.toString()}</Bold> account
              </Text>
              <Text>Confirm to sign this transaction.</Text>
            </Box>
          ),
        },
      });
      const signAndSubmitTransactionInput = decodeAptosTransaction(
        (request.params as any).payload,
      );
      const signature = account.signTransactionWithAuthenticator(
        signAndSubmitTransactionInput,
      );
      if (result === true) {
        return signature.bcsToHex().toString();
      } else {
        throw new Error('User rejected the request.');
      }
    }
    case 'signMessage': {
      const signMessageParams = request.params as AptosSignMessageInput;
      const account = await getAccount();
      const result = await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: (
            <Box>
              <Text>
                <Bold>{origin}</Bold> wants to sign a message:
              </Text>
              <Text>
                <Bold>{signMessageParams.message}</Bold>
              </Text>
              <Text>
                using <Bold>{account.accountAddress.toString()}</Bold> account
              </Text>
              <Text>Confirm to sign this message.</Text>
            </Box>
          ),
        },
      });
      const signature = account.sign(signMessageParams.message);
      if (result === true) {
        return signature.bcsToHex().toString();
      } else {
        throw new Error('User rejected the request.');
      }
    }
    default:
      throw new Error('Method not found.');
  }
};
