// Storing HTML elements
const firstNameElem = document.getElementById("first-name"),
   lastNameElem = document.getElementById("last-name"),
   dateOfBirthElem = document.getElementById("date-of-birth"),
   emailElem = document.getElementById("email"),
   startBtn = document.getElementById("start-btn"),
   nextBtn = document.getElementsByClassName("next-btn"),
   temp = document.getElementsByClassName("temporary"),
   userName = document.getElementsByClassName("name"),
   continueBtn = document.getElementById("continue-btn"),
   searchText = document.getElementById("search-text"),
   instructions = document.getElementById("instructions"),
   voice = document.getElementById("voice-search"),
   searchBtn = document.getElementById("search-btn");

let allInfoGiven = false;

// Next-btn onclick
Array.from(nextBtn).forEach((element) => {
   element.addEventListener("click", (e) => {
      let presentElem = document.getElementById(e.target.parentNode.id);
      presentElem.remove();
   });
});

// Storing the namme
startBtn.addEventListener("click", (e) => {
   let userInfo = {
      Fname: firstNameElem.value,
      Lname: lastNameElem.value,
      birthDate: dateOfBirthElem.value,
      email: emailElem.value,
   };

   console.log("First Name: " + userInfo.Fname);
   console.log("Last Name: " + userInfo.Lname);
   console.log("Date of Birth: " + userInfo.birthDate);
   console.log("Email: " + userInfo.email);

   localStorage.setItem("First Name", userInfo.Fname);
   localStorage.setItem("Last Name", userInfo.Lname);
   localStorage.setItem("Date of Birth", userInfo.birthDate);
   localStorage.setItem("Email", userInfo.email);

   console.log(localStorage.getItem("First Name"));
   console.log(localStorage.getItem("Last Name"));
   console.log(localStorage.getItem("Date of Birth"));
   console.log(localStorage.getItem("Email"));

   let presentElem = document.getElementById(e.currentTarget.parentNode.id);
   presentElem.style.display = "none";
});

continueBtn.addEventListener("click", (_) => {
   localStorage.setItem("All Info Given", true);
});

let searchModeIsOn = false;
if (Boolean(localStorage.getItem("All Info Given"))) {
   Array.from(temp).forEach((element) => {
      element.remove();
      searchModeIsOn = true;
   });
}

Array.from(userName).forEach((element) => {
   element.innerText = ` ${localStorage.getItem("First Name")}`;
});

