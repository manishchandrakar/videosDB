/**
 * Download a blob as a file
 * @param blob - The blob data to download
 * @param filename - The name of the file to save
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
	// INFO: Create download URL
	const url = globalThis.URL.createObjectURL(blob)
	const link = document.createElement('a')

	link.href = url
	link.setAttribute('download', filename)

	// INFO: Trigger download
	document.body.appendChild(link)
	link.click()

	// INFO: Cleanup
	link.remove()
	globalThis.URL.revokeObjectURL(url)
}

/**
 * Process blob response and trigger download
 * @param response - The blob response from API
 * @param filename - The name of the file to save
 * @param mimeType - Optional MIME type for the blob (defaults to Excel MIME type)
 */
export const processBlobResponse = (
	response: Blob,
	filename: string,
	mimeType: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
): void => {
	// INFO: Create blob with specified MIME type
	const blob = new Blob([response], { type: mimeType })

	// INFO: Trigger download
	downloadBlob(blob, filename)
}

/**
 * Common MIME types for file downloads
 */
export const MIME_TYPES = {
	EXCEL: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	PDF: 'application/pdf',
	CSV: 'text/csv',
	JSON: 'application/json',
	ZIP: 'application/zip',
	TEXT: 'text/plain'
} as const
