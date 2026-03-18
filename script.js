const form = document.getElementById('search-form');
const input = document.getElementById('location-input');
const loading = document.getElementById('loading');
const errorMsg = document.getElementById('error-message');
const weatherCard = document.getElementById('weather-card');
const weatherBg = document.getElementById('weather-backgrounds');

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

    setWeatherBackground(currentData.weather_code);
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

function setWeatherBackground(code) {
    weatherBg.innerHTML = '';
    document.body.className = '';
    
    let type = 'clear';
    switch (true) {
        case code === 0:
            type = 'clear';
            break;
        case [1, 2, 3, 45, 48].includes(code):
            type = 'clouds';
            break;
        case [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code):
            type = 'rain';
            break;
        case [71, 73, 75, 77, 85, 86].includes(code):
            type = 'snow';
            break;
        case [95, 96, 99].includes(code):
            type = 'storm';
            break;
    }

    document.body.classList.add(`weather-${type}`);
    
    if (type === 'rain') {
        for(let i=0; i<60; i++) {
            const drop = document.createElement('div');
            drop.className = 'raindrop';
            drop.style.left = `${Math.random() * 100}vw`;
            drop.style.animationDuration = `${Math.random() * 0.5 + 0.5}s`;
            drop.style.animationDelay = `${Math.random() * 2}s`;
            weatherBg.appendChild(drop);
        }
    } else if (type === 'snow') {
        for(let i=0; i<40; i++) {
            const flake = document.createElement('div');
            flake.className = 'snowflake';
            flake.style.left = `${Math.random() * 100}vw`;
            flake.style.width = `${Math.random() * 6 + 4}px`;
            flake.style.height = flake.style.width;
            flake.style.opacity = Math.random() * 0.5 + 0.3;
            flake.style.animationDuration = `${Math.random() * 3 + 4}s`;
            flake.style.animationDelay = `${Math.random() * 2}s`;
            weatherBg.appendChild(flake);
        }
    } else if (type === 'clouds') {
        for(let i=0; i<6; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'cloud';
            cloud.style.top = `${Math.random() * 40}vh`;
            cloud.style.width = `${Math.random() * 100 + 100}px`;
            cloud.style.height = `${Math.random() * 40 + 40}px`;
            cloud.style.animationDuration = `${Math.random() * 20 + 30}s`;
            cloud.style.animationDelay = `${Math.random() * -30}s`;
            weatherBg.appendChild(cloud);
        }
    } else if (type === 'storm') {
        for(let i=0; i<80; i++) {
            const drop = document.createElement('div');
            drop.className = 'raindrop';
            drop.style.left = `${Math.random() * 100}vw`;
            drop.style.animationDuration = `${Math.random() * 0.4 + 0.4}s`;
            drop.style.animationDelay = `${Math.random() * 2}s`;
            weatherBg.appendChild(drop);
        }
    }
}
