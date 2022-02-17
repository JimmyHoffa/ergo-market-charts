import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';

import { ExplorerTokenMarket, ITokenRate } from "ergo-market-lib";
import moment from 'moment';
import * as React from "react";
import { hot } from "react-hot-loader/root";
import historicalTickerData from './ticker.json';
import { tokenInfosById } from './tokenDictionary';
import { ChartData, getChart } from './MyChart';
import JSONBigInt from 'json-bigint';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';

const JSONBI = JSONBigInt({ useNativeBigInt: false });

interface AppProps {
  name: string;
}

const explorerTokenMarket = new ExplorerTokenMarket({ throwOnError: false });
interface AppState {
  ratesByToken: { [key: string]: ITokenRate[] }
};

type RatesDictionary = { [key: string]: ITokenRate[] };

const displayChartForData = (ratesByToken: RatesDictionary, tokenRateKey: string, valueField: string, argumentField: string, tokenName: string) => {
  if (ratesByToken[tokenRateKey].map === undefined) return (<Typography key={tokenName} variant="h3" align="center">{tokenName}</Typography>)
  const priceData = ratesByToken[tokenRateKey].map((rate: ITokenRate) => ({ timestamp: moment(rate.timestamp).toISOString(), value: rate.ergPerToken}))
  const ergMarketSizeData = ratesByToken[tokenRateKey]
    .filter((rate: ITokenRate) => rate.ergAmount !== undefined)
    .map((rate: ITokenRate) => ({ timestamp: moment(rate.timestamp).toISOString(), value: JSONBI.parse(rate.ergAmount) as number }))
  return <>
    <Card key={tokenName} sx={{ m: 2 }} variant="outlined">
      <Typography variant="h3" align="center">{tokenName}</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', m: 2, width: '100%'}}>
          <Typography variant="h6" align="center">Price per token in ergs</Typography>
          { getChart(tokenName, priceData, `1 erg = ~${(1 / (priceData.slice(-1)[0].value)).toFixed(2)} ${tokenName}`) }
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', m: 2, width: '100%' }}>
          <Typography variant="h6" align="center">Market value in ergs</Typography>
          { getChart(tokenName, ergMarketSizeData, `${(ergMarketSizeData.slice(-1)[0].value.toFixed(2))} ergs`) }
        </Box>
      </Box>
    </Card>
  </>
}

const tokenKeyToChartData = (tokenKey: string, ratesByToken: { [key: string]: ITokenRate[] }) => {
  
}

let startingTickerData: RatesDictionary = {};
let postSeedTickerData: RatesDictionary = {};
try {
  postSeedTickerData = JSONBI.parse(window.localStorage.getItem('tickerRatesDict') || '{}');
} catch(ex) {
  window.localStorage.setItem('tickerRatesDict', '{}');
  postSeedTickerData = {};
}

const addTokenRatesToDictionary = (rates: ITokenRate[], ratesDict: RatesDictionary) => {
  return rates.reduce((acc: any, cur) => {
    const tokenKey = tokenInfosById[cur.token.tokenId]?.name || cur.token.tokenId
    const ratesForThisToken = acc[tokenKey] = acc[tokenKey] || [];
    const previousRate = ratesForThisToken.pop();
    previousRate && ratesForThisToken.push(previousRate);
    if(previousRate?.ergPerToken !== cur.ergPerToken || previousRate?.ergAmount !== cur.ergAmount) ratesForThisToken.push(cur);
    if (ratesForThisToken.length > 5000) ratesForThisToken.splice(0, 1);
    return acc;
  }, ratesDict);
}

// Add historical data points from seeded data and browser local storage to form initial ticker data
const sortedHistoricalData = historicalTickerData.flatMap(a => a).concat(Object.keys(postSeedTickerData).flatMap(key => postSeedTickerData[key])).sort((a: ITokenRate, b: ITokenRate) => 
  moment(a.timestamp).isSameOrBefore(moment(b.timestamp)) ? -1 : 1
)
addTokenRatesToDictionary(sortedHistoricalData, startingTickerData);

export const App = (props: AppProps) => {
  const { name } = props;
  const [ratesByToken, setRatesByToken] = React.useState<RatesDictionary>(startingTickerData);

  const getRates = async () => {
    const rates = await explorerTokenMarket.getTokenRates();
    const newRatesByToken = addTokenRatesToDictionary(rates, ratesByToken);
    window.localStorage.setItem('tickerRatesDict', JSONBI.stringify(newRatesByToken));
    setRatesByToken({ ...newRatesByToken });
  };

  const [marketRequestsInterval, setMarketRequestsInterval] = React.useState(-1 as any);
  if (marketRequestsInterval === -1) setMarketRequestsInterval(setInterval(getRates, 10000));
  const stopRetrievingData = () => {
    clearInterval(marketRequestsInterval);
    setMarketRequestsInterval(undefined);
  }
  const resumeRetrievingData = () => {
    clearInterval(marketRequestsInterval);
    setMarketRequestsInterval(-1);
  }
  const onStopOrplayChange = (event: any, newValue: any) => {
    console.log('AAAAA', newValue)
    if (newValue === 'stop') stopRetrievingData();
    else resumeRetrievingData();
  }

  const tokenRateKeys = Object.keys(ratesByToken);
  return (
    <>
    <ThemeProvider theme={theme}>
    <CssBaseline />
    
    <Paper>
    <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>
      <ToggleButtonGroup color="primary" value={ marketRequestsInterval === undefined ? 'stop' : 'play'} exclusive onChange={onStopOrplayChange}>
        <ToggleButton key="stop" value="stop">Stop</ToggleButton>
        <ToggleButton key="play" value="play">play</ToggleButton>
      </ToggleButtonGroup>
    </Box>
    <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
        {tokenRateKeys.map((tokenRateKey) => {
          return displayChartForData(ratesByToken, tokenRateKey, 'ergPerToken', 'timestamp', tokenRateKey);
        })}
    </Box>
    </Paper>
    </ThemeProvider>
    </>
  );
}

export default hot(App);