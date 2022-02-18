import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';

import { ExplorerTokenMarket, ITokenRate } from "ergo-market-lib";
import { getChartDataForAddress, AddressCharts } from './AddressCharts'
import moment from 'moment';
import * as React from "react";
import { hot } from "react-hot-loader/root";

import historicalTickerData from './ticker.json';
import { tokenInfosById } from './tokenDictionary';
import { PoolCharts } from './PoolCharts';
import JSONBigInt from 'json-bigint';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import { RatesDictionary, TransactionList } from './types';
import { ChartData } from './MyChart';
import { Typography } from '@mui/material';

const JSONBI = JSONBigInt({ useNativeBigInt: false });

interface AppProps {
  name: string;
}

const explorerTokenMarket = new ExplorerTokenMarket({ throwOnError: false });
interface AppState {
  ratesByToken: { [key: string]: ITokenRate[] }
};

(window as any).JSONBI = JSONBI;


let startingTickerData: RatesDictionary = {};
let postSeedTickerData: RatesDictionary = {};
try {
  postSeedTickerData = JSONBI.parse(window.localStorage.getItem('tickerRatesDict') || '{}');
} catch(ex) {
  window.localStorage.setItem('tickerRatesDict', '{}');
  postSeedTickerData = {};
}

const addTokenRatesToDictionary = (rates: ITokenRate[], ratesDict: RatesDictionary, maxRatesNumber: number = 5000) => {
  return rates.reduce((acc: any, cur) => {
    if (tokenInfosById[cur.token.tokenId] === undefined) return acc;
    const tokenKey = tokenInfosById[cur.token.tokenId]?.name; // || cur.token.tokenId
    const ratesForThisToken = acc[tokenKey] = acc[tokenKey] || [];
    const previousRate = ratesForThisToken.pop();
    previousRate && ratesForThisToken.push(previousRate);
    if(previousRate?.ergPerToken !== cur.ergPerToken || previousRate?.ergAmount !== cur.ergAmount || previousRate?.tokenAmount !== cur.tokenAmount) ratesForThisToken.push(cur);
    while (ratesForThisToken.length > maxRatesNumber) ratesForThisToken.splice(0, 1);
    return acc;
  }, ratesDict);
}

// Add historical data points from seeded data and browser local storage to form initial ticker data
const sortedHistoricalData = (historicalTickerData as any).flatMap((a: any) => a).concat(Object.keys(postSeedTickerData).flatMap(key => postSeedTickerData[key])).sort((a: ITokenRate, b: ITokenRate) => 
  moment(a.timestamp).isSameOrBefore(moment(b.timestamp)) ? -1 : 1
)
addTokenRatesToDictionary(sortedHistoricalData, startingTickerData);

export const App = (props: AppProps) => {
  const [ratesByToken, setRatesByToken] = React.useState<RatesDictionary>(startingTickerData);
  const [chosenTokensToDisplay, setChosenTokensToDisplay] = React.useState<string[]>([]);
  const [balancesByToken, setBalancesByToken] = React.useState<{ [key: string]: ChartData; }>({});
  const [maxTokenRatesPerToken, setMaxTokenRatesPerToken] = React.useState<number>(5000);

  const getRates = async () => {
    const rates = await explorerTokenMarket.getTokenRates();
    const newRatesByToken = addTokenRatesToDictionary(rates, ratesByToken, maxTokenRatesPerToken);
    setRatesByToken(newRatesByToken);
    window.localStorage.setItem('tickerRatesDict', JSONBI.stringify(newRatesByToken));
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
    if (newValue === 'stop') stopRetrievingData();
    else resumeRetrievingData();
  }

  const handleTokenChange = (a: any, chosenTokens: string[]) => {
    setChosenTokensToDisplay(chosenTokens)
  }
  const tokenRateKeysToChooseFrom = Object.keys(ratesByToken);
  const tokenRateKeys = chosenTokensToDisplay.length < 1 ? Object.keys(ratesByToken) : chosenTokensToDisplay;

  const runAddressAnalysis = async (clickEvent: any) => {
    const addressToAnalyze = clickEvent.target.parentElement.children[0].value
    const chartDataForAddress = await getChartDataForAddress(addressToAnalyze, ratesByToken);
    setBalancesByToken(chartDataForAddress)
  }

  const updateMaxDataPoints = (clickEvent: any) => {
    console.log('VVVVVVVV', clickEvent.target.parentElement.children[0].value);
    const maxDataPoints = parseInt(clickEvent.target.parentElement.children[0].value || maxTokenRatesPerToken)
    console.log('MAXXXXXXXXX', maxDataPoints);
    setMaxTokenRatesPerToken(maxDataPoints);
    Object.values(ratesByToken).forEach((tokenRates: ITokenRate[]) => {
      while (tokenRates.length > maxDataPoints) tokenRates.splice(0, 1);
    })
    setRatesByToken(ratesByToken);
  }
  return (
    <>
    <ThemeProvider theme={theme}>
    <CssBaseline />
    
    <Paper>
    <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', m: 2 }}>
      <ToggleButtonGroup color="primary" value={ marketRequestsInterval === undefined ? 'stop' : 'play'} exclusive onChange={onStopOrplayChange}>
        <ToggleButton key="stop" value="stop">Stop</ToggleButton>
        <ToggleButton key="play" value="play">play</ToggleButton>
      </ToggleButtonGroup>
    </Box>
    <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', m: 2 }}>
      <Typography variant="h6">Improve UI performance by reducing max data points per token:</Typography>
      <TextField
          id="outlined-number"
          label="Data points per token"
          type="number"
          variant="filled"
          defaultValue={5000}
          InputLabelProps={{shrink: true}}
          InputProps={{
            endAdornment: (<Button variant="contained" onClick={updateMaxDataPoints as any}>Update</Button>)
          }}
        />
    </Box>
    <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', m: 2 }}>
      <ToggleButtonGroup color="primary" value={ chosenTokensToDisplay } onChange={handleTokenChange}>
        {tokenRateKeysToChooseFrom.map((tokenRateKey) => {
          return <ToggleButton key={tokenRateKey} value={tokenRateKey}>{tokenRateKey}</ToggleButton>
        })}
      </ToggleButtonGroup>
    </Box>
    <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', m: 2 }}>
      {/* <TextField label="Address" variant="filled" onChange={handleAddressChange} value={addressToAnalyze} /> */}
      <TextField label="Address" fullWidth variant="filled" InputProps={{endAdornment: <Button variant="contained" onClick={runAddressAnalysis as any}>Analyze</Button>}} />
    </Box>
    <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', m: 2 }}>
      <AddressCharts
        tokenRateKeys={tokenRateKeys}
        balancesByToken={balancesByToken}
        ratesByToken={ratesByToken}
        />
    </Box>
    <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', m: 2 }}>
      <PoolCharts
        tokenRateKeys={tokenRateKeys}
        ratesByToken={ratesByToken}
        />
    </Box>
    </Paper>
    </ThemeProvider>
    </>
  );
}
// export default App;
export default hot(App);