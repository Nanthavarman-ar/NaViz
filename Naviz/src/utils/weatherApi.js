const API_KEY = 'bd5e378503939ddaee76f12ad7a97608'; // Updated with user provided API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
export async function fetchWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(`${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        if (!response.ok) {
            console.error('Failed to fetch weather data:', response.statusText);
            return null;
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}
export async function fetchWeatherByCity(city) {
    try {
        const response = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        if (!response.ok) {
            console.error('Failed to fetch weather data:', response.statusText);
            return null;
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}
