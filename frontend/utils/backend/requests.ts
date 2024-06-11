export async function request(url: string, params: Record<string, any> = {}) {
    // Remove the leading slash if it exists
    if (url.startsWith('/')) {
        url = url.substring(1)
    }

    // Convert params object to query string
    const queryString = new URLSearchParams(params).toString()
    const fullUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${url}${queryString ? '?' + queryString : ''}`

    try {
        const response = await fetch(fullUrl)

        if (!response.ok) {
            const error = await response.json()
            return { data: null, error }
        }

        const data = await response.json()
        return { data, error: null }
    } catch (err) {
        if (err instanceof Error) {
            return { data: null, error: err.message }
        } else {
            return { data: null, error: 'An unknown error occurred.' }
        }
    }
}
