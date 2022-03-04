import * as React from 'react';
import JSONBigInt from 'json-bigint';
import { RatesDictionary, ChartData } from './types'
import { tokenInfosById, tokenInfosByName } from './tokenDictionary';
import { ExplorerTokenMarket } from "ergo-market-lib/dist/ExplorerTokenMarket";
import { ITimestampedBox } from "ergo-market-lib/dist/interfaces/explorer/IBox";
import { renderFractions, math } from "ergo-market-lib/dist/math";

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { getChart } from './MyChart';

import { Expandable } from './ExpandMore';
import { ITokenRate } from 'ergo-market-lib/dist/interfaces/ITokenRate';
  
const explorerTokenMarket = new ExplorerTokenMarket();
const JSONBI = JSONBigInt({ useNativeBigInt: false });

type BalanceTimeline = { tokenBalances: { [key: string]: number }; box: ITimestampedBox; timestamp: number }[];

export const getChartDataForAddress = async (addr: string, tokenRates: RatesDictionary): Promise<{ [key: string]: ChartData }> => {
  const balancesOverTime: BalanceTimeline = await explorerTokenMarket.getBalanceTimelineAtAddress(addr);
  if (balancesOverTime === undefined || balancesOverTime.length < 1) return {};

  const firstBalanceTimestamp: number = parseInt(balancesOverTime[0].timestamp as any);
  tokenRates[tokenInfosById.nergs.name] = [{
    ergPerToken: 1,
    tokenPerErg: 1,
    tokenAmount: '0',
    ergAmount: '0',
    timestamp: firstBalanceTimestamp,
    globalIndex: 0,
    token: tokenInfosById.nergs
  }];

  const tokenRateKeys = Object.keys(tokenRates);

  let lastTokenRates = tokenRateKeys.reduce<{ [key: string]: ITokenRate, timestamp: any }>((acc, cur) => {
    const tokenRate = {
      ...tokenRates[cur][0],
      ergPerToken: 0.0,
      tokenPerErg: 0.0,
      ergAmount: '0.0',
      tokenAmount: '0.0',
    };
    acc[cur] = tokenRate;
    acc.timestamp = tokenRate.timestamp;
    return acc;
  }, { timestamp: 0 as any });
  lastTokenRates[tokenInfosById.nergs.name].ergPerToken = 1;
  lastTokenRates[tokenInfosById.nergs.name].tokenPerErg = 1;

  const tokenRatesAtTimestamp: { [key: string]: ITokenRate, timestamp: any }[] = [];
  const allTokenRates = tokenRateKeys.flatMap(tokenRateKey => tokenRates[tokenRateKey]).sort((a, b) => a.timestamp > b.timestamp ? 1 : -1)
  allTokenRates.forEach(tokenRate => {
    const tokenRateKey = tokenRate.token.name || tokenRate.token.tokenId;
    lastTokenRates[tokenRateKey] = tokenRate;
    tokenRatesAtTimestamp[parseInt(tokenRate.timestamp as any)] = { ...lastTokenRates, timestamp: parseInt(tokenRate.timestamp as any) as any }; // Clone so next update doesn't modify this instance
  })

  const rateTimestamps: string[] = Object.keys(tokenRatesAtTimestamp);
  const firstBalanceRateIndex = Math.max(1, rateTimestamps.findIndex(timestamp => parseInt(timestamp) > firstBalanceTimestamp)) - 1;

  let lastBalances = tokenRateKeys.reduce<{ [key: string]: number }>((acc, tokenRateKey) => {
    const tokenInfo = tokenInfosByName[tokenRateKey];
    const tokenId = tokenInfo?.tokenId || tokenRateKey;
    acc[tokenId] = 0;
    return acc;
  }, { });

  // let printCounter = 0;
  const results = tokenRateKeys.reduce<{ [key: string]: ChartData }>((acc, cur) => {
    acc[cur] = [];
    return acc;
  }, {});
  for(let rateIndex = firstBalanceRateIndex; rateIndex < rateTimestamps.length; rateIndex++) {
    const currentTimestamp = parseInt(rateTimestamps[rateIndex]);
    const currentRate = tokenRatesAtTimestamp[currentTimestamp];
    const attemptedBalanceIndex = balancesOverTime.findIndex(bal => parseInt(bal.timestamp as any) > parseInt(currentRate.timestamp));
    const currentBalanceIndex = (attemptedBalanceIndex === -1 ? balancesOverTime.length : Math.max(1, attemptedBalanceIndex)) - 1;
    const currentBalance = balancesOverTime[currentBalanceIndex];
    const newTokenBalances = { ...lastBalances, ...currentBalance.tokenBalances };
    Object.keys(currentBalance.tokenBalances).forEach(tokenId => {
      const tokenInfo = tokenInfosById[tokenId];
      const tokenKey = tokenInfo?.name || tokenId;
      newTokenBalances[tokenKey] = currentBalance.tokenBalances[tokenKey];
    })
    lastBalances = newTokenBalances;
    tokenRateKeys.forEach(tokenRateKey => {
      const tokenRate = currentRate[tokenRateKey]
      const tokenAmount = lastBalances[tokenRate.token.tokenId] || 0;
      const tokenAmountWithDecimals = renderFractions(tokenAmount, tokenRate.token.decimals);
      const tokenValue = math.evaluate?.(`${tokenAmountWithDecimals} * ${tokenRate.ergPerToken}`).toFixed(3);
      results[tokenRateKey].push({ timestamp: parseInt(currentTimestamp as any) as any, value: parseFloat(tokenValue) });

      // if (printCounter < 10 && attemptedBalanceIndex > 1) {
      //   printCounter++;
      //   console.log('balancesOverTime, currentBalanceIndex, attemptedBalanceIndex, tokenAmount, tokenRate, tokenAmountWithDecimals, tokenValue, lastBalances', {balancesOverTime, currentBalanceIndex, attemptedBalanceIndex, tokenAmount, tokenRate, tokenAmountWithDecimals, tokenValue, lastBalances});
      // }
    })
  }

  return results;
};


