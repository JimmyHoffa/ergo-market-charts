import { ITokenRate } from "ergo-market-lib/dist/interfaces/ITokenRate";


export type ChartData = { value: number; timestamp: Date }[];
export interface IPoolChartData {
  priceData: ChartData;
  tokenAmountData: ChartData;
  ergAmountData: ChartData;
  ergMarketSizeData: ChartData;
}
export type RatesDictionary = { [key: string]: ITokenRate[] };
export type ChartDataDictionary = { [key: string]: IPoolChartData };

export interface TransactionList {
  items: (ItemsEntity)[];
  total: number;
}
export interface ItemsEntity {
  id: string;
  blockId: string;
  inclusionHeight: number;
  timestamp: number;
  index: number;
  globalIndex: number;
  numConfirmations: number;
  inputs: (InputsEntity)[];
  dataInputs: (null)[];
  outputs: (OutputsEntity)[];
  size: number;
}
export interface InputsEntity {
  boxId: string;
  value: number;
  index: number;
  spendingProof: string;
  outputBlockId: string;
  outputTransactionId: string;
  outputIndex: number;
  outputGlobalIndex: number;
  outputCreatedAt: number;
  outputSettledAt: number;
  ergoTree: string;
  address: string;
  assets: (AssetsEntity)[];
  additionalRegisters: AdditionalRegisters;
}
export interface AssetsEntity {
  tokenId: string;
  index: number;
  amount: number;
  name: string;
  decimals: number;
  type: string;
}
export interface AdditionalRegisters {
  R4: R4OrR5OrR6;
  R5: R4OrR5OrR61;
  R6: R4OrR5OrR62;
}
export interface R4OrR5OrR6 {
  serializedValue: string;
  sigmaType: string;
  renderedValue: string;
}
export interface R4OrR5OrR61 {
  serializedValue: string;
  sigmaType: string;
  renderedValue: string;
}
export interface R4OrR5OrR62 {
  serializedValue: string;
  sigmaType: string;
  renderedValue: string;
}
export interface OutputsEntity {
  boxId: string;
  transactionId: string;
  blockId: string;
  value: number;
  index: number;
  globalIndex: number;
  creationHeight: number;
  settlementHeight: number;
  ergoTree: string;
  address: string;
  assets: (AssetsEntity1)[];
  additionalRegisters: AdditionalRegisters;
  spentTransactionId: string;
  mainChain: boolean;
}
export interface AssetsEntity1 {
  tokenId: string;
  index: number;
  amount: number | string | number | string | number | string | number | string | number | string | number | string | number | string | number | string | number | string | number | string | number | string | number | string;
  name: string;
  decimals: number;
  type: string;
}
  