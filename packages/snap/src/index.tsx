import type {
  RawTransaction,
  TransactionPayload,
  TransactionPayloadEntryFunction,
  TransactionPayloadMultiSig,
  TransactionPayloadScript,
  // TransactionPayloadMultiSig,
  // TransactionPayloadScript,
} from '@aptos-labs/ts-sdk';
import type {
  AptosSignMessageInput,
  NetworkInfo,
} from '@aptos-labs/wallet-standard';
import type { OnRpcRequestHandler } from '@metamask/snaps-sdk';
import {
  Address,
  Bold,
  Box,
  Copyable,
  Row,
  Text,
} from '@metamask/snaps-sdk/jsx';
import BigNumber from 'bignumber.js';

import { getAccount } from './account';
import { decodeAptosTransaction } from './aptos';
import type { TxPayload } from './types';
import {
  chainIdToNetworkTicker,
  getState,
  isTransferCoinsPayload,
  littleEndianBytesToInt,
  parseAmountFromBcsArg,
  payloadToType,
  sanitizeString,
  updateState,
  validateUrl,
} from './utils';

export const payloadToUserContent = (tx: RawTransaction) => {
  const { payload } = tx;
  const payloadType = payloadToType(payload);
  switch (payloadType) {
    case 'script': {
      const script = payload as TransactionPayloadScript;
      // Hard to show details
      return (
        <Text>
          Transaction type: <Bold>Script</Bold>
        </Text>
      );
    }
    case 'entryFunction': {
      const entryFunction = payload as TransactionPayloadEntryFunction;
      return (
        <Box>
          <Row label="Transaction type">
            <Text>
              <Bold>Entry Function</Bold>
            </Text>
          </Row>
          <Row label="Function name">
            <Text>
              <Bold>
                {entryFunction.entryFunction.function_name.identifier}
              </Bold>
            </Text>
          </Row>
          <Row label="Module">
            <Text>
              <Bold>
                {entryFunction.entryFunction.module_name.address.toString()}::
                {entryFunction.entryFunction.module_name.name.identifier}
              </Bold>
            </Text>
          </Row>

          {isTransferCoinsPayload(
            entryFunction.entryFunction.function_name.identifier,
          ) ? (
            <Box>
              <Row label="Recipient">
                <Address
                  address={`aptos:1:${
                    entryFunction.entryFunction.args[0]
                      ?.bcsToHex()
                      .toString() ?? ''
                  }`}
                />
              </Row>
              <Row label="Amount">
                <Text>
                  {parseAmountFromBcsArg(entryFunction.entryFunction.args[1])}{' '}
                  {chainIdToNetworkTicker(Number(tx.chain_id.chainId))}
                </Text>
              </Row>
            </Box>
          ) : null}

          <Row label="Max gas amount">
            <Text>
              {BigNumber(tx.max_gas_amount.toString()).shiftedBy(-8).toString()}{' '}
              {chainIdToNetworkTicker(Number(tx.chain_id.chainId))}
            </Text>
          </Row>
        </Box>
      );
    }
    case 'multiSig': {
      const multiSig = payload as TransactionPayloadMultiSig;
      // Hard to show details
      return (
        <Box>
          <Row label="Transaction type">
            <Text>
              <Bold>Multi signature</Bold>
            </Text>
          </Row>
          <Row label="Function name">
            <Text>
              <Bold>
                {multiSig.multiSig.transaction_payload?.transaction_payload
                  ?.function_name.identifier ?? ''}
              </Bold>
            </Text>
          </Row>
          <Row label="Module">
            <Text>
              <Bold>
                {multiSig.multiSig.transaction_payload?.transaction_payload.module_name.address.toString() ??
                  ''}
                ::
                {multiSig.multiSig.transaction_payload?.transaction_payload
                  .module_name.name.identifier ?? ''}
              </Bold>
            </Text>
          </Row>

          {isTransferCoinsPayload(
            multiSig.multiSig.transaction_payload?.transaction_payload
              .function_name.identifier ?? '',
          ) ? (
            <Box>
              {/* <Row label="Multisig address">
                <Address
                  address={`aptos:1:${
                    multiSig.multiSig.multisig_address?.toString() ?? ''
                  }`}
                />
              </Row> */}
              <Row label="Recipient">
                <Address
                  address={`aptos:1:${
                    multiSig.multiSig.transaction_payload?.transaction_payload.args[0]
                      ?.bcsToHex()
                      .toString() ?? ''
                  }`}
                />
              </Row>

              <Row label="Amount">
                <Text>
                  {parseAmountFromBcsArg(
                    multiSig.multiSig.transaction_payload?.transaction_payload
                      .args[1],
                  )}{' '}
                  {chainIdToNetworkTicker(Number(tx.chain_id.chainId))}
                </Text>
              </Row>
            </Box>
          ) : null}

          <Row label="Max gas amount">
            <Text>
              {BigNumber(tx.max_gas_amount.toString()).shiftedBy(-8).toString()}{' '}
              {chainIdToNetworkTicker(Number(tx.chain_id.chainId))}
            </Text>
          </Row>
        </Box>
      );
    }
    default:
      return null;
  }
};

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
                <Bold>{origin}</Bold>! wants to connect to your account
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
      }
      throw new Error('User rejected the request.');
    }
    case 'getNetwork': {
      return state.network as any;
    }
    case 'changeNetwork': {
      const newNetworkInfo = request.params as unknown as NetworkInfo;
      // Validate the URL
      validateUrl(newNetworkInfo.url);
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
                Name: <Bold>{sanitizeString(newNetworkInfo.name)}</Bold>
              </Text>
              <Text>
                Id:{' '}
                <Bold>{sanitizeString(newNetworkInfo.chainId.toString())}</Bold>
              </Text>
              {newNetworkInfo.url ? (
                <Text>
                  Url: <Bold>{sanitizeString(newNetworkInfo.url)}</Bold>
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
      }
      throw new Error('User rejected the request.');
    }
    case 'signAndSubmitTransaction': {
      const account = await getAccount();
      const signAndSubmitTransactionInput = decodeAptosTransaction(
        (request.params as any).payload,
      );

      // We can try to show
      const module = signAndSubmitTransactionInput.rawTransaction
        .payload as TxPayload;
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
              {payloadToUserContent(
                signAndSubmitTransactionInput.rawTransaction,
              )}
              <Copyable value={JSON.stringify(module)} />
              <Text>Confirm to sign this transaction.</Text>
            </Box>
          ),
        },
      });
      if (result === true) {
        const signature = account.signTransactionWithAuthenticator(
          signAndSubmitTransactionInput,
        );
        return signature.bcsToHex().toString();
      }

      throw new Error('User rejected the request.');
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
                <Bold>{sanitizeString(signMessageParams.message)}</Bold>
              </Text>
              <Text>
                using <Bold>{account.accountAddress.toString()}</Bold> account
              </Text>
              <Text>Confirm to sign this message.</Text>
            </Box>
          ),
        },
      });
      if (result === true) {
        const signature = account.sign(signMessageParams.message);
        return signature.toString();
      }
      throw new Error('User rejected the request.');
    }
    default:
      throw new Error('Method not found.');
  }
};
