import { ITokenRate } from 'ergo-market-lib/dist/interfaces/ITokenRate';
import { math } from 'ergo-market-lib/dist/math';
import { IPoolChartData, ChartDataDictionary, RatesDictionary } from './types';
import { tokenInfosById } from './tokenDictionary';
import SortedSet from 'collections/sorted-set';
import moment from 'moment';

const tokenRateComparison = (a: ITokenRate, b: ITokenRate) => a.timestamp > b.timestamp ? 1 : -1;

const chartDataByToken: ChartDataDictionary = {};
export const getChartDataByToken = (tokenKey: string): IPoolChartData => {
  chartDataByToken[tokenKey] = chartDataByToken[tokenKey] || {
    priceData: [],
    tokenAmountData: [],
    ergAmountData: [],
    ergMarketSizeData: []
    // priceData: new SortedSet([], undefined, tokenRateComparison),
    // tokenAmountData: new SortedSet([], undefined, tokenRateComparison),
    // ergAmountData: new SortedSet([], undefined, tokenRateComparison),
    // ergMarketSizeData: new SortedSet([], undefined, tokenRateComparison)
  };
  return chartDataByToken[tokenKey];
}

export const addTokenRatesToDictionary = (rates: ITokenRate[], ratesDict: RatesDictionary, maxRatesNumber: number = 5000): RatesDictionary => {
  const newRatesDict = rates.reduce((acc: any, cur) => {
    if (tokenInfosById[cur.token.tokenId] === undefined) return acc;
    const tokenKey = tokenInfosById[cur.token.tokenId]?.name;
    const ratesForThisToken = acc[tokenKey] = acc[tokenKey] || [];
    const previousRate: ITokenRate = ratesForThisToken.pop();
    previousRate && ratesForThisToken.push(previousRate);
    if (math.evaluate?.( `${cur.ergAmount} < (${previousRate?.ergAmount || '0'} / 2)`)) return acc;
    if (math.evaluate?.( `${cur.tokenAmount} < (${previousRate?.tokenAmount || '0'} / 2)`)) return acc;
    if(previousRate?.ergPerToken !== cur.ergPerToken || previousRate?.ergAmount !== cur.ergAmount || previousRate?.tokenAmount !== cur.tokenAmount) {
      const toInsert = { ...cur, timestamp: moment(cur.timestamp).valueOf()};
      const indexToInsert = ratesForThisToken.findIndex((rate: ITokenRate) => rate.timestamp > toInsert.timestamp);
      ratesForThisToken.splice(indexToInsert === -1 ? ratesForThisToken.length : indexToInsert, 0, toInsert);
    }
    while (ratesForThisToken.length > maxRatesNumber) ratesForThisToken.splice(0, 1);
    return acc;
  }, ratesDict);
  return newRatesDict;
}

export const addRateToPoolData = (tokenRateKey: string) => (rate: ITokenRate) => {
  const chartDataForToken = getChartDataByToken(tokenRateKey);
  const {
    priceData,
    tokenAmountData,
    ergAmountData,
    ergMarketSizeData
  } = chartDataForToken;
  const timestamp = rate.timestamp as any;
  priceData.push({ timestamp, value: rate.ergPerToken});

  tokenAmountData.push({ timestamp, value: parseFloat(rate.tokenAmount || '0.0')});
  ergAmountData.push({ timestamp, value: parseFloat(rate.ergAmount || '0.0')});
  ergMarketSizeData.push({ timestamp, value: parseFloat(math.evaluate?.(`${rate.ergAmount} + (${rate.tokenAmount} * ${rate.ergPerToken})`)) });
};