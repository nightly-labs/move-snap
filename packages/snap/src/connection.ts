import { Aptos, AptosConfig } from '@aptos-labs/ts-sdk';
import { NetworkInfo } from '@aptos-labs/wallet-standard';

export const getConnection = (networkInfo: NetworkInfo): Aptos => {
  const aptosConfig = new AptosConfig({
    network: networkInfo.name,
    fullnode: networkInfo.url,
  });
  const connection = new Aptos(aptosConfig);
  return connection;
};
