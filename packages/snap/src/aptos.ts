import {
  AccountAddress,
  type AnyRawTransaction,
  Deserializer,
  RawTransaction,
  Serializer,
} from '@aptos-labs/ts-sdk';
export type AnyRawTransactionStringified = {
  rawTransaction: string;
  secondarySignerAddresses?: undefined | string[];
  feePayerAddress?: string;
};
export const encodeAptosTransaction = (
  aptosTx: AnyRawTransaction,
): AnyRawTransactionStringified => {
  const buffer = new Serializer();
  aptosTx.rawTransaction.serialize(buffer);
  return {
    rawTransaction: Buffer.from(buffer.toUint8Array()).toString('hex'),
    secondarySignerAddresses: aptosTx.secondarySignerAddresses?.map((e) =>
      e.toString(),
    ),
    feePayerAddress: aptosTx.feePayerAddress?.toString(),
  };
};
export const decodeAptosTransaction = (
  encodedTx: AnyRawTransactionStringified,
): AnyRawTransaction => {
  const decodedAnyRawTransaction = {
    rawTransaction: RawTransaction.deserialize(
      new Deserializer(Buffer.from(encodedTx.rawTransaction, 'hex')),
    ),
    secondarySignerAddresses: encodedTx.secondarySignerAddresses?.map((e) =>
      AccountAddress.fromString(e),
    ),
    feePayerAddress: encodedTx.feePayerAddress
      ? AccountAddress.fromString(encodedTx.feePayerAddress)
      : undefined,
  };
  return decodedAnyRawTransaction as AnyRawTransaction;
};

// const client = new Aptos();

// export const fetchCoinDetails = async (coinAddress: string) => {
//   try {
//     const resource = await client.getFungibleAssetMetadataByAssetType({
//       assetType: coinAddress,
//     });
//     console.log(resource);

//     // Example for AptosCoin or USDC
//     const { symbol: ticker, decimals } = resource; // If present in the resource
//     return { ticker, decimals };
//   } catch (error) {
//     return error;
//   }
// };
