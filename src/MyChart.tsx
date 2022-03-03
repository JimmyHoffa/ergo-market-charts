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
  DataZoomComponent,
  ToolboxComponent,
  LegendComponent
} from 'echarts/components';

import 'echarts/lib/chart/line';
// import 'echarts/lib/component/datazoom';
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';
// Import renderer, note that introducing the CanvasRenderer or SVGRenderer is a required step
import {
  CanvasRenderer
} from 'echarts/renderers';
import { ChartData } from './types';

// Register the required components
echarts.use(
  [TitleComponent, TooltipComponent, GridComponent, LineChart, CanvasRenderer, LegendComponent, DataZoomComponent, ToolboxComponent]
);

const getChartOptionsWithoutData = (tokenName: string, data: ChartData, axisTitle?: string) => {
  return {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross" }
    },
    legend: {
    },
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
        formatter: "{value} Σ",
      },
      smooth: true
    },
    grid: {
      containLabel: true, left: 10, right: 20, bottom: -25, top: 50,
    },
    series: {
      data: data.map(({timestamp, value}) => ({
        name: timestamp,
        value: [moment(timestamp).toDate(), value]
      })),
      type: "line",
      name: tokenName,
      showSymbol: false
    },
    dataZoom: [
      {
        type: 'inside',
        throttle: 50
      }
    ],
    toolbox: {
      left: 30,
      itemSize: 15,
      top: 15,
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {}
      }
    }
  };
}
const blank: any = {};
export const getChart = (tokenName: string, data: ChartData, axisTitle?: string, otherChartOptions: any = blank) => {
  const chartOptions = { ...getChartOptionsWithoutData(tokenName, data, axisTitle), ...otherChartOptions};
  if (otherChartOptions !== blank) console.log('CHARTOPTTTT', chartOptions);
  return (<ReactEChartsCore
    theme="dark"
    echarts={echarts}
    option={chartOptions}
  />);
}