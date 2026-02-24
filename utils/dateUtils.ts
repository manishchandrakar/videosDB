import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import isYesterday from 'dayjs/plugin/isYesterday'
import isTomorrow from 'dayjs/plugin/isTomorrow'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'

import { decodeToken } from './tokenUtils'

dayjs.extend(isToday)
dayjs.extend(isYesterday)
dayjs.extend(isTomorrow)
dayjs.extend(relativeTime)
dayjs.extend(duration)

export const formatDateTime = (date: string | undefined) => {
	if (!date) return

	return dayjs(date).format('DD/MM/YYYY h:mm A')
}

export const formatDateWithMonth = (date: string | undefined) => {
	if (!date) return

	return dayjs(date).format('DD-MMM-YYYY hh:mm A')
}
//INFO: console.log(formatDateWithMonth('2025-11-12T09:21:54.885Z'))

export const formatDate = (date: string | undefined) => {
	if (!date) return

	return dayjs(date).format('DD/MM/YYYY')
}

/**
 * Formats date with relative labels
 * Returns "Today", "Yesterday", "Tomorrow" for relative dates
 * Otherwise returns formatted date (DD/MM/YYYY)
 */
export const formatRelativeDate = (date: string | undefined) => {
	if (!date) return '-'

	const dateObj = dayjs(date)

	if (!dateObj.isValid()) return 'NA'

	if (dateObj.isToday()) return 'Today'
	if (dateObj.isYesterday()) return 'Yesterday'
	if (dateObj.isTomorrow()) return 'Tomorrow'

	return dateObj.format('DD/MM/YYYY')
}

export const formatDay = (date: string | undefined) => {
	if (!date) return

	return dayjs(date).format('DD-ddd')
}

export const formatDateToDash = (date: string | undefined) => {
	if (!date) return

	return dayjs(date).format('YYYY-MM-DD')
}

export const getDateFromToday = (daysFromToday: number): string => {
	const date = new Date()

	date.setDate(date.getDate() + daysFromToday)

	return date.toISOString().split('T')[0]
}

export function getTimeAgo(date: string | undefined): string {
	if (!date) return 'No end date provided'

	const targetDate = dayjs(date, 'DD-MM-YYYY hh:mm A')

	if (!targetDate.isValid()) return 'Invalid date format'

	const now = dayjs()
	const diffInMinutes = now.diff(targetDate, 'minute')
	const diffInHours = now.diff(targetDate, 'hour')
	const diffInDays = now.diff(targetDate, 'day')

	if (diffInMinutes < 1) return 'Just now'
	if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
	if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
	if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`

	return targetDate.format('DD/MM/YYYY')
}

/**
 * Token expiration checker
 *
 * Checks if JWT token is expired by decoding the payload
 */
export const isTokenExpired = (token: string): boolean => {
	if (!token) return true
	try {
		const payload = decodeToken(token)

		if (!payload.exp) return true
		const currentTime = Math.floor(Date.now() / 1000)

		// INFO: Add 30 seconds buffer before expiry
		return payload.exp - 30 < currentTime
	} catch (error) {
		console.error('Error checking token expiry:', error)

		return true
	}
}

export const today = new Date().toLocaleDateString('en-US', {
	year: 'numeric',
	month: 'long',
	day: 'numeric'
})
export const convertMinutes = (min: number | string): string => {
	const total = Number(min)

	if (isNaN(total) || total < 0) return 'Invalid input'

	const days = Math.floor(total / 1440)
	const remainingAfterDays = total % 1440

	const hours = Math.floor(remainingAfterDays / 60)
	const minutes = remainingAfterDays % 60

	if (days === 0 && hours === 0) {
		return `${minutes} min`
	}

	if (days === 0) {
		return `${hours} hrs ${minutes} min`
	}

	return `${days} day${days > 1 ? 's' : ''} ${hours} hrs ${minutes} min`
}

/*
convertMinutes(0);      // "0 min"
convertMinutes(5);      // "5 min"
convertMinutes(80);     // "1 hrs 20 min"
convertMinutes(1500);   // "1 day 1 hrs 0 min"
convertMinutes(2880);   // "2 days 0 hrs 0 min"
*/
