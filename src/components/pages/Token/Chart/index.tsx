import * as Highcharts from "highcharts/highstock"
import HighchartsReact from "highcharts-react-official"
import { useRef } from "react"
import styles from "./Chart.module.scss"
import { Token } from "types/response"
import Stats from "../Stats"

interface ChartProps {
  token: Token
}

const Chart = ({ token }: ChartProps) => {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null)

  const { symbol } = token

  const options = {
    chart: {
      backgroundColor: "transparent",
      type: "candlestick",
    },
    title: {
      text: "",
    },
    xAxis: {
      tickLength: 0,
      lineWidth: 0,
      labels: {
        style: {
          color: "var(--unifi-supporting)",
          fontSize: "12px",
        },
      },
      crosshair: {
        color: "rgba(255, 255, 255, 0.1)",
      },
    },
    yAxis: {
      gridLineColor: "rgba(255, 255, 255, 0.05)",
      labels: {
        enabled: true,
        style: {
          color: "var(--unifi-supporting)",
          fontSize: "12px",
        },
      },
      opposite: true,
    },
    scrollbar: {
      enabled: false,
    },
    navigator: {
      enabled: false,
    },
    rangeSelector: {
      enabled: false,
    },
    tooltip: {
      shape: "rect",
      shadow: false,
      borderWidth: 1,
      backgroundColor: "var(--unifi-secondary-hover)",
      borderColor: "var(--unifi-border)",
      style: {
        color: "var(--unifi-text)",
        fontSize: "12px",
      },
      split: false,
      shared: true,
    },
    plotOptions: {
      candlestick: {
        lineColor: "#e45858",
        color: "#e45858", // down candle
        upColor: "#3bc67c", // up candle
        upLineColor: "#3bc67c",
      },
      series: {
        dataGrouping: {
          units: [["day", [1]]],
        },
      },
    },
    series: [
      {
        name: symbol + " price",
        type: "candlestick",
        data: [],
        tooltip: {
          valueDecimals: 2,
        },
      },
    ],
    credits: {
      enabled: false,
    },
  } as Highcharts.Options

  return (
    <div className={styles.chart}>
      <Stats token={token} />
      <HighchartsReact
        ref={chartComponentRef}
        highcharts={Highcharts}
        constructorType="stockChart"
        options={options}
      />
    </div>
  )
}

export default Chart
