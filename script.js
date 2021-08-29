// Storing HTML elements
const firstNameElem = document.getElementById("first-name"),
   lastNameElem = document.getElementById("last-name"),
   dateOfBirthElem = document.getElementById("date-of-birth"),
   emailElem = document.getElementById("email"),
   startBtn = document.getElementById("start-btn"),
   nextBtn = document.getElementsByClassName("next-btn"),
   temp = document.getElementsByClassName("temporary"),
   pageReady = document.getElementById("page-ready"),
   userName = document.getElementsByClassName("name"),
   continueBtn = document.getElementById("continue-btn"),
   searchText = document.getElementById("search-text"),
   instructions = document.getElementById("instructions"),
   voice = document.getElementById("voice-search"),
   searchBtn = document.getElementById("search-btn"),
   answerDOM = document.getElementById("answer");

let allInfoGiven = false;

// Next-btn onclick
Array.from(nextBtn).forEach((element) => {
   element.addEventListener("click", (e) => {
      let presentElem = document.getElementById(e.target.parentNode.id);
      presentElem.style.display = "none";
   });
});

// Storing the namme
startBtn.addEventListener("click", (_) => {
   localStorage.setItem("First Name", firstNameElem.value);
   localStorage.setItem("Last Name", lastNameElem.value);
   localStorage.setItem("Date of Birth", dateOfBirthElem.value);
   localStorage.setItem("Email", emailElem.value);
   localStorage.setItem("All Info Given", true);
   location.reload();
});

continueBtn.addEventListener("click", () => {
   localStorage.setItem("All Clear", true);
});

let searchModeIsOn = false;
if (localStorage.getItem("All Info Given")) {
   Array.from(temp).forEach((temp) => {
      temp.remove();
      searchModeIsOn = true;
   });
}
if (localStorage.getItem("All Clear")) {
   pageReady.remove();
}
Array.from(userName).forEach((presentUserName) => {
   presentUserName.innerText = ` ${localStorage.getItem("First Name")}`;
   console.log(localStorage.getItem("First Name"));
   console.log(firstNameElem.value);
});

// Speech Recognition
// window.speechRecognition = window.speechRecognition || window.webkitSpeechRecognition;
if (!("webkitSpeechRecognition" in window)) {
   voice.innerHTML = "mic_off"
   voice.addEventListener("click", () => {
      alert("Speech Recognition is not supported in this browser😭.");
   });
} else {
   const recognition = new webkitSpeechRecognition();

   recognition.addEventListener("result", (e) => {
      searchText.value = "";
      const transcript = Array.from(e.results)
         .map((result) => result[0])
         .map((result) => result.transcript)
         .join("");

      if (e.results[0].isFinal) {
         searchText.value = transcript.toString();
         searchBtn.click();
      }
   });

   recognition.addEventListener("speechstart", (e) => {
      searchText.placeholder = "Listening....";
   });

   recognition.addEventListener("speechend", (e) => {
      recognition.stop();
      recognition.removeEventListener("end", recognition.start);
      searchText.placeholder = "No activity.";
   });

   searchText.addEventListener("focus", (e) => {
      e.target.placeholder = "";
   });

   voice.addEventListener("click", (_) => recognition.start());
}

// Response

if (searchModeIsOn) {
   document.addEventListener("keyup", (e) => {
      if (e.keyCode === 13) {
         searchBtn.click();
      }
   });
}
// Text to speech
let speech = new SpeechSynthesisUtterance();
speech.lang = "en-US";

let voices = window.speechSynthesis.getVoices();
speech.voice = voices.filter(
   (voice) => voice.name == "Microsoft Zira Desktop - English (United States)"
)[0];

// Search Manipulation

