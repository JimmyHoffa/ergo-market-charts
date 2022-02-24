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

import axios from 'axios';
import { tokenInfosById } from './tokenDictionary';
import { PoolCharts } from './PoolCharts';
import JSONBigInt from 'json-bigint';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import { RatesDictionary, TransactionList } from './types';
import { ChartData } from './MyChart';
import { Typography } from '@mui/material';
import { CopyToClipboard } from './CopyToClipboard'
import { Changelog } from './Changelog';
import { LoadingBlock } from './LoadingBlock'

const JSONBI = JSONBigInt({ useNativeBigInt: false });

const explorerTokenMarket = new ExplorerTokenMarket({ throwOnError: false });
interface AppState {
  ratesByToken: { [key: string]: ITokenRate[] }
};

(window as any).JSONBI = JSONBI;

let startingTickerData: RatesDictionary = {};
let postSeedTickerData: RatesDictionary = {};

const updateLocalStorageFromTickerRatesDict = (newRatesByToken: RatesDictionary) => {
  const localStorageRates = Object.keys(newRatesByToken).reduce((acc: any, cur: string) => {
    acc[cur] = newRatesByToken[cur].slice(-700);
    return acc;
  }, {});
  window.localStorage.setItem('tickerRatesDict', JSONBI.stringify(localStorageRates));
}

const addTokenRatesToDictionary = (rates: ITokenRate[], ratesDict: RatesDictionary, maxRatesNumber: number = 5000): RatesDictionary => {
  return rates.reduce((acc: any, cur) => {
    if (tokenInfosById[cur.token.tokenId] === undefined) return acc;
    const tokenKey = tokenInfosById[cur.token.tokenId]?.name;
    const ratesForThisToken = acc[tokenKey] = acc[tokenKey] || [];
    const previousRate = ratesForThisToken.pop();
    previousRate && ratesForThisToken.push(previousRate);
    if(previousRate?.ergPerToken !== cur.ergPerToken || previousRate?.ergAmount !== cur.ergAmount || previousRate?.tokenAmount !== cur.tokenAmount) ratesForThisToken.push(cur);
    while (ratesForThisToken.length > maxRatesNumber) ratesForThisToken.splice(0, 1);
    return acc;
  }, ratesDict);
}

const initialLoad = async () => {
  // Add historical data points from seeded data and browser local storage to form initial ticker data
  const historicalTickerDataResponse = await axios.get<ITokenRate[][]>('ticker.json');
  try {
    postSeedTickerData = JSONBI.parse(window.localStorage.getItem('tickerRatesDict') || '{}');
  } catch(ex) {
    window.localStorage.setItem('tickerRatesDict', '{}');
    postSeedTickerData = {};
  }

  const historicalTickerData = historicalTickerDataResponse.data;
  const sortedHistoricalData = (historicalTickerData as any).flatMap((a: any) => a).concat(Object.keys(postSeedTickerData).flatMap(key => postSeedTickerData[key])).sort((a: ITokenRate, b: ITokenRate) => 
    moment(a.timestamp).isSameOrBefore(moment(b.timestamp)) ? -1 : 1
  )
  
  addTokenRatesToDictionary(sortedHistoricalData, startingTickerData);
  historicalTickerData.splice(0); // Empty this array to GC its pointer tree instead of wasting memory;
}

export const App = (props: any) => {
  const [ratesByToken, setRatesByToken] = React.useState<RatesDictionary>(startingTickerData);
  const [chosenTokensToDisplay, setChosenTokensToDisplay] = React.useState<string[]>([]);
  const [balancesByToken, setBalancesByToken] = React.useState<{ [key: string]: ChartData; }>({});
  const [maxTokenRatesPerToken, setMaxTokenRatesPerToken] = React.useState<number>(5000);
  const [loadingCounter, setLoadingCounter] = React.useState<number>(1);
  const [initialLoadComplete, setInitialLoadComplete] = React.useState(false);
  const [marketRequestsInterval, setMarketRequestsInterval] = React.useState(-1 as any);

  if (!initialLoadComplete) {
    initialLoad().then(() => {
      setInitialLoadComplete(true);
      setLoadingCounter(Math.max(0,loadingCounter-1));
      getRates();
    }, () => {
      setInitialLoadComplete(true);
      setLoadingCounter(Math.max(0,loadingCounter-1));
    });
  }

  const getRates = async () => {
    if (!initialLoadComplete) return;
    setLoadingCounter(loadingCounter+1);
    const rates = await explorerTokenMarket.getTokenRates();
    const newRatesByToken = addTokenRatesToDictionary(rates, ratesByToken, maxTokenRatesPerToken);
    setRatesByToken({ ...newRatesByToken });
    updateLocalStorageFromTickerRatesDict(newRatesByToken);
    setLoadingCounter(Math.max(0,loadingCounter-1));
  };

  if (marketRequestsInterval === -1 && initialLoadComplete) {
    getRates();
    setMarketRequestsInterval(setInterval(getRates, 120000));
  }

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

  const tokenRateKeysToChooseFrom = Object.keys(ratesByToken).filter(t => t !== 'xyzpad');
  const tokenRateKeys = chosenTokensToDisplay.length < 1 ? Object.keys(ratesByToken).filter(t => t !== 'xyzpad') : chosenTokensToDisplay;

  const runAddressAnalysis = async (clickEvent: any) => {
    setLoadingCounter(loadingCounter+1);
    const addressToAnalyze = clickEvent.target.parentElement.children[0].value
    const chartDataForAddress = await getChartDataForAddress(addressToAnalyze, ratesByToken);
    setBalancesByToken({ ...chartDataForAddress })
    setLoadingCounter(Math.max(0,loadingCounter-1));
  }

  const updateMaxDataPoints = (clickEvent: any) => {
    const maxDataPoints = parseInt(clickEvent.target.parentElement.children[0].value || maxTokenRatesPerToken)
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
    <LoadingBlock loading={loadingCounter > 0} />
    <Paper>
    <Box sx={{ display: 'flex', flexDirection: 'row', m: 2, justifyContent: "space-between" }}>
      <Box sx={{ display: 'flex', alignItems: "flex-start", flexDirection: 'column' }}>
        <Typography variant="h6">Live updating new chart data every 2 minutes</Typography>
        <ToggleButtonGroup color="primary" value={ marketRequestsInterval === undefined ? 'stop' : 'play'} exclusive onChange={onStopOrplayChange}>
          <ToggleButton key="stop" value="stop">Stop</ToggleButton>
          <ToggleButton key="play" value="play">play</ToggleButton>
        </ToggleButtonGroup>
        <Changelog />
      </Box>
      <Box sx={{ display: 'flex', alignItems: "flex-end", alignSelf: "flex-end", flexDirection: 'column' }}>
        <CopyToClipboard whatToCopy="9fKu1S6PF3ttzqmLq5BHQjqLYGA5TWGifVC3DcVeDtgTvW6b1nG">
          <Typography variant="caption" sx={{ verticalAlign: 'top'}}>Tips welcome at 9fKu1S6PF3ttzqmLq5BHQjqLYGA5TWGifVC3DcVeDtgTvW6b1nG</Typography>
        </CopyToClipboard>
        <Typography component={(compProps) => <img src="tip-qr.png" height="100" width="100" {...compProps} ></img>}></Typography>
      </Box>
    </Box>
    {/* <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', m: 2 }}>
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
    </Box> */}
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