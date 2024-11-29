// src/services/LocationLogger.js

const logPosition = async () => {
  if (!navigator.geolocation) {
    console.error('Geolocation is not supported by this browser.')
    return
  }

  navigator.geolocation.getCurrentPosition(async position => {
    const latitudeAsString = `${position.coords.latitude}`
    const longitudeAsString = `${position.coords.longitude}`
    // const { latitude, longitude } = position.coords
    console.log(`Logging position: ${latitudeAsString}, ${longitudeAsString}`) // Demonstrationsformål

    const apiUrl = `${process.env.API}/Kartreferanser/Create` // Tilpasset ditt miljø
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // Legg til eventuelle nødvendige autentiseringsheadere
        },
        body: JSON.stringify({
          brukernavn: localStorage.getItem('userEmail'), // Antatt at du har satt dette tidligere
          dato: new Date().toISOString(),
          tid: new Date().toLocaleTimeString(),
          latitude: latitudeAsString || 'Mangler data',
          longitude: longitudeAsString || 'Mangler data'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to log location to API')
      }

      const responseData = await response.json()
      console.log('Location logged:', responseData)
    } catch (error) {
      console.error('Error logging location:', error)
    }
  }, error => {
    console.error('Error getting the location:', error)
  }, {
    enableHighAccuracy: true
  })
}

export { logPosition }
