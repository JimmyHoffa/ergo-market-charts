import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
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
import {theme} from './theme';

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
      <Card key={tokenName}>
        <Grid container justifyItems={"center"} justifyContent="center">
        <Grid item xs={12} justifyContent="center">
          <Typography variant="h3" align="center">{tokenName}</Typography>
        </Grid>
        <Grid item xs={5} justifyContent="center">
          <Typography variant="h6" align="center">Price per token in ergs</Typography>
        </Grid>
        <Grid item xs={5} justifyContent="center">
          <Typography variant="h6" align="center">Market value in ergs</Typography>
        </Grid>
        <Grid item xs={5}>
          { getChart(tokenName, priceData, `1 erg = ~${(1 / (priceData.slice(-1)[0].value)).toFixed(2)} ${tokenName}`) }
        </Grid>
        <Grid item xs={5}>
          { getChart(tokenName, ergMarketSizeData, `${(ergMarketSizeData.slice(-1)[0].value.toFixed(2))} ergs`) }
        </Grid></Grid>
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
    acc[tokenKey] = acc[tokenKey] || [];
    const previousRate = acc[tokenKey].pop();
    previousRate && acc[tokenKey].push(previousRate);
    if(previousRate?.ergPerToken !== cur.ergPerToken || previousRate?.ergAmount !== cur.ergAmount) acc[tokenKey].push(cur);
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

    console.log('newRatesByToken', newRatesByToken)
    window.localStorage.setItem('tickerRatesDict', JSONBI.stringify(newRatesByToken));
    setRatesByToken({ ...newRatesByToken });
  };

  const [marketRequestsInterval, setMarketRequestsInterval] = React.useState(undefined as any);
  if (marketRequestsInterval === undefined) setMarketRequestsInterval(setInterval(getRates, 10000));
  const tokenRateKeys = Object.keys(ratesByToken);

  const stopRetrievingData = () => {
    clearInterval(marketRequestsInterval);
  }
  const resumeRetrievingData = () => {
    clearInterval(marketRequestsInterval);
    setMarketRequestsInterval(undefined);
  }
  return (
    <>
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <Paper>
    <Grid container spacing={2} rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent="center">
      <Grid item xs={3} justifyContent="center">
        <Button key="stop" onClick={stopRetrievingData} color="primary" variant="outlined">Stop</Button>
        <Button key="resume" onClick={resumeRetrievingData} color="secondary" variant="outlined">Resume</Button>
      </Grid>
      <Grid item xs={10}>
        {tokenRateKeys.map((tokenRateKey) => {
          return displayChartForData(ratesByToken, tokenRateKey, 'ergPerToken', 'timestamp', tokenRateKey);
        })}
      </Grid>
    </Grid></Paper>
    </ThemeProvider>
    </>
  );
}

export default hot(App);