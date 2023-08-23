// Replace 'YOUR_API_KEY' with your actual API key from AviationStack
const apiKey = '1657c83be8cbfaaa74a58aa6ac8bd419';
const metarContainer = document.getElementById('metar-info');

const airportInput = document.getElementById('airport-input');
const searchButton = document.getElementById('search-button');

searchButton.addEventListener('click', fetchMetar);

async function fetchMetar() {
    const enteredAirportCode = airportInput.value.toUpperCase(); // Convert input to uppercase

    try {
        const response = await fetch(`http://api.aviationstack.com/v1/metar?access_key=${apiKey}&airport=${enteredAirportCode}`);
        const data = await response.json();

        if (data.data && data.data.length > 0) {
            const metar = data.data[0].raw_text;
            metarContainer.textContent = `METAR: ${metar}`;
        } else {
            metarContainer.textContent = 'METAR data not available.';
        }
    } catch (error) {
        metarContainer.textContent = 'An error occurred while fetching METAR data.';
        console.error(error);
    }
}