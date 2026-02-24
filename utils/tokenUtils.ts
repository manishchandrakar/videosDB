import { IAuthTokens } from '@/types/common'

export const getStoredRefreshToken = (): string | null => {
	try {
		return localStorage.getItem('refreshToken')
	} catch (error) {
		console.error('Error getting refresh token from localStorage:', error)

		return null
	}
}

export const getStoredAccessToken = (): string | null => {
	try {
		return localStorage.getItem('accessToken')
	} catch (error) {
		console.error('Error getting access token from localStorage:', error)

		return null
	}
}

export const clearStoredTokens = () => {
	try {
		localStorage.removeItem('accessToken')
		localStorage.removeItem('refreshToken')
	} catch (error) {
		console.error('Error clearing stored tokens:', error)
	}
}

export const storeAccessToken = (accessToken: string) => {
	try {
		localStorage.setItem('accessToken', accessToken)
	} catch (error) {
		console.error('Error storing access token:', error)
	}
}

export const storeTokens = (tokenInfo: IAuthTokens) => {
	try {
		localStorage.setItem('accessToken', tokenInfo.accessToken)
		localStorage.setItem('refreshToken', tokenInfo.refreshToken)
	} catch (error) {
		console.error('Error storing tokens:', error)
	}
}

export const decodeToken = (token: string) => {
	try {
		return JSON.parse(atob(token.split('.')[1]))
	} catch (error) {
		console.error('Error decoding token:', error)

		return null
	}
}
