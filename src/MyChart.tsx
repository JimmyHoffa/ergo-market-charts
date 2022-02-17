import * as React from 'react';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import {
  LineChart
} from 'echarts/charts';
import {
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components';

import 'echarts/lib/chart/line';
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';
// Import renderer, note that introducing the CanvasRenderer or SVGRenderer is a required step
import {
  CanvasRenderer
} from 'echarts/renderers';

// Register the required components
echarts.use(
  [TitleComponent, TooltipComponent, GridComponent, LineChart, CanvasRenderer, LegendComponent]
);
export type ChartData = { value: number; timestamp: string }[];
const getChartOptionsWithoutData = (tokenName: string, data: ChartData, axisTitle?: string) => {
  return {
    theme: 'dark',
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross" }
    },
    legend: {},
    xAxis: {
      type: "time",
      data: data.map(({ timestamp }) => moment(timestamp).toDate()),
      axisTick: {
        alignWithLabel: true
      },
      axisLabel: {
        rotate: 30
      }
    },
    yAxis: {
      type: "value",
      name: axisTitle || data.slice(-1)[0].value,
      position: "right",
      axisLabel: {
        formatter: "{value} ERG"
      },
      smooth: true
    },
    series: {
      data: data.map(({timestamp, value}) => ({
        name: timestamp,
        value: [moment(timestamp).toDate(), value]
      })),
      type: "line",
      name: tokenName,
      showSymbol: false
    }
  };
}

export const getChart = (tokenName: string, data: ChartData, axisTitle?: string) => {
  const chartOptions = getChartOptionsWithoutData(tokenName, data, axisTitle);
  return (<ReactEChartsCore
    echarts={echarts}
    option={chartOptions}
  />);
}