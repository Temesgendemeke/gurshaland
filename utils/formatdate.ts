import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime'


interface FormatDate {
    (date: string | number | Date): string;
}

export const format_date: FormatDate = (date) => {
    dayjs.extend(relativeTime)
    return dayjs(date).fromNow()
}