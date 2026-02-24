import React from 'react'
import { addToast } from '@heroui/react'
import { MdError } from 'react-icons/md'
import { FaCircleCheck } from 'react-icons/fa6'
import { IoIosWarning } from 'react-icons/io'

type ToastType = 'success' | 'warning' | 'error'

interface IToastOptions {
	title: string
	description?: string
	duration?: number // INFO: in milliseconds
	endContent?: React.ReactNode
}

/**
 * Show a toast message using HeroUI's toast component.
 *
 * @param type - The type of toast: 'success', 'warning', 'error'
 * @param options - Toast options including title, description, and duration
 */
export const showToast = (type: ToastType, options: IToastOptions) => {
	const { title, description, duration, endContent } = options

	// INFO: Map 'error' to 'danger' for HeroUI compatibility
	const colorMap: Record<ToastType, 'success' | 'warning' | 'danger'> = {
		success: 'success',
		warning: 'warning',
		error: 'danger'
	}

	const toastIcon = (type: ToastType) => {
		switch (type) {
			case 'success':
				return FaCircleCheck
			case 'warning':
				return IoIosWarning
			case 'error':
				return MdError
			default:
				return null
		}
	}

	addToast({
		title,
		description,
		icon: toastIcon(type) && React.createElement(toastIcon(type)!),
		color: colorMap[type],
		timeout: duration,
		endContent
	})
}

/**
 * Helper functions for each toast type
 */
export const showSuccessToast = (options: IToastOptions) => {
	showToast('success', options)
}

export const showWarningToast = (options: IToastOptions) => {
	showToast('warning', options)
}

export const showErrorToast = (options: IToastOptions) => {
	showToast('error', options)
}
