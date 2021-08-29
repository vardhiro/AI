// Knowledge

// These are the informations for the AI to answer the client's question
let date = new Date();
let days = [
   "Sunday",
   "Monday",
   "Tuesday",
   "Wednesday",
   "Thursday",
   "Friday",
   "Saturday",
];
let months = [
   "January",
   "February",
   "March",
   "April",
   "May",
   "April",
   "June",
   "July",
   "August",
   "September",
   "October",
   "November",
   "December",
];
let timeRange;
let hour = date.getHours();

hour > 12 ? ((hour -= 12), (timeRange = "p.m.")) : (timeRange = "a.m.");

let time = {
   presentYear: date.getFullYear(),
   presentMonth:
      months[
         date.getMonth() + 1
      ] /*  '+1' is used because the counting of months starts with '1' but in javascript the numbers start with '0'. */,
   presentDate: date.getDate(),
   presentDay: days[date.getDay()],
   presentHour: hour,
   presentMinute: date.getMinutes(),
   presentSecond: date.getSeconds(),
   presentTime:
      hour +
      " " +
      date.getMinutes() +
      " " +

      timeRange,
};

// 7 wonders of the world
let wonders7 = [
   "Great Wall of China",
   "Chicén Itzá",
   "Petra",
   "Machu Picchu",
   "Christ the Redeemer",
   "Colosseum",
   "Taj Mahal",
];

// continents
let continents = [
   "Africa",
   "Antartica",
   "Asia",
   "Australlia",
   "Europe",
   "North America",
   "South America",
];

// Maths
searchBtn.addEventListener("click", (e) => {
   let wordsToBeRemoved = [
      "solve",
      "what is the value of",
      "what is",
      "value of",
   ];
   let searchValue = String(searchText.value);
   let answer;
   wordsToBeRemoved.forEach((word) => {
      if (searchValue.includes(word)) {
         searchValue = searchValue.replace(word, "");
         answer = eval(searchValue);
      }
   });


   if (!(isNaN(answer))) {
      speech.text = `The answer is ${answer}`;
   }
});

// Weather
function getWeather() {
   if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
   } else {
      alert("Geolocation is not supported by this browser.");
   }
}
function showPosition(position) {
   let longitude = position.coords.longitude;
   let latitude = position.coords.latitude;

   const api = "626ae011b9f2a70efc5fc4f98b510fe4";
   const base = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api}&units=metric`;

   fetch(base)
      .then((response) => {
         return response.json();
      })
      .then((data) => {
         const { temp } = data.main;
         const place = data.name;
         const { description } = data.weather[0];
         const { sunrise, sunset } = data.sys;
         const fahrenheit = (temp * 9) / 5 + 32;

         const sunriseGMT = new Date(sunrise * 1000);
         const sunsetGMT = new Date(sunset * 1000);

         // // Output
         // speech.text = `Location: ${place}`;
         // speech.text = `Description: ${description}`;
         // speech.text = `TempC: ${temp.toFixed(2)}°C`;
         // speech.text = `TempF: ${fahrenheit.toFixed(2)}°F`;
         // speech.text = `Sunrise: ${sunriseGMT.toLocaleDateString()}, ${sunriseGMT.toLocaleTimeString()}`;
         // speech.text = `Sunset: ${sunsetGMT.toLocaleDateString()}, ${sunsetGMT.toLocaleTimeString()}`;
      });
}
/* /knowlege */
