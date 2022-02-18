import * as React from 'react';

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { ITokenRate } from "ergo-market-lib";
import JSONBigInt from 'json-bigint';
import { getChart } from './MyChart';
import moment from 'moment';
import { RatesDictionary } from './types';
import { Expandable } from './ExpandMore';
const JSONBI = JSONBigInt({ useNativeBigInt: false });

const displayChartForData = (ratesByToken: RatesDictionary, tokenRateKey: string, valueField: string, argumentField: string, tokenName: string) => {
    if (ratesByToken[tokenRateKey].map === undefined) return (<Typography key={tokenName} variant="h3" align="center">{tokenName}</Typography>)
    const priceData = ratesByToken[tokenRateKey].map((rate: ITokenRate) => ({ timestamp: moment(rate.timestamp).toISOString(), value: rate.ergPerToken}))
    const tokenAmountData = ratesByToken[tokenRateKey].map((rate: ITokenRate) => ({ timestamp: moment(rate.timestamp).toISOString(), value: JSONBI.parse(rate.tokenAmount || '0.0')}))
    const ergAmountData = ratesByToken[tokenRateKey].map((rate: ITokenRate) => ({ timestamp: moment(rate.timestamp).toISOString(), value: JSONBI.parse(rate.ergAmount || '0.0')}))
    const ergMarketSizeData = ratesByToken[tokenRateKey]
      .filter((rate: ITokenRate) => rate.ergAmount !== undefined)
      .map((rate: ITokenRate) => ({ timestamp: moment(rate.timestamp).toISOString(), value: (parseFloat(rate.ergAmount) + (JSONBI.parse(rate.tokenAmount) * parseFloat(rate.ergPerToken.toString()))) }))
    return <>
      <Card key={tokenName} sx={{ m: 2 }} variant="elevation">
        <Typography variant="h3" align="center">{tokenName}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', m: 1, width: '40%' }}>
            <Typography variant="h6" align="center">Price per token in Σ</Typography>
            { getChart('Σ', priceData, `1 Σ = ~${(1 / (priceData.slice(-1)[0].value)).toFixed(2)} ${tokenName}`) }
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', mx: 0, width: '20%'}}>
            <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', my: 0.5, height: '200px'}}>
              <Typography variant="h6" align="center">Tokens in pool</Typography>
              { getChart(tokenName, tokenAmountData, `${tokenAmountData.slice(-1)[0].value.toFixed(2).toString()} ${tokenName}s`) }
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', my: 0.5, height: '200px'}}>
              <Typography variant="h6" align="center">Σ in pool</Typography>
              { getChart('Σ', ergAmountData, `${ergAmountData.slice(-1)[0].value.toFixed(2).toString()} Σ`) }
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', m: 1, width: '40%' }}>
            <Typography variant="h6" align="center">Market value in Σ</Typography>
            { getChart('Σ', ergMarketSizeData, `~${JSONBI.parse(ergMarketSizeData.slice(-1)[0].value.toString()).toFixed(2)} Σ`) }
          </Box>
        </Box>
      </Card>
    </>
  }

type PoolChartsProps = { tokenRateKeys: string[]; ratesByToken: RatesDictionary };
export const PoolCharts = (props: PoolChartsProps) => {
  const [expanded, setExpanded] = React.useState<boolean>(true);
  const { tokenRateKeys, ratesByToken } = props;
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', width: '100%' }}>
    <Card variant="outlined">
    <Typography variant="h5" align="center">Token market prices and pool values</Typography>
<Expandable>
  <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
    {tokenRateKeys.map((tokenRateKey) => {
      return displayChartForData(ratesByToken, tokenRateKey, 'ergPerToken', 'timestamp', tokenRateKey);
    })}
  </Box></Expandable></Card></Box>);
}