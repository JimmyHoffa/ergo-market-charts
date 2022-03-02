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
import moment from 'moment';

import { Expandable } from './ExpandMore';
  
const explorerTokenMarket = new ExplorerTokenMarket();
const JSONBI = JSONBigInt({ useNativeBigInt: false });

export const getChartDataForAddress = async (addr: string, tokenRates: RatesDictionary): Promise<{ [key: string]: ChartData }> => {
  const balancesOverTime: { tokenBalances: { [key: string]: number }; box: ITimestampedBox; timestamp: number }[] = await explorerTokenMarket.getBalanceTimelineAtAddress(addr);
  if (balancesOverTime === undefined || balancesOverTime.length < 1) return {};
  const tokensWithBalances = Object.keys(balancesOverTime.slice(-1)[0].tokenBalances)
  const balancesData: { [key: string]: ChartData } = {};
  tokensWithBalances.forEach(tokenId => {
    const tokenInfo = tokenInfosById[tokenId];
    const tokenKey = tokenInfo?.name || tokenId;
    const ratesForToken = tokenRates[tokenKey];
    if (ratesForToken === undefined || ratesForToken.length < 1) return; // Don't have price rates for this token, oh well
    const firstBalanceTimestamp = balancesOverTime[0].timestamp;
    const firstBalanceRateIndex = Math.max(1, ratesForToken.findIndex(rate => rate.timestamp > firstBalanceTimestamp)) - 1
    for(let rateIndex = firstBalanceRateIndex; rateIndex < ratesForToken.length; rateIndex++) {
      const currentRate = ratesForToken[rateIndex];
      const attemptedBalanceIndex = balancesOverTime.findIndex(bal => bal.timestamp > currentRate.timestamp);
      const currentBalanceIndex = (attemptedBalanceIndex === -1 ? balancesOverTime.length : Math.max(1, attemptedBalanceIndex)) - 1;
      const currentBalance = balancesOverTime[currentBalanceIndex];
      balancesData[tokenKey] = balancesData[tokenKey] || [];
      const currentTokenBalance = renderFractions((currentBalance.tokenBalances[tokenId] || 0).toString(), tokenInfo.decimals);
      const ergValue = math.evaluate?.(`${currentTokenBalance} * ${currentRate.ergPerToken}`).toFixed(3);
      balancesData[tokenKey].push({value: ergValue, timestamp: moment(currentRate.timestamp).toISOString()});
    }
  })
  return balancesData;
};


type AddressChartsProps = { tokenRateKeys: string[]; balancesByToken: { [key: string]: ChartData }; ratesByToken: RatesDictionary };
export const AddressCharts = (props: AddressChartsProps) => {
  const { tokenRateKeys, balancesByToken, ratesByToken } = props;

  if (Object.keys(balancesByToken).length < 1) return (<>
    <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', width: '100%' }}>
      <Card sx={{ m: 2 }} variant="outlined">
        <Typography variant="h6" align="center">Address balances not found</Typography>
      </Card>
    </Box>
  </>);

  return (
  <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', width: '100%' }}>
    <Card variant="outlined">
      <Typography variant="h5" align="center">Address values of tokens over time in Σ</Typography>
      <Expandable initiallyExpanded={true}>
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