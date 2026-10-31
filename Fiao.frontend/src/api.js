const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'https://localhost:7030').replace(/\/$/, '')
const clientsUrl = `${baseUrl}/api/Clients`

async function request(url, options = {}) {

  let response
  try {
    response = await fetch(url,
      {
        ...options,
        headers: {
          ...(options.body ? { 'Content-Type': 'application/json' } : {}),
          ...options.headers
        }
      })
  }
  catch {
    throw new Error('No se pudo conectar con el servicio. Verifica que esté disponible e inténtalo de nuevo.')
  }

  if (!response.ok) {
    let message = `La API respondió ${response.status} ${response.statusText}.`
    try {
      const data = await response.json();
      message = data.message || data.mensaje || data.title || message;
      if (data.errors) message += ` ${Object.values(data.errors).flat().join(' ')}`
    } catch {

    }
    throw new Error(message)
  }

  if (response.status === 204) return null
  return response.json()
}

export const clientsApi = {
  list: () => request(clientsUrl),
  get: (id) => request(`${clientsUrl}/${id}`),
  create: (client) => request(clientsUrl,
    {
      method: 'POST', body: JSON.stringify(client)
    }),
  update: (id, client) => request(`${clientsUrl}/${id}`,
    {
      method: 'PUT', body: JSON.stringify(client)
    }),
  remove: (id) => request(`${clientsUrl}/${id}`,
    {
      method: 'DELETE'
    }),
}

export const apiBaseUrl = baseUrl
