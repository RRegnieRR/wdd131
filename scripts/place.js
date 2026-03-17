const currentYear = document.querySelector("#currentyear");
if (currentYear) currentYear.textContent = new Date().getFullYear();

const lastModified = document.querySelector("#lastModified");
if (lastModified) lastModified.textContent = `Last Modification: ${document.lastModified}`;

function calculateWindChill(temperature, windSpeed) {
    return 13.12 + 0.6215 * temperature - 11.37 * Math.pow(windSpeed, 0.16) + 0.3965 * temperature * Math.pow(windSpeed, 0.16);
}

const temperature = 9;
const windSpeed = 10;
const windChillElement = document.querySelector("#windchill");

if (windChillElement) {
    if (temperature <= 10 && windSpeed > 4.8) {
        const windChill = calculateWindChill(temperature, windSpeed);
        windChillElement.textContent = `${windChill.toFixed(1)} °C`;
    } else {
        windChillElement.textContent = "N/A";
    }
}
