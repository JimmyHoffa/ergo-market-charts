import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';

import { ExplorerTokenMarket, ITokenRate } from "ergo-market-lib";
import { math } from "ergo-market-lib/dist/math";
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
import { RatesDictionary, ChartData, TransactionList } from './types';
import { Typography } from '@mui/material';
import { CopyToClipboard } from './CopyToClipboard'
import { changeLogItems } from './changelog';
import { todoItems } from './todos';
import { ExpandableList } from './ExpandableList';
import { LoadingBlock } from './LoadingBlock'
import { addTokenRatesToDictionary } from './chartDataStore';

const JSONBI = JSONBigInt({ useNativeBigInt: false });

const explorerTokenMarket = new ExplorerTokenMarket({ throwOnError: false });

let startingTickerData: RatesDictionary = {};
let postSeedTickerData: RatesDictionary = {};

const updateLocalStorageFromTickerRatesDict = (newRatesByToken: RatesDictionary) => {
  const localStorageRates = Object.keys(newRatesByToken).reduce((acc: any, cur: string) => {
    acc[cur] = newRatesByToken[cur].slice(-700);
    return acc;
  }, {});
  window.localStorage.setItem('tickerRatesDict', JSONBI.stringify(localStorageRates));
}

const initialLoad = async () => {
  // Add historical data points from seeded data and browser local storage to form initial ticker data
  const historicalTickerDataResponse = await axios.get<ITokenRate[][]>(`ticker.json?${changeLogItems.length}`); // Break cache every time the changelog indicates an update
  try {
    postSeedTickerData = JSONBI.parse(window.localStorage.getItem('tickerRatesDict') || '{}');
    console.log('postSeedTickerData', postSeedTickerData)
  } catch(ex) {
    window.localStorage.setItem('tickerRatesDict', '{}');
    postSeedTickerData = {};
  }

  const historicalTickerData: ITokenRate[][] = historicalTickerDataResponse.data;
  const sortedHistoricalData = historicalTickerData[0]
    .concat(Object.keys(postSeedTickerData).flatMap(key => postSeedTickerData[key]));

  console.log('sortedHistoricalData.length', sortedHistoricalData, sortedHistoricalData.length);
  
  addTokenRatesToDictionary(sortedHistoricalData, startingTickerData);
  console.log('startingTickerData', startingTickerData);
  historicalTickerData.splice(0); // Empty this array to GC its pointer tree instead of wasting memory;
}

export const App = (props: any) => {
  const [ratesByToken, setRatesByToken] = React.useState<RatesDictionary>(startingTickerData);
  const [chosenTokensToDisplay, setChosenTokensToDisplay] = React.useState<string[]>([]);
  const [balancesByToken, setBalancesByToken] = React.useState<{ [key: string]: ChartData; }>({});
  const [maxTokenRatesPerToken, setMaxTokenRatesPerToken] = React.useState<number>(5000);
  const [loadingCounter, setLoadingCounter] = React.useState<number>(1);
  const [marketRequestsTimeout, setMarketRequestsTimeout] = React.useState(-1 as any);

  const getRates = async () => {
    const rates = await explorerTokenMarket.getTokenRates();
    setLoadingCounter(loadingCounter+1);
    const newRatesByToken = addTokenRatesToDictionary(rates, ratesByToken, maxTokenRatesPerToken);
    setLoadingCounter(Math.max(0,loadingCounter-1));
    setRatesByToken({ ...newRatesByToken });
    updateLocalStorageFromTickerRatesDict(newRatesByToken);
  };

  const pollNow = async () => {
    clearTimeout(marketRequestsTimeout);
    await getRates();
    setMarketRequestsTimeout(setTimeout(pollNow, 10 * 60 * 1000));
  }

  React.useEffect(() => {
    initialLoad().then(() => {
      setLoadingCounter(Math.max(0,loadingCounter-1));
      pollNow();
    }, () => {
      setLoadingCounter(Math.max(0,loadingCounter-1));
      pollNow();
    });    
  }, []);

  const onStopOrplayChange = (event: any, newValue: any) => {
    if (newValue === 'stop') {
      clearTimeout(marketRequestsTimeout);
      setMarketRequestsTimeout(undefined);
    } else pollNow();
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

  return (
    <>
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <LoadingBlock loading={loadingCounter > 0} />
    <Paper>
    <Box sx={{ display: 'flex', flexDirection: 'row', m: 2, justifyContent: "space-between" }}>
      <Box sx={{ display: 'flex', alignItems: "flex-start", flexDirection: 'column' }}>
        <Typography variant="h6">Live updating new chart data every 10 minutes</Typography>
        <ToggleButtonGroup color="primary" value={ marketRequestsTimeout === undefined ? 'stop' : 'play'} exclusive onChange={onStopOrplayChange}>
          <ToggleButton key="stop" value="stop">Stop</ToggleButton>
          <ToggleButton key="play" value="play">play</ToggleButton>
        </ToggleButtonGroup>
        <ExpandableList header="Changelog" items={changeLogItems} />
        <ExpandableList header="Todo" items={todoItems} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: "flex-end", alignSelf: "flex-end", flexDirection: 'column' }}>
        <CopyToClipboard whatToCopy="9fKu1S6PF3ttzqmLq5BHQjqLYGA5TWGifVC3DcVeDtgTvW6b1nG">
          <Typography variant="caption" sx={{ verticalAlign: 'top'}}>Tips welcome at 9fKu1S6PF3ttzqmLq5BHQjqLYGA5TWGifVC3DcVeDtgTvW6b1nG</Typography>
        </CopyToClipboard>
        <Typography component={(compProps) => <img src="tip-qr.png" height="100" width="100" {...compProps} ></img>}></Typography>
      </Box>
    </Box>
    <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', m: 2 }}>
      <ToggleButtonGroup color="primary" value={ chosenTokensToDisplay } onChange={handleTokenChange}>
        {tokenRateKeysToChooseFrom.map((tokenRateKey) => {
          return <ToggleButton key={tokenRateKey} value={tokenRateKey}>{tokenRateKey}</ToggleButton>
        })}
      </ToggleButtonGroup>
    </Box>
    <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', m: 2 }}>
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