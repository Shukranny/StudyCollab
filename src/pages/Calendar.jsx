"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Button from "../components/ui/Button"

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState("month")

  // Get month name and year
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const monthName = monthNames[currentDate.getMonth()]
  const year = currentDate.getFullYear()

  // Navigation functions
  const goToPrevMonth = () => {
    const prevMonth = new Date(currentDate)
    prevMonth.setMonth(prevMonth.getMonth() - 1)
    setCurrentDate(prevMonth)
  }

  const goToNextMonth = () => {
    const nextMonth = new Date(currentDate)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    setCurrentDate(nextMonth)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Generate days for the month view
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // First day of the month
    const firstDayOfMonth = new Date(year, month, 1)
    const dayOfWeek = firstDayOfMonth.getDay()

    // Number of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    // Previous month's days to display
    const daysFromPrevMonth = dayOfWeek
    const prevMonthDays = []
    const prevMonth = new Date(year, month, 0)
    const prevMonthNumberOfDays = prevMonth.getDate()

    for (let i = prevMonthNumberOfDays - daysFromPrevMonth + 1; i <= prevMonthNumberOfDays; i++) {
      prevMonthDays.push({
        day: i,
        currentMonth: false,
        date: new Date(year, month - 1, i),
      })
    }

    // Current month's days
    const currentMonthDays = []
    for (let i = 1; i <= daysInMonth; i++) {
      currentMonthDays.push({
        day: i,
        currentMonth: true,
        date: new Date(year, month, i),
      })
    }

    // Next month's days to display
    const totalDaysDisplayed = Math.ceil((daysFromPrevMonth + daysInMonth) / 7) * 7
    const nextMonthDays = []
    const nextMonth = new Date(year, month + 1, 1)
    const nextMonthNumberOfDays = new Date(year, month + 2, 0).getDate()

    for (let i = 1; i <= totalDaysDisplayed - (daysFromPrevMonth + daysInMonth); i++) {
      nextMonthDays.push({
        day: i,
        currentMonth: false,
        date: new Date(year, month + 1, i),
      })
    }

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays]
  }

  const handleViewChange = (newView) => {
    setView(newView)
  }

  const calendarDays = generateCalendarDays()

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Button variant="ghost" onClick={goToPrevMonth}>
            <ArrowLeft />
          </Button>
          <Button variant="ghost" onClick={goToNextMonth}>
            <ArrowRight />
          </Button>
          <h2 className="text-lg font-semibold ml-2">
            {monthName} {year}
          </h2>
        </div>
        <Button onClick={goToToday}>Today</Button>
      </div>

      {/* View switcher */}
      <div className="flex mb-4">
        <Button
          variant={view === "month" ? "solid" : "ghost"}
          onClick={() => handleViewChange("month")}
          className="flex-1"
        >
          Month
        </Button>
        <Button
          variant={view === "week" ? "solid" : "ghost"}
          onClick={() => handleViewChange("week")}
          className="flex-1"
        >
          Week
        </Button>
        <Button variant={view === "day" ? "solid" : "ghost"} onClick={() => handleViewChange("day")} className="flex-1">
          Day
        </Button>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-4 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="font-semibold">
            {day}
          </div>
        ))}
        {calendarDays.map(({ day, currentMonth, date }, index) => (
          <div key={index} className={`p-2 rounded-lg ${currentMonth ? "bg-white" : "bg-gray-100"}`}>
            {day}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Calendar
