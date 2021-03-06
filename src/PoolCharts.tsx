import * as React from 'react';

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { getChart } from './MyChart';
import { RatesDictionary } from './types';
import { Expandable } from './ExpandMore';
import { getChartDataByToken, addRateToPoolData } from './chartDataStore';

const previousTokenRateLengths: { [key: string]: number } = {};


const displayChartForData = (ratesByToken: RatesDictionary, tokenRateKey: string, valueField: string, argumentField: string, tokenName: string) => {
    if (ratesByToken[tokenRateKey]?.map === undefined) return (<Typography key={tokenName} variant="h3" align="center">{tokenName}</Typography>)
    previousTokenRateLengths[tokenRateKey] = previousTokenRateLengths[tokenRateKey] || 0;
    const { priceData, tokenAmountData, ergAmountData, ergMarketSizeData } = getChartDataByToken(tokenRateKey);
    if (previousTokenRateLengths[tokenRateKey] < ratesByToken[tokenRateKey].length)
    {
      ratesByToken[tokenRateKey].slice(previousTokenRateLengths[tokenRateKey]).forEach(addRateToPoolData(tokenRateKey));
      previousTokenRateLengths[tokenRateKey] = ratesByToken[tokenRateKey].length
    }
    return <>
      <Card key={tokenRateKey} sx={{ m: 2 }} variant="elevation">
        <Typography variant="h3" align="center">{tokenName}</Typography>
        <Expandable initiallyExpanded={true}>
          <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', m: 1, width: '40%' }}>
              <Typography variant="h6" align="center">Price per token in Σ</Typography>
              { getChart('Σ', priceData, `1 Σ = ~${(1 / (priceData.slice(-1)[0]?.value))?.toLocaleString('en-US', { maximumFractionDigits: 4})} ${tokenName}`) }
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', mx: 0, width: '20%'}}>
              <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', my: 0.5, height: '200px'}}>
                <Typography variant="h6" align="center">Tokens in pool</Typography>
                { getChart(tokenName, tokenAmountData, `${tokenAmountData.slice(-1)[0]?.value?.toLocaleString('en-US', { maximumFractionDigits: 4})?.toString()} ${tokenName}s`) }
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', my: 0.5, height: '200px'}}>
                <Typography variant="h6" align="center">Σ in pool</Typography>
                { getChart('Σ', ergAmountData, `${ergAmountData.slice(-1)[0]?.value?.toLocaleString('en-US', { maximumFractionDigits: 4})?.toString()} Σ`) }
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', m: 1, width: '40%' }}>
              <Typography variant="h6" align="center">Market value in Σ</Typography>
              { getChart('Σ', ergMarketSizeData, `~${ergMarketSizeData.slice(-1)[0]?.value?.toLocaleString('en-US', { maximumFractionDigits: 4})} Σ`) }
            </Box>
          </Box>
        </Expandable>
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
<Expandable initiallyExpanded={true}>
  <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
    {tokenRateKeys.map((tokenRateKey) => {
      return displayChartForData(ratesByToken, tokenRateKey, 'ergPerToken', 'timestamp', tokenRateKey);
    })}
  </Box></Expandable></Card></Box>);
}