type AddressChartsProps = { tokenRateKeys: string[]; balancesByToken: { [key: string]: ChartData }; ratesByToken: RatesDictionary };
export const AddressCharts = (props: AddressChartsProps) => {
  const { tokenRateKeys, balancesByToken } = props;

  if (Object.keys(balancesByToken).length < 1) return (<>
    <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', width: '100%' }}>
      <Card sx={{ m: 2 }} variant="outlined">
        <Typography variant="h6" align="center">Address balances not found</Typography>
      </Card>
    </Box>
  </>);

const otherChartOptions = {
  grid: {
    containLabel: true, left: 10, right: 20, bottom: 0, top: 50,
  },
  legend: {
    data: tokenRateKeys
  },
  xAxis: {
    type: "time",
    data: balancesByToken[tokenRateKeys[0]].map(({timestamp}) => timestamp),
    boundaryGap: false,
    smooth: true
    // axisTick: {
    //   alignWithLabel: true
    // },
    // axisLabel: {
    //   rotate: 30
    // }
  },
  series: tokenRateKeys.map((tokenRateKey) => {
    return {
      data: balancesByToken[tokenRateKey].map(({timestamp, value}) => ({
        name: tokenRateKey,
        value: [timestamp, value],
      })),
      type: 'line',
      name: tokenRateKey,
      showSymbol: false,
      stack: 'Total',
      areaStyle: {},        
      emphasis: {
        focus: 'series'
      },
    };
  })
}
// `~${totalErgValue.toLocaleString('en-US', { maximumFractionDigits: 4})} Σ`
const totalErgValue = tokenRateKeys.reduce((acc, tokenRateKey) => acc + balancesByToken[tokenRateKey].slice(-1)[0].value, 0);
  return (
  <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', width: '100%' }}>
    <Card variant="outlined">
      <Typography variant="h5" align="center">Address values of tokens over time in Σ</Typography>
      <Expandable initiallyExpanded={true}>
        <Card sx={{ m: 2 }} variant="elevation">
          <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap'}}>
            <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', m: 1, width: '100%' }}>
              <Typography variant="h6" align="center">Wallet values in Σ</Typography>
              { getChart('Σ', [] as any, `~${totalErgValue.toLocaleString('en-US', { maximumFractionDigits: 4})} Σ`, otherChartOptions) }
            </Box>
          </Box>
        </Card>
        <Card sx={{ m: 2 }} variant="elevation">
          <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap'}}>
          {tokenRateKeys.map((tokenRateKey) => {
            const { decimals: decimalsForThisToken, tokenId } = tokenInfosByName[tokenRateKey];
            if (balancesByToken[tokenRateKey] === undefined) {
              return null;
            }
            return (
              <Box key={tokenRateKey} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', m: 1, width: '30%' }}>
                <Typography variant="h6" align="center">Wallet value of {tokenRateKey} in Σ</Typography>
                { getChart('Σ', balancesByToken[tokenRateKey], `~${balancesByToken[tokenRateKey].slice(-1)[0].value.toLocaleString('en-US', { maximumFractionDigits: 4})} Σ`) }
              </Box>)
          })}
          </Box>
        </Card>
      </Expandable>
    </Card>
  </Box>);
}