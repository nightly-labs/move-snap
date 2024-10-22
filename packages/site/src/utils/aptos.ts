import {
  AccountAddress,
  AnyRawTransaction,
  Deserializer,
  RawTransaction,
  Serializer,
} from '@aptos-labs/ts-sdk';
export interface IAnyRawTransactionStringified {
  rawTransaction: string;
  secondarySignerAddresses?: undefined | string[];
  feePayerAddress?: string;
}
export const encodeAptosTransaction = (
  aptosTx: AnyRawTransaction,
): IAnyRawTransactionStringified => {
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
  encodedTx: IAnyRawTransactionStringified,
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
