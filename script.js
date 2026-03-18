const form = document.getElementById('search-form');
const input = document.getElementById('location-input');
const loading = document.getElementById('loading');
const errorMsg = document.getElementById('error-message');
const weatherCard = document.getElementById('weather-card');

const cityName = document.getElementById('city-name');
const countryName = document.getElementById('country-name');
const tempValue = document.getElementById('temp-value');
const weatherIcon = document.getElementById('weather-icon');
const weatherDesc = document.getElementById('weather-desc');
const windSpeed = document.getElementById('wind-speed');
const humidity = document.getElementById('humidity');

const locationsData = {
    "Japan": ["Tokyo", "Osaka", "Kyoto", "Yokohama", "Sapporo"],
    "United States": ["New York", "Los Angeles", "Chicago", "Houston", "Miami"],
    "United Kingdom": ["London", "Edinburgh", "Manchester", "Birmingham", "Glasgow"],
    "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
    "France": ["Paris", "Lyon", "Marseille", "Toulouse", "Nice"],
    "Finland": ["Helsinki", "Tampere", "Turku", "Oulu", "Rovaniemi"],
    "United Arab Emirates": ["Dubai", "Abu Dhabi", "Sharjah", "Al Ain"],
    "Iceland": ["Reykjavik", "Akureyri", "Keflavik", "Vik"],
    "Brazil": ["Rio de Janeiro", "São Paulo", "Salvador", "Brasília", "Fortaleza"],
    "India": ["Mumbai", "New Delhi", "Bangalore", "Kolkata", "Chennai"]
};

const countryDropdown = document.getElementById('country-dropdown');
const citiesGroup = document.getElementById('cities-group');
const cityDropdown = document.getElementById('city-dropdown');
const selectedCountryName = document.getElementById('selected-country-name');

// Populate dropdown
Object.keys(locationsData).forEach(country => {
    const option = document.createElement('option');
    option.value = country;
    option.textContent = country;
    countryDropdown.appendChild(option);
});

countryDropdown.addEventListener('change', (e) => {
    const country = e.target.value;
    const cities = locationsData[country];
    
    selectedCountryName.textContent = country;
    cityDropdown.innerHTML = '<option value="" disabled selected>Choose a city...</option>';
    
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        cityDropdown.appendChild(option);
    });
    
    citiesGroup.style.display = 'block';
});

cityDropdown.addEventListener('change', (e) => {
    const city = e.target.value;
    const country = countryDropdown.value;
    if (city && country) {
        input.value = `${city}, ${country}`;
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;

    // Reset UI
    weatherCard.classList.remove('hidden');
    weatherCard.style.animation = 'none'; // reset animation
    weatherCard.offsetHeight; // trigger reflow
    weatherCard.style.animation = null; 
    weatherCard.classList.add('hidden');
    
    errorMsg.classList.add('hidden');
    loading.classList.remove('hidden');

    try {
        // 1. Geocoding API to get coordinates
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`);
        
        if (!geoResponse.ok) {
            throw new Error('Failed to fetch location data');
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error('Location not found. Please try again.');
        }

        const location = geoData.results[0];
        const { latitude, longitude, name, country } = location;

        // 2. Weather Forecast API to get current weather
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`);
        
        if (!weatherResponse.ok) {
            throw new Error('Failed to fetch weather data');
        }

        const weatherData = await weatherResponse.json();
        const current = weatherData.current;

        // Update UI
        updateUI(name, country, current);

    } catch (err) {
        errorMsg.textContent = err.message;
        errorMsg.classList.remove('hidden');
    } finally {
        loading.classList.add('hidden');
    }
});

function updateUI(name, country, currentData) {
    cityName.textContent = name;
    countryName.textContent = country || '';
    tempValue.textContent = Math.round(currentData.temperature_2m);
    windSpeed.textContent = `${currentData.wind_speed_10m} km/h`;
    humidity.textContent = `${currentData.relative_humidity_2m} %`;

    const weatherInfo = getWeatherInfo(currentData.weather_code);
    weatherIcon.textContent = weatherInfo.icon;
    weatherDesc.textContent = weatherInfo.description;

    weatherCard.classList.remove('hidden');
}

function getWeatherInfo(code) {
    // WMO Weather interpretation codes (https://open-meteo.com/en/docs)
    switch (true) {
        case code === 0:
            return { icon: '☀️', description: 'Clear sky' };
        case [1, 2, 3].includes(code):
            return { icon: '⛅', description: 'Partly cloudy' };
        case [45, 48].includes(code):
            return { icon: '🌫️', description: 'Fog' };
        case [51, 53, 55, 56, 57].includes(code):
            return { icon: '🌧️', description: 'Drizzle' };
        case [61, 63, 65, 66, 67].includes(code):
            return { icon: '🌦️', description: 'Rain' };
        case [71, 73, 75, 77, 85, 86].includes(code):
            return { icon: '❄️', description: 'Snow' };
        case [80, 81, 82].includes(code):
            return { icon: '🌧️', description: 'Rain showers' };
        case [95, 96, 99].includes(code):
            return { icon: '⛈️', description: 'Thunderstorm' };
        default:
            return { icon: '🌡️', description: 'Unknown' };
    }
}
