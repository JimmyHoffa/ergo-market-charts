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
          { getChart(tokenName, priceData, `1 ${tokenName} = ~${(priceData.slice(-1)[0].value)} ERG`) }
        </Grid>
        <Grid item xs={5}>
          { getChart(tokenName, ergMarketSizeData, `${(ergMarketSizeData.slice(-1)[0].value)} ERGS Market Value`) }
        </Grid></Grid>
      </Card>
  </>
}

const tokenKeyToChartData = (tokenKey: string, ratesByToken: { [key: string]: ITokenRate[] }) => {
  
}

const startingTickerData = {};

const addTokenRatesToDictionary = (rates: ITokenRate[], ratesDict: RatesDictionary) => {
  return rates.reduce((acc: any, cur) => {
    const tokenKey = tokenInfosById[cur.token.tokenId]?.name || cur.token.tokenId
    acc[tokenKey] = acc[tokenKey] || [];
    acc[tokenKey].push(cur);
    return acc;
  }, ratesDict);
}

historicalTickerData.forEach((tickersAtTime: ITokenRate[]) => {
  addTokenRatesToDictionary(tickersAtTime, startingTickerData);
})

export const App = (props: AppProps) => {
  const { name } = props;
  const [ratesByToken, setRatesByToken] = React.useState<RatesDictionary>(startingTickerData);

  const getRates = async () => {
    const rates = await explorerTokenMarket.getTokenRates();
    const newRatesByToken = addTokenRatesToDictionary(rates, ratesByToken);

    console.log('newRatesByToken', newRatesByToken)
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
    </Grid></Paper></>
  );
}

export default hot(App);