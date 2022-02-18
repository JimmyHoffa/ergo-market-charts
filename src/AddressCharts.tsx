import * as React from 'react';
import JSONBigInt from 'json-bigint';
import { RatesDictionary, TransactionList } from './types'
import { tokenInfosById } from './tokenDictionary';
import { ExplorerRequestManager } from "ergo-market-lib/dist/ExplorerRequestManager";
import { renderFractions } from "ergo-market-lib/dist/math";

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { styled } from '@mui/material/styles';

import { ITokenRate } from "ergo-market-lib";
import { getChart } from './MyChart';
import moment from 'moment';

import { ChartData } from './MyChart'
const explorerHttpClient = new ExplorerRequestManager();
const JSONBI = JSONBigInt({ useNativeBigInt: false });

const ExpandMore = styled((props: any) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }: any) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export const getChartDataForAddress = async (addr: string, tokenRates: RatesDictionary): Promise<{ [key: string]: ChartData }> => {
  const result = await explorerHttpClient.requestWithRetries<TransactionList>({
    url: `/api/v1/addresses/${addr}/transactions`,
    params: { limit: 100, offset: 0 },
    transformResponse: (data: any) => JSONBI.parse(data),
  });
  if (result === undefined) return {};

  const addressReceipts: any = {};
  const balancesOverTime: any = [];
  const currentBalances: any = {};
  console.log('RESSSSS', result);

  result.items.forEach((tx) => {
    currentBalances.timestamp = tx.timestamp;
    tx.outputs.forEach(outputBox => {
      if (outputBox.address !== addr) return;
      const receiptAtTime = addressReceipts[tx.timestamp] = addressReceipts[tx.timestamp] || {};
      receiptAtTime.timestamp = tx.timestamp;
      receiptAtTime.nergs = (receiptAtTime.nergs || 0) + outputBox.value;
      currentBalances.nergs = (currentBalances.nergs || 0) + outputBox.value;
      outputBox.assets.forEach(outputAsset => {
        const tokenKey = tokenInfosById[outputAsset.tokenId]?.name || outputAsset.tokenId;
        
        receiptAtTime[tokenKey] = (receiptAtTime[tokenKey] || 0) + outputAsset.amount;
        currentBalances[tokenKey] = (currentBalances[tokenKey] || 0) + outputAsset.amount;
      })
    })
    tx.inputs.forEach(inputAsset => {
      if (inputAsset.address !== addr) return;
      const receiptAtTime = addressReceipts[tx.timestamp] = addressReceipts[tx.timestamp] || {};
      receiptAtTime.nergs = (receiptAtTime.nergs || inputAsset.value) - inputAsset.value;
      currentBalances.nergs = (currentBalances.nergs || inputAsset.value) - inputAsset.value;
      inputAsset.assets.forEach(inputAsset => {
        const tokenKey = tokenInfosById[inputAsset.tokenId]?.name || inputAsset.tokenId;
        receiptAtTime[tokenKey] = (receiptAtTime[tokenKey] || inputAsset.amount) - inputAsset.amount;
        currentBalances[tokenKey] = (currentBalances[tokenKey] || inputAsset.amount) - inputAsset.amount;
      })
    })
    balancesOverTime.push(JSON.parse(JSON.stringify(currentBalances)));
  })

  const balancesOverTimeByToken = balancesOverTime.reduce((acc: { [key: string]: ChartData }, cur: any) => {
    Object.keys(cur).forEach((key) => {
      const tokenBalance = cur[key];
      acc[key] = acc[key] || [];
      acc[key].push({ value: tokenBalance, timestamp: cur.timestamp })
    })
    return acc;
  }, {});

  console.log('balancesOverTimeByToken', balancesOverTimeByToken);
  return balancesOverTimeByToken;
}

type AddressChartsProps = { tokenRateKeys: string[]; balancesByToken: { [key: string]: ChartData }; ratesByToken: RatesDictionary };
export const AddressCharts = (props: AddressChartsProps) => {
  const { tokenRateKeys, balancesByToken, ratesByToken } = props;
  const [expanded, setExpanded] = React.useState<boolean>(true);

  if (Object.keys(balancesByToken).length < 1) return (<>
    <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', width: '100%' }}>
      <Card sx={{ m: 2 }} variant="outlined">
        <Typography variant="h6" align="center">Address balances not found</Typography>
      </Card>
    </Box>
  </>);

  const balancesDictionary: any = {}
  Object.keys(ratesByToken).forEach((tokenRateKey: string) => {
    const tokenRates = ratesByToken[tokenRateKey];
    const tokenBalances = balancesByToken[tokenRateKey];
    if (tokenBalances === undefined) return;
    let currentRateIndex = 0;
    let currentBalanceIndex = 0;
    let currentBalanceValue = 0.0;

    for(; currentRateIndex < tokenRates.length; currentRateIndex++) {
      const currentRate = tokenRates[currentRateIndex];
      while(currentBalanceIndex < tokenBalances.length) {
        const nextTokenBalance = tokenBalances[currentBalanceIndex+1];
        if (nextTokenBalance === undefined) break;
        const balanceTs = moment(nextTokenBalance.timestamp);
        const rateTs = moment(currentRate.timestamp);
        
        if (balanceTs.isBefore(rateTs)) {
          currentBalanceIndex++;
        } else {
          break;
        }
      }
      currentBalanceValue = parseInt(renderFractions(tokenBalances[currentBalanceIndex].value, currentRate.token.decimals));
      balancesDictionary[tokenRateKey] = balancesDictionary[tokenRateKey] || [];
      balancesDictionary[tokenRateKey].push({timestamp: currentRate.timestamp, value: currentRate.ergPerToken * currentBalanceValue})
    }
  })

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  return (
  <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', width: '100%' }}>
    <Card sx={{ m: 2 }} variant="outlined">
      <Typography variant="h6" align="center">Wallet values of tokens over time in Σ</Typography>
      <ExpandMore
        expand={expanded}
        onClick={handleExpandClick}
        aria-expanded={expanded}
        aria-label="show more"
      >
        <ExpandMoreIcon />
      </ExpandMore>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Card sx={{ m: 2 }} variant="elevation">
          <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap'}}>
          {tokenRateKeys.map((tokenRateKey) => {
            const decimalsForThisToken = tokenInfosById[tokenRateKey];

            if (balancesDictionary[tokenRateKey] === undefined) return (<></>)
            // try {
            // } catch( ex) {
            //   console.log('THITHISITIHISHTIH', currentRate, currentRateIndex, nextTokenBalance, currentBalanceIndex)
            //   throw ex;
            // }

            return (
              <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', m: 1, width: '30%' }}>
                <Typography variant="h6" align="center">Wallet value of {tokenRateKey} in Σ</Typography>
                { getChart(tokenRateKey, balancesDictionary[tokenRateKey], `~${renderFractions(balancesDictionary[tokenRateKey].slice(-1)[0].value, decimalsForThisToken)} Σ`) }
              </Box>)
          })}
          </Box>
        </Card>
      </Collapse>
    </Card>
  </Box>);
}