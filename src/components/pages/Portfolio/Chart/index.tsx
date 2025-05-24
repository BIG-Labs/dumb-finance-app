import * as Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import { useRef, useState } from "react"
import styles from "./Chart.module.scss"
import { HStack, VStack } from "@big-components/ui"
import classNames from "classnames/bind"
import { DepositIcon, WithdrawIcon } from "assets"
import Button from "components/common/Button"
import ProfitText from "components/common/Profit/ProfitText"
import { toUSD } from "components/utils/math"

const cx = classNames.bind(styles)

const timespans = ["1H", "1D", "1W", "1M", "1Y"] as const

const Chart = () => {
  const [activeTimespan, setActiveTimespan] =
    useState<(typeof timespans)[number]>("1M")

  const chartComponentRef = useRef<HighchartsReact.RefObject>(null)

  const options = {
    chart: {
      type: "areaspline",
      backgroundColor: "transparent",
      height: 250,
      spacingBottom: 0,
      spacingLeft: 0,
      spacingRight: 0,
      spacingTop: 0,
    },
    title: {
      text: "",
    },
    xAxis: {
      crosshair: {
        width: 1,
        color: "var(--unifi-supporting)",
        dashStyle: "Dash",
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
        name: "Balance",
        data: [
          [1746835200000, 1034.25], // 2025-05-10
          [1746921600000, 1042.87], // 2025-05-11
          [1747008000000, 1029.33], // 2025-05-12
          [1747094400000, 1050.12], // 2025-05-13
          [1747180800000, 1078.55], // 2025-05-14
          [1747267200000, 1067.2], // 2025-05-15
          [1747353600000, 1081.47], // 2025-05-16
          [1747440000000, 1094.03], // 2025-05-17
          [1747526400000, 1102.6], // 2025-05-18
          [1747612800000, 1089.9], // 2025-05-19
          [1747699200000, 1115.45], // 2025-05-20
          [1747785600000, 1130.77], // 2025-05-21
          [1747872000000, 1125.88], // 2025-05-22
          [1747958400000, 1142.34], // 2025-05-23
        ],
        color: "var(--unifi-primary)",
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
          <Button animation>
            <DepositIcon
              width={16}
              height={16}
              stroke="currentColor"
              strokeWidth={2}
            />
            <p>Deposit</p>
          </Button>
          <Button animation>
            <WithdrawIcon
              width={16}
              height={16}
              stroke="currentColor"
              strokeWidth={2}
            />
            <p>Withdraw</p>
          </Button>
        </HStack>
        <VStack alignItems="center">
          <small className={styles.title}>Portfolio</small>
          <h1 className={styles.balance}>{toUSD(Math.random() * 1000)}</h1>
          <ProfitText percentage={Math.random() * 10} size={14} />
        </VStack>
      </VStack>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartComponentRef}
      />
      <div className={styles.timespan}>
        {timespans.map((timespan) => (
          <button
            key={timespan}
            className={cx("item", { active: timespan === activeTimespan })}
            onClick={() => setActiveTimespan(timespan)}
          >
            {timespan}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Chart
