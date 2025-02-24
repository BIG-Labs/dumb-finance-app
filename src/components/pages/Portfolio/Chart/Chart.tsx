import * as Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import { useRef, useState } from "react"
import styles from "./Chart.module.scss"
import { HStack, VStack } from "@big-components/ui"
import classNames from "classnames/bind"
import ProfitText from "components/common/Profit/ProfitText"
import { DepositIcon, WithdrawIcon } from "assets"

const cx = classNames.bind(styles)

const timespans = ["1H", "1D", "1W", "1M", "1Y"] as const

const timespanLabels = {
  "1H": "hour",
  "1D": "day",
  "1W": "week",
  "1M": "month",
  "1Y": "year",
}

const Chart = () => {
  const [activeTimespan, setActiveTimespan] =
    useState<(typeof timespans)[number]>("1M")

  const chartComponentRef = useRef<HighchartsReact.RefObject>(null)

  const options = {
    chart: {
      type: "areaspline",
      backgroundColor: "transparent",
      height: 240,
      spacingBottom: 0,
      spacingLeft: 0,
      spacingRight: 0,
      spacingTop: -48,
    },
    title: {
      text: "",
    },
    xAxis: {
      crosshair: {
        width: 1,
        color: "var(--unifi-supporting)",
        dashStyle: "Dot",
        zIndex: 0,
      },
      labels: {
        enabled: false,
      },
      minPadding: 0,
      maxPadding: 0,
      lineWidth: 0,
      floor: 0,
      tickLength: 0,
    },
    yAxis: {
      title: {
        text: undefined,
      },
      labels: {
        enabled: false,
      },
      gridLineWidth: 0,
      crosshair: {
        width: 1,
        color: "var(--unifi-supporting)",
        dashStyle: "Dot",
        zIndex: 0,
      },
      floor: 0,
      max: 601,
      min: 0,
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      series: {
        marker: {
          enabled: false,
        },
      },
      areaspline: {
        lineWidth: 1,
        fillOpacity: 0.035,
      },
    },
    series: [
      {
        name: "Tokyo",
        data: Array.from({ length: 50 }, () => {
          const number = [580, 600, 520]

          return number[Math.floor(Math.random() * number.length)]
        }),
        color: "var(--unifi-positive)",
        type: "areaspline",
      },
    ],
    credits: {
      enabled: false,
    },
  } as Highcharts.Options

  return (
    <div className={styles.chart}>
      <VStack fullWidth alignItems="center">
        <HStack
          fullWidth
          justifyContent="flex-end"
          gap={8}
          className={styles.buttons}
        >
          <button>
            <DepositIcon
              width={16}
              height={16}
              stroke="var(--unifi-text)"
              strokeWidth={2}
            />
            <p>Deposit</p>
          </button>
          <button>
            <WithdrawIcon
              width={16}
              height={16}
              stroke="var(--unifi-text)"
              strokeWidth={2}
            />
            <p>Withdraw</p>
          </button>
        </HStack>
        <VStack alignItems="center" gap={4}>
          <small className={styles.title}>Portfolio</small>
          <h1 className={styles.balance}>$37,394.90</h1>
          <HStack alignItems="center" gap={4}>
            <ProfitText percentage={0.5} size={12} />
            <small>past {timespanLabels[activeTimespan]}</small>
          </HStack>
        </VStack>
      </VStack>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartComponentRef}
      />
      <HStack alignItems="center" className={styles.timespan}>
        {timespans.map((timespan) => (
          <div
            key={timespan}
            className={cx("item", { active: timespan === activeTimespan })}
            onClick={() => setActiveTimespan(timespan)}
          >
            <button>{timespan}</button>
          </div>
        ))}
      </HStack>
    </div>
  )
}

export default Chart
