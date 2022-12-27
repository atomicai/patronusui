import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
  subDays
} from 'date-fns'

type RangeType = {
  label: string
  value: [Date, Date]
  placement: string
}

export const Ranges: any = [
  {
    label: 'Today',
    value: [new Date(), new Date()],
    placement: 'left'
  },
  {
    label: 'Yesterday',
    value: [addDays(new Date(), -1), addDays(new Date(), -1)],
    placement: 'left'
  },
  {
    label: 'This week',
    value: [startOfWeek(new Date()), endOfWeek(new Date())],
    placement: 'left'
  },
  {
    label: 'Last 7 days',
    value: [subDays(new Date(), 6), new Date()],
    placement: 'left'
  },
  {
    label: 'Last 30 days',
    value: [subDays(new Date(), 29), new Date()],
    placement: 'left'
  },
  {
    label: 'This month',
    value: [startOfMonth(new Date()), new Date()],
    placement: 'left'
  },
  {
    label: 'Last month',
    value: [
      startOfMonth(addMonths(new Date(), -1)),
      endOfMonth(addMonths(new Date(), -1))
    ],
    placement: 'left'
  },
  {
    label: 'This year',
    value: [new Date(new Date().getFullYear(), 0, 1), new Date()],
    placement: 'left'
  },
  {
    label: 'Last year',
    value: [
      new Date(new Date().getFullYear() - 1, 0, 1),
      new Date(new Date().getFullYear(), 0, 0)
    ],
    placement: 'left'
  },
  {
    label: 'All time',
    value: [new Date(new Date().getFullYear() - 1, 0, 1), new Date()],
    placement: 'left'
  },
  {
    label: 'Last week',
    closeOverlay: false,
    value: (value: any) => {
      const [start = new Date()] = value || []
      return [
        addDays(startOfWeek(start, { weekStartsOn: 0 }), -7),
        addDays(endOfWeek(start, { weekStartsOn: 0 }), -7)
      ]
    },
    appearance: 'default'
  },
  {
    label: 'Next week',
    closeOverlay: false,
    value: (value: any) => {
      const [start = new Date()] = value || []
      return [
        addDays(startOfWeek(start, { weekStartsOn: 0 }), 7),
        addDays(endOfWeek(start, { weekStartsOn: 0 }), 7)
      ]
    },
    appearance: 'default'
  }
]
