"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DateTimePicker({
  onChange,
  existingSchedules = [],
}: {
  onChange?: (date: Date) => void
  existingSchedules?: string[]
})
 {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | null>(null)
  const [time, setTime] = React.useState("10:30:00")

  const today = React.useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

const isDateTimeTaken = React.useCallback(
  (selectedDate: Date) => {
    const selectedISO = selectedDate.toISOString()

    return existingSchedules.some((isoString) => {
      return isoString === selectedISO
    })
  },
  [existingSchedules]
)



React.useEffect(() => {
  if (!date || !time) return

  const [hours, minutes, seconds] = time.split(":")
  const combined = new Date(date)
  combined.setHours(Number(hours), Number(minutes), Number(seconds || 0))

  const selectedISO = combined.toISOString()

  if (existingSchedules.includes(selectedISO)) {
    console.log("Schedule taken")
    return
  }

  onChange?.(combined)
}, [date, time, existingSchedules])


  console.log("Existing:", existingSchedules)

  return (
    <div className="flex flex-col sm:flex-row gap-4">

      {/* Date Picker */}
      <div className="flex flex-col gap-3">
        <Label>Date</Label>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-40 justify-between font-normal"
            >
              {date ? date.toLocaleDateString() : "Select date"}
              <ChevronDownIcon className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0 bg-white">
            <Calendar
              mode="single"
              selected={date || undefined}
              disabled={{ before: today }}
              onSelect={(d) => {
                setDate(d || null)
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Time Picker */}
      <div className="flex flex-col gap-3">
        <Label>Time</Label>
        <Input
          type="time"
          step="1"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>
    </div>
  )
}
