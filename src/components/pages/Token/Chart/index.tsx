import * as Highcharts from "highcharts/highstock"
import HighchartsReact from "highcharts-react-official"
import { useMemo, useRef } from "react"
import styles from "./Chart.module.scss"
import { Token } from "types/response"
import Stats from "../Stats"

interface ChartProps {
  token: Token
}

const Chart = ({ token }: ChartProps) => {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null)

  const { prices, symbol, percentChange } = token

  const color = useMemo(() => {
    if (percentChange > 0) {
      return "var(--unifi-positive)"
    } else {
      return "var(--unifi-negative)"
    }
  }, [percentChange])

  const options = {
    chart: {
      backgroundColor: "transparent",
      type: "area",
      height: 450,
      spacingBottom: 0,
      spacingLeft: 0,
      spacingRight: 0,
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
    },
    yAxis: {
      gridLineWidth: 0,
      labels: {
        enabled: false,
      },
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
      borderWidth: 0,
      backgroundColor: "var(--unifi-secondary-hover)",
      borderColor: "var(--unifi-border)",
      style: {
        color: "var(--unifi-text)",
      },
    },
    plotOptions: {
      area: {
        color,
        fillColor: {
          linearGradient: {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0.8,
          },
          stops: [
            [0, color],
            [1, "transparent"],
          ],
        },
      },
    },
    series: [
      {
        name: symbol + " price",
        type: "area",
        data: prices,
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
        constructorType={"stockChart"}
        options={options}
      />
    </div>
  )
}

export default Chart