function search() {
   const wordsToBeRemoved = [
      "solve",
      "what is the value of",
      "what is",
      "value of",
      "square of",
      "squareroot of",
      "square root of",
      "cube of",
      "cuberoot of",
      "cube root of",
      "?",
      "factorial of",
      "factorial",
      "!",
   ];
   // Mathematical Problems
   function removeWordsForSolvingTheProblem() {
      wordsToBeRemoved.forEach((word) => {
         if (searchTextValue.includes(word)) {
            searchTextValue = searchTextValue.replace(word, "");
         }
      });
   }
   // Exponents
   function Exponent(index) {
      removeWordsForSolvingTheProblem();
      let base;
      if (searchTextValue.includes("^")) {
         searchTextValue = searchTextValue.split("^").reverse();
         index = searchTextValue[0];
      } else {
         searchTextValue = searchTextValue.split(" ");
      }
      base = searchTextValue[searchTextValue.length - 1];
      answerFinal = `The answer is ${Math.pow(base, index)}.`;
   }

   // Roots
   function findRoot(index) {
      removeWordsForSolvingTheProblem();
      let base;
      if (searchTextValue.includes("^")) {
         searchTextValue = searchTextValue.split("^1/").reverse();
         index = searchTextValue[0];
      } else {
         searchTextValue = searchTextValue.split(" ");
      }
      base = searchTextValue[searchTextValue.length - 1];
      answerFinal = `The answer is ${Math.pow(base, 1 / index)}.`;
   }
   let searchTextValue = String(searchText.value).toLowerCase();

   // Factorial
   function findFactorial() {
      removeWordsForSolvingTheProblem();
      let f = 1;
      let n = Number(searchTextValue);
      for (let i = 1; i <= n; i++) {
         f = f * i;
      }
      answerFinal = `The factorial of ${n} is ${f}.`;
   }

   // For opening website/app
   let searchCommandIsOPEN = searchTextValue.includes("open");
   if (searchCommandIsOPEN) {
      window.open(
         "https://" + searchTextValue.split(" ")[1] + ".com",
         "_blank"
      );
      answerFinal = `Opening ${searchTextValue.split(" ")[1]}`;
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
         answerFinal = `Opening ${SearchTextValueLastWord}`;
      } else {
         window.open(
            "https://" + "google" + ".com" + searchKeyword + searchURI,
            "_blank"
         );
         answerFinal = `Opening Google`;
      }
   }

   if (searchTextValue.includes("year")) {
      answerFinal = `Year is ${time.presentYear}.`;
   } else if (searchTextValue.includes("month")) {
      answerFinal = `Month is ${time.presentMonth}.`;
   } else if (searchTextValue.includes("day")) {
      answerFinal = `Day is ${time.presentDay}.`;
   } else if (searchTextValue.includes("date")) {
      answerFinal = `Date is ${time.presentDate}.`;
   } else if (searchTextValue.includes("hour")) {
      answerFinal = `Hour is ${time.presentHour}.`;
   } else if (searchTextValue.includes("minute")) {
      answerFinal = `Minute is ${time.presentMinute}.`;
   } else if (searchTextValue.includes("second")) {
      answerFinal = `Second is ${time.presentSecond}.`;
   } else if (searchTextValue.includes("time")) {
      answerFinal = `Time is ${time.presentTime}`;
   } else if (searchTextValue.includes("continent")) {
      answerFinal = `The continents are ${continents.join(", ")}.`;
   } else if (
      searchTextValue.includes("seven wonder") ||
      searchTextValue.includes("7 wonder")
   ) {
      answerFinal = `The seven wonders are ${wonders7.join(", ")}.`;
   } else if (searchTextValue.includes("weather")) {
      getWeather();
   } else if (searchTextValue.includes("my name")) {
      answerFinal = `Your name is ${localStorage.getItem(
         "First Name"
      )} ${localStorage.getItem("Last Name")}.`;
   } else if (searchTextValue.includes("my age")) {
      let Birth = localStorage.getItem("Date of Birth").split("-");
      let BirthYear = Birth[0];
      let BirthMonth = Birth[1];
      let BirthDate = Birth[2];

      let ageYear = date.getFullYear() - BirthYear;
      let ageMonth = date.getMonth() - BirthMonth + 1;
      let ageDate = date.getDate() - BirthDate;

      answerFinal = `Your age is ${ageYear} years ${ageMonth} months ${ageDate} days.`;
   } else if (searchTextValue.includes("my birth") || searchTextValue.includes("i was born")) {
      let Birth = localStorage.getItem("Date of Birth").split("-").reverse().join("/");
      answerFinal = `You were born on ${Birth}.`
   }
    else if (searchTextValue.includes("my email")) {
      answerFinal = `Your email is ${localStorage.getItem("Email")}`;
   } else if (
      searchTextValue.includes("factorial") ||
      searchTextValue.includes("!")
   ) {
      findFactorial();
   } else if (
      searchTextValue.includes("squareroot") ||
      searchTextValue.includes("square root")
   ) {
      findRoot(2);
   } else if (searchTextValue.includes("^1/")) {
      findRoot();
   } else if (
      searchTextValue.includes("square") ||
      searchTextValue.includes("^2") ||
      searchTextValue.includes("^ 2")
   ) {
      Exponent(2);
   } else if (
      searchTextValue.includes("cube") ||
      searchTextValue.includes("^3") ||
      searchTextValue.includes("^ 3")
   ) {
      Exponent(3);
   } else if (searchTextValue.includes("^")) {
      Exponent(); //Here no parameter is given because the function will itself find the index in special cases (i.e., when the 'searchTextValue' includes '^')
   } else {
      removeWordsForSolvingTheProblem();
      answer = eval(searchTextValue);

      if (!isNaN(eval(searchTextValue))) {
         answerFinal = `The answer is ${answer}`;
      }
   }
   transcript = "";
   if (answerFinal) {
      answerDOM.innerHTML = answerFinal;
   }
   speech.text = answerDOM.innerText;
   window.speechSynthesis.speak(speech);
}

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
   presentTime: hour + " " + date.getMinutes() + " " + timeRange,
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

// Weather
// let weatherResponse;

function getWeather() {
   if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
   } else {
      alert("Geolocation is not supported by this browser.");
   }

   function showPosition(position) {
      answerFinal = "Loading...please wait.";
      let longitude = position.coords.longitude;
      let latitude = position.coords.latitude;

      // API
      const api = "626ae011b9f2a70efc5fc4f98b510fe4";
      const base = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api}&units=metric`;

      // Fetch API
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

            answerFinal = `Your are currently in ${place}. <br> Description: ${description}. <br> Temperature: ${temp.toFixed(
               2
            )}°C(or ${fahrenheit.toFixed(
               2
            )}°F). <br> Sunrise: ${sunriseGMT.toLocaleDateString()}, ${sunriseGMT.toLocaleTimeString()}. <br> Sunset: ${sunsetGMT.toLocaleDateString()}, ${sunsetGMT.toLocaleTimeString()}`;
            console.log(answerFinal);
            // answerFinal = weatherResponse;
            answerDOM.innerHTML = answerFinal;
            speech.text = answerDOM.innerText;
            window.speechSynthesis.speak(speech);
         });
   }
}
/* /knowlege */

searchBtn.addEventListener("click", search);

// 626ae011b9f2a70efc5fc4f98b510fe4

console.log("ST", speech.text);
console.log(answerFinal);
