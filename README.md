<img width="862" height="717" alt="Screenshot 2026-03-18 113503" src="https://github.com/user-attachments/assets/f8c9ed91-bde3-429c-a551-999ad6bbead2" />
# 🌍 Global Weather App

A beautiful, responsive, and dynamic web application for checking real-time global weather conditions. Built purely with HTML, Vanilla JavaScript, and custom CSS using a modern glassmorphism aesthetic. No external UI frameworks or build pipelines are required!

## ✨ Features

- **Real-Time Forecasting**: Connects to the completely free [Open-Meteo](https://open-meteo.com) REST API to pull live temperature, wind, and humidity stats with zero API keys required.
- **Geocoding Location Lookups**: Type any city or country into the search bar to automatically resolve the parameters in the background using the Open-Meteo Geocoding API.
- **Quick Links (Dynamic Dropdowns)**: Includes a set of pre-configured smart dropdowns. Select a globally recognized country, and a specific cities dropdown automatically populates and filters for you. Clicking a city triggers a weather lookup instantly!
- **Glassmorphism Design**: Experience an animated, vibrant, infinite-gradient background complemented by frosted "glass" UI cards and micro-animations.

## 🛠️ Tech Stack

- **HTML5**: Structured with clean, semantic tagging.
- **CSS3**: Leveraging standard custom properties (`:root`), keyframe animations, and modern Flexbox layouts.
- **Vanilla JavaScript (ES6+)**: Incorporating structured error handling, `async/await` methodology for handling `fetch()` calls, and dynamic DOM manipulation for state updates.

## 🚀 Getting Started

Because this application runs entirely within the browser on the client side and interfaces with open API endpoints that have broad CORS rules, it requires absolutely no package installation configurations.

### Method 1: Barebones (Quick Launch)
1. Clone or download this repository.
2. Navigate into the application folder.
3. Simply double click on `index.html` to open it locally using your default web browser!

### Method 2: Local Server (Developer Recommended)
If you're modifying the code and want an active local development environment:

```bash
# If you have Python 3 installed, you can spin up the built-in HTTP server:
python -m http.server 8000

# OR using Node.js
npx serve -p 8000
```
Then visit `http://localhost:8000` in your web browser.

## 📍 Usage

1. **Manual Text Search**: In the topmost input field, type out any recognizable locale on earth (e.g., "Helsinki, Finland" or just "London") and hit **Enter**.
2. **Dropdown Quick Links**: 
   - Under the "Select Country" menu, select a nation (e.g. *Japan*).
   - A subsequent "Select City" menu will dynamically appear. Choose a destination (e.g. *Tokyo*).
   - The card UI will sweep into exactly your target destination immediately!

## 🙏 Credits & API Access
*   **Data Aggregation**: Driven entirely by the wonderful, open-source [Open-Meteo API](https://open-meteo.com/).
*   **Typography**: Styled specifically utilizing Google's [Inter Font](https://fonts.google.com/specimen/Inter).