// Speech Recognition
if (window.speechRecognition) {
   window.SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
   const recognition = new SpeechRecognition();
   recognition.interimResults = true;

   recognition.addEventListener("result", (e) => {
      searchText.value = "";
      const transcript = Array.from(e.results)
         .map((result) => result[0])
         .map((result) => result.transcript)
         .join("");
      console.log(transcript);
      if (e.results[0].isFinal) {
         searchText.value = transcript.toString();
      }
   });

   recognition.addEventListener("speechstart", (e) => {
      searchText.placeholder = "Listening....";
   });

   recognition.addEventListener("speechend", (e) => {
      recognition.stop();
      recognition.removeEventListener("end", recognition.start);
      searchText.placeholder = "No activity.";
      searchBtn.click();
   });

   searchText.addEventListener("focus", (e) => {
      e.target.placeholder = "";
   });

   voice.addEventListener("click", (_) => recognition.start());
}
// Response
if (searchModeIsOn) {
   document.addEventListener("keydown", (e) => {
      if (e.code == "Enter") {
         searchBtn.click();
      }
   });
}
function search() {
   let searchTextValue = String(searchText.value).toLowerCase();
   console.log(searchTextValue);

   // For opening website/app
   let searchCommandIsOPEN = searchText.value.includes("open");
   if (searchCommandIsOPEN) {
      window.open(
         "https://" + searchText.value.split(" ")[1] + ".com",
         "_blank"
      );
   }

   /* ================================ */
   let searchCommandIsSEARCH = searchTextValue.includes("search");
   let searchTextValueContainsIN = searchTextValue.includes("in");

   let SearchTextValueLastWord = searchTextValue.split(" ").pop().toString();

   let searchKeyword = "/search?q=";
   if (
      SearchTextValueLastWord.toLowerCase() == "youtube" ||
      SearchTextValueLastWord.toLowerCase() == "yt"
   ) {
      searchKeyword = "/results?search_query=";
      SearchTextValueLastWord = "youtube";
   }

   let searchMainResult =
      searchTextValue.toLowerCase().replace("search ", "") ||
      searchTextValue.toLowerCase().replace("search", "");

   searchMainResult = searchMainResult.replace(" in ", "");
   if (searchTextValueContainsIN || searchTextValue.toLowerCase)
      if (
         searchTextValueContainsIN ||
         SearchTextValueLastWord.toLowerCase() == "google" ||
         SearchTextValueLastWord.toLowerCase() == "youtube" ||
         SearchTextValueLastWord.toLowerCase() == "yt"
      ) {
         searchMainResult = searchMainResult.replace(
            SearchTextValueLastWord,
            ""
         );
      }
   searchMainResult = searchMainResult.replace("yt", "");

   console.log(`searchMainResult: ${searchMainResult}`);
   let searchURI = encodeURIComponent(searchMainResult);
   if (searchCommandIsSEARCH) {
      if (
         searchTextValueContainsIN ||
         SearchTextValueLastWord.toLowerCase() == "google" ||
         SearchTextValueLastWord.toLowerCase() == "youtube" ||
         SearchTextValueLastWord.toLowerCase() == "yt"
      ) {
         window.open(
            "https://" +
               SearchTextValueLastWord +
               ".com" +
               searchKeyword +
               searchURI,
            "_blank"
         );
      } else {
         window.open(
            "https://" + "google" + ".com" + searchKeyword + searchURI,
            "_blank"
         );
         // SearchTextValueLastWord = "google";
      }
   }
   console.log(`Last Word ${SearchTextValueLastWord}`);
   console.log(`keyword ${searchKeyword}`);
   /* ================================ */
   // Date
   if (searchTextValue.includes("year")) {
      console.log(`Year is ${time.presentYear}.`);
   }

   if (searchTextValue.includes("month")) {
      console.log(`Month is ${time.presentMonth}.`);
   }

   if (searchTextValue.includes("day")) {
      console.log(`Day is ${time.presentDay}.`);
   }

   if (searchTextValue.includes("date")) {
      console.log(`Date is ${time.presentDate}.`);
   }

   if (searchTextValue.includes("hour")) {
      console.log(`Hour is ${time.presentHour}.`);
   }

   if (searchTextValue.includes("minute")) {
      console.log(`Minute is ${time.presentMinute}.`);
   }

   if (searchTextValue.includes("second")) {
      console.log(`Second is ${time.presentSecond}.`);
   }

   if (searchTextValue.includes("time")) {
      console.log(`Time is ${time.presentTime}.`);
   }

   /* ================================ */
   // Seven Wonders
   if (searchTextValue.includes("continents")) {
      console.log(`The continents are ${continents.join(", ")}.`);
   }

   // Getting weather
   if (searchTextValue.includes("weather")){
      getWeather();
   }
   transcript = "";
}

searchBtn.addEventListener("click", search);

// Knowledge
{
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
         ":" +
         date.getMinutes() +
         ":" +
         date.getSeconds() +
         " " +
         timeRange,
   };

   console.log(time.presentHour);
   console.log(time.presentMinute);
   console.log(time.presentSecond);
   console.log(time.presentTime);

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
      console.log(`Answer: ${answer}`);
      console.log(`searchValue: ${searchValue}`);
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
      console.log(`Latitude: ${latitude}`);
      console.log(`Longitude: ${longitude}`);

   const api = '626ae011b9f2a70efc5fc4f98b510fe4';
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

      // Output
      console.log(`Location: ${place}`)
      console.log(`Description: ${description}`)
      console.log(`TempC: ${temp.toFixed(2)}°C`)
      console.log(`TempF: ${fahrenheit.toFixed(2)}°F`)
      console.log(`Sunrise: ${sunriseGMT.toLocaleDateString()}, ${sunriseGMT.toLocaleTimeString()}`)
      console.log(`Sunset: ${sunsetGMT.toLocaleDateString()}, ${sunsetGMT.toLocaleTimeString()}`)
   }); 
   }
}/* /knowlege */

// 626ae011b9f2a70efc5fc4f98b510fe4