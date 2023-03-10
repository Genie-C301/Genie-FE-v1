import { AptosClient as Aptos, AptosAccount, HexString, Types } from 'aptos';
import {
  AccountInfo,
  NetworkInfo,
  SignMessagePayload,
  SignMessageResponse,
  Wallet,
  WalletInfo,
  WalletName,
} from '@aptos-labs/wallet-adapter-core';
import { getErrorMessage } from './error';

const DEVNET_NODE_URL = 'https://fullnode.devnet.aptoslabs.com/v1';
const NETWORK_GRAPHQL_ENDPOINT =
  'https://indexer-devnet.staging.gcp.aptosdev.com/v1/graphql';

interface WalletContextState {
  connected: boolean;
  account: AccountInfo | null;
  network: NetworkInfo | null;
  connect(walletName: WalletName): void;
  disconnect(): void;
  wallet: WalletInfo | null;
  wallets: Wallet[];
  signAndSubmitTransaction<T extends Types.TransactionPayload, V>(
    transaction: T,
    options?: V,
  ): Promise<any>;
  signTransaction<T extends Types.TransactionPayload, V>(
    transaction: T,
    options?: V,
  ): Promise<any>;
  signMessage(message: SignMessagePayload): Promise<SignMessageResponse | null>;
  signMessageAndVerify(message: SignMessagePayload): Promise<boolean>;
}

export default class Client {
  aptosClient: Aptos;
  wallet: WalletContextState;

  constructor(wallet: WalletContextState) {
    this.aptosClient = new Aptos(DEVNET_NODE_URL, {
      WITH_CREDENTIALS: false,
    });
    this.wallet = wallet;
  }

  shift(value: string, shift: number): string {
    // value is string with or without 1 decimal point
    let origin = value.indexOf('.');
    if (origin == -1) {
      value = value + '.';
      origin = value.indexOf('.');
    }

    let zeros = '0'.repeat(Math.abs(shift)).split('');
    let temp = zeros.concat(value.split('')).concat(zeros);
    let newOrigin = temp.indexOf('.');
    temp.splice(newOrigin, 1);

    temp.splice(newOrigin - shift, 0, '.');
    temp.splice(temp.indexOf('.'));
    while (temp[0] == '0') temp.shift();
    return temp.length == 0 ? '0' : temp.join('');
  }

  format(value: string, decimal: number): string {
    if (value == '0') return '0';
    let dataLength = value.length;
    return (
      value.substring(0, dataLength - decimal) +
      '.' +
      value.substring(dataLength - decimal, dataLength)
    );
  }

  async accountTransactions() {
    const accountAddress = this.wallet.account?.address;
    try {
      const data = await this.aptosClient.getAccountTransactions(
        //@ts-ignore
        accountAddress,
      );
      const transactions = data.map((item: { [key: string]: any }) => ({
        data: item.payload,
        from: item.sender,
        gas: item.gas_used,
        gasPrice: item.gas_unit_price,
        hash: item.hash,
        success: item.success,
        timestamp: item.timestamp,
        toAddress: item.payload.arguments[0],
        price: item.payload.arguments[1],
        type: item.type,
        version: item.version,
        vmStatus: item.vm_status,
      }));
      return { success: true, transactions };
    } catch (err) {
      return {
        success: false,
        err,
      };
    }
  }

  async registerCoin(
    coinTypeAddress: HexString,
    coinReceiver: AptosAccount,
  ): Promise<{ msg: string; success: boolean }> {
    const payload: Types.TransactionPayload = {
      type: 'entry_function_payload',
      function: '0x1::coin::register',
      type_arguments: [`0x1::aptos_coin::AptosCoin`],
      arguments: [],
    };

    const response = await this.wallet.signAndSubmitTransaction(payload);
    await this.aptosClient.waitForTransaction(response?.hash || '');

    return {
      msg: `https://explorer.aptoslabs.com/txn/${response?.hash}`,
      success: true,
    };
  }

  async transferApt(
    amount: string,
    address: string,
  ): Promise<{ msg: string; success: boolean }> {
    const payload: Types.TransactionPayload = {
      type: 'entry_function_payload',
      function: '0x1::aptos_account::transfer',
      type_arguments: [],
      arguments: [address, Number(this.shift(amount, -8))],
    };
    try {
      const response = await this.wallet.signAndSubmitTransaction(payload);
      await this.aptosClient.waitForTransaction(response?.hash || '');
      return {
        msg: `https://explorer.aptoslabs.com/txn/${response?.hash}`,
        success: true,
      };
    } catch (error: any) {
      const msg = getErrorMessage(error);
      return { msg: msg, success: false };
    }
  }

  async fetchGraphQL(
    operationsDoc: string,
    operationName: string,
    variables: any,
  ) {
    const result = await fetch(NETWORK_GRAPHQL_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operationName,
      }),
    });

    return await result.json();
  }

  async fetchCoins(): Promise<{ coin_type: string; amount: number }[]> {
    const operationsDoc = `
      query fetchCoins {
        coin_balances(
          where: {owner_address: {_eq: "${this.wallet.account?.address}"}}
          limit: 1
          order_by: {transaction_timestamp: desc}
        ) {
          amount
          coin_type
          owner_address
          transaction_timestamp
        }
      }
    `;

    const data = await this.fetchGraphQL(operationsDoc, 'fetchCoins', {});

    return data.data.coin_balances;
  }
}
