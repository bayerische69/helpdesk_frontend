"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import axios from "../config/axios"
import { useEffect } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const description = "An interactive area chart"

type ChartItem = {
  date: string
  PSD: number
  ADMIN: number
  SUPPLY: number
  RECORDS: number
  ARCHIVES: number
}

const chartConfig = {
  PSD: {
    label: "PSD",
    color: "#6366f1", // Indigo
  },
  ADMIN: {
    label: "ADMIN",
    color: "#22c55e", // Green
  },
  SUPPLY: {
    label: "SUPPLY",
    color: "#f59e0b", // Amber
  },
  RECORDS: {
    label: "RECORDS",
    color: "#ef4444", // Red
  },
  ARCHIVES: {
    label: "ARCHIVES",
    color: "#06b6d4", // Cyan
  },
};


export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("90d")


const [chartData, setChartData] = React.useState<ChartItem[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {

        const response = await axios.get('/tickets/chart/status')
        setChartData(response.data)
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      }
    }

    fetchData()
  }, [])


const monthlyData = React.useMemo(() => {
  if (!chartData.length) return []

  return Object.values(
    chartData.reduce(
      (
        acc: Record<string, {
          month: string
          PSD: number
          ADMIN: number
          SUPPLY: number
          RECORDS: number
          ARCHIVES: number
        }>,
        item
      ) => {
        const monthKey = item.date.slice(0, 7) // YYYY-MM

        if (!acc[monthKey]) {
          acc[monthKey] = {
            month: monthKey,
            PSD: 0,
            ADMIN: 0,
            SUPPLY: 0,
            RECORDS: 0,
            ARCHIVES: 0,
          }
        }

        acc[monthKey].PSD += item.PSD
        acc[monthKey].ADMIN += item.ADMIN
        acc[monthKey].SUPPLY += item.SUPPLY
        acc[monthKey].RECORDS += item.RECORDS
        acc[monthKey].ARCHIVES += item.ARCHIVES

        return acc
      },
      {}
    )
  ).sort((a, b) => a.month.localeCompare(b.month))
}, [chartData])


  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Analytics for Internal Helpdesks</CardTitle>
          <CardDescription>
            Showing total tickets for every division
          </CardDescription>
        </div>
      </CardHeader>

 
    <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[250px] w-full"
        style={{
          "--color-psd": chartConfig.PSD.color,
          "--color-admin": chartConfig.ADMIN.color,
          "--color-supply": chartConfig.SUPPLY.color,
          "--color-records": chartConfig.RECORDS.color,
          "--color-archives": chartConfig.ARCHIVES.color,
        } as React.CSSProperties}
      >
        <AreaChart data={monthlyData}>
          <CartesianGrid vertical={false} />

          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) =>
              new Date(value + "-01").toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })
            }
          />

          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(value) =>
                  new Date(value + "-01").toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })
                }
                indicator="dot"
              />
            }
          />

          <Area
            dataKey="PSD"
            type="natural"
            stackId="a"
            fill="var(--color-psd)"
            stroke="var(--color-psd)"
          />

          <Area
            dataKey="ADMIN"
            type="natural"
            stackId="a"
            fill="var(--color-admin)"
            stroke="var(--color-admin)"
          />

          <Area
            dataKey="SUPPLY"
            type="natural"
            stackId="a"
            fill="var(--color-supply)"
            stroke="var(--color-supply)"
          />

          <Area
            dataKey="RECORDS"
            type="natural"
            stackId="a"
            fill="var(--color-records)"
            stroke="var(--color-records)"
          />

          <Area
            dataKey="ARCHIVES"
            type="natural"
            stackId="a"
            fill="var(--color-archives)"
            stroke="var(--color-archives)"
          />

          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>
    </CardContent>

    </Card>
  )
}
