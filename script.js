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
   greetingDOM = document.getElementById("greeting"),
   form = document.getElementById("contact-form"),
   searchText = document.getElementById("search-text"),
   instructions = document.getElementById("instructions"),
   voice = document.getElementById("voice-search"),
   searchBtn = document.getElementById("search-btn"),
   answerDOM = document.getElementById("answer"),
   settingsBtn = document.getElementById("settings-btn");

let allInfoGiven = false,
   answerFinal,
   AIFailedToAnswer = false,
   submitForm = false;

// Checks if the user is online of offline
let userWasOffline = false;

window.addEventListener("load", (e) => {
   if (!navigator.onLine) {
      voice.innerText = "🎙";
      alert(
         "Oh no! You're offline now. So I can't give my best in helping you. Turn on the Internet Connection for better results."
      );
      userWasOffline = true;
   }
});

window.addEventListener("offline", (e) => {
   voice.innerText = "🎙";
   alert(
      "Oh no! You're offline now. So I can't give my best in helping you. Turn on the Internet Connection for better results."
   );
   userWasOffline = true;
});
window.addEventListener("online", (e) => {
   if (userWasOffline) {
      alert("Back online😀.");
      location.reload();
   }
});
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

if (localStorage.getItem("All Info Given")) {
   Array.from(temp).forEach((temp) => {
      temp.remove();
   });
}

let searchModeIsOn = false;
if (localStorage.getItem("All Clear")) {
   searchModeIsOn = true;
   pageReady.remove();
}
Array.from(userName).forEach((presentUserName) => {
   presentUserName.innerText = ` ${localStorage.getItem("First Name")}`;
});

// Speech Recognition
// window.speechRecognition = window.speechRecognition || window.webkitSpeechRecognition;
if (!("webkitSpeechRecognition" in window)) {
   voice.innerHTML = "mic_off";
   voice.addEventListener("click", () => {
      alert(
         "Speech Recognition is not supported in this browser😭. Try using Google Chrome's latest versions instead."
      );
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
// Key shortcuts

{
   let counter = 1;
   window.addEventListener("keydown", (e) => {
      if (e.shiftKey && e.keyCode == "83") {
         settingsBtn.click();
      }
   });
   settingsBtn.addEventListener("click", (e) => {
      counter++;
      if (counter % 2 === 0) {
         settingsBtn.classList.add("round-btn--active");
      } else {
         settingsBtn.classList.remove("round-btn--active");
      }
   });
}
// Text to speech
let speech = new SpeechSynthesisUtterance();
speech.lang = "en-US";

let voices = window.speechSynthesis.getVoices();
speech.voice = voices[1];

// Search Manipulation

function search() {
   speech.text = ""; // Reseting the speech text everytime the user searches

   answerFinal = "";
   answerDOM.innerHTML = "";

   const wordsToBeRemoved = [
      "solve",
      "what is the value of ",
      "what is the value ",
      "what is the ",
      "what is ",
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
      "divide ",
      "multiply ",
      "add ",
      "subtract ",
      "divided ",
      "multiplied ",
      "added ",
      "subtracted ",
      "difference ",
      "between ",
      "b2n ",
      "when ",
      "is ",
      "by ",
      "the ",
      "of ",
      "to ",
      "from ",
      "and ",
      "& ",
      "=",
      "meaning",
      "meaning ",
      "'s ",
      "called",
   ];
   /// Mathematical Problems
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

   // For checking whether the searchTextValue contains number
   function searchTextValueContainsNumber() {
      return /\d/.test(searchTextValue);
   }

   // Others
   let searchKeyword = "/search?q=";
   let SearchTextValueLastWord = searchTextValue.split(" ").pop().toString();

   if (
      SearchTextValueLastWord == "youtube" ||
      SearchTextValueLastWord == "yt" ||
      SearchTextValueLastWord == "y t"
   ) {
      searchKeyword = "/results?search_query=";
      SearchTextValueLastWord = "youtube";
   }

   let searchMainResult =
      searchTextValue.replace("search ", "") ||
      searchTextValue.replace("search", "");

   searchMainResult = searchMainResult.replace(" in ", "");

   if (searchTextValue.includes("in"))
      if (
         searchTextValue.includes("in") ||
         SearchTextValueLastWord == "google" ||
         SearchTextValueLastWord == "youtube" ||
         SearchTextValueLastWord == "yt"
      ) {
         searchMainResult = searchMainResult.replace(
            SearchTextValueLastWord,
            ""
         );
      }
   searchMainResult = searchMainResult.replace("yt", "").replace("y t", "");

   let searchURI = encodeURIComponent(searchMainResult);

   if (searchTextValue.includes("setting")) {
      settingsBtn.classList.add("round-btn--active");
   } else if (!searchTextValue) {
      answerFinal = "😶";
   } else if (searchTextValue.includes("open")) {
      searchTextValue = searchTextValue
         .replace("yt", "youtube")
         .replace("y t", "youtube");
      let whatToOPEN = searchTextValue.split(" ")[1];
      let domain = "";

      if (
         !(searchTextValue.includes(".") && searchTextValue.slice(-1) != ".")
      ) {
         domain = ".com";
      }
      window.open("https://" + whatToOPEN + domain, "_blank");
      answerFinal = `Opening <b>${whatToOPEN}</b>`;
   } else if (searchTextValue.includes("search")) {
      let domain = "";

      if (
         !(searchTextValue.includes(".") && searchTextValue.slice(-1) != ".")
      ) {
         domain = ".com";
      }

      if (
         searchTextValue.includes("in") ||
         SearchTextValueLastWord == "google" ||
         SearchTextValueLastWord == "youtube" ||
         SearchTextValueLastWord == "yt" ||
         SearchTextValueLastWord == "y t"
      ) {
         window.open(
            "https://" +
               SearchTextValueLastWord +
               domain +
               searchKeyword +
               searchURI,
            "_blank"
         );
         answerFinal = `Opening ${SearchTextValueLastWord}`;
      } else {
         answerFinal = `Opening Google`;
         window.open(
            "https://" + "google" + ".com" + searchKeyword + searchURI,
            "_blank"
         );
      }
   } else if (searchTextValue.includes("year")) {
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
   } else if (searchTextValue.includes("who am i")) {
      answerFinal = `You are ${localStorage.getItem("First Name")}, my master.`;
   } else if (searchTextValue.includes("my name")) {
      answerFinal = `Your name is ${localStorage.getItem(
         "First Name"
      )} ${localStorage.getItem("Last Name")}.`;
   } else if (searchTextValue.includes("my age")) {
      let Birth = new Date(localStorage.getItem("Date of Birth"));
      let BirthYear = Birth.getFullYear();
      let BirthMonth = Birth.getMonth();
      let BirthDate = Birth.getDate();

      // Age year
      let ageYear = date.getFullYear() - BirthYear;

      // Age month
      if (date.getMonth() >= BirthMonth) {
         var ageMonth = date.getMonth() - BirthMonth; //var used for lexical scope
      } else {
         ageYear--;
         var ageMonth = 12 + date.getMonth() - BirthMonth; //var used for lexical scope
      }

      // Age days
      if (date.getDate() >= BirthDate) var ageDate = date.getDate() - BirthDate;
      //var used for lexical scope
      else {
         ageMonth--;
         var ageDate = 31 + date.getDate() - BirthDate; //var used for lexical scope

         if (ageMonth < 0) {
            ageMonth = 11;
            ageYear--;
         }
      }

      if (ageYear > 0 && ageMonth > 0 && ageDate > 0)
         answerFinal = `Your age is ${ageYear} years ${ageMonth} months ${ageDate} days.`;
      else if (ageYear == 0 && ageMonth == 0 && ageDate > 0)
         ageString = `You're only ${ageDate} days old!`;
      else if (ageYear > 0 && ageMonth == 0 && ageDate == 0)
         answerFinal = `You're ${ageYear} years old. <i> Happy Birthday ${localStorage.getItem(
            "First Name"
         )}🥳🎉🎂!! <i>`;
      else if (ageYear > 0 && ageMonth > 0 && ageDate == 0)
         answerFinal = `You're ${ageYear} years and ${ageMonth} months old.`;
      else if (ageYear == 0 && ageMonth > 0 && ageDate > 0)
         answerFinal = `You're ${ageMonth} months and ${ageDate} days old.`;
      else if (ageYear > 0 && ageMonth == 0 && ageDate > 0)
         answerFinal = `You're ${ageYear} years, and ${ageDate} days old.`;
      else if (ageYear == 0 && ageMonth > 0 && ageDate == 0)
         answerFinal = `You're ${ageMonth} months old.`;
      else answerFinal = "Welcome to Earth! It's your first day on Earth!";

      //// P.S: I was finding trouble in making this possible so I took help from "https://www.javatpoint.com/calculate-age-using-javascript";
   } else if (
      searchTextValue.includes("my birth") ||
      searchTextValue.includes("i was born") ||
      searchTextValue.includes("was i born")
   ) {
      let Birth = new Date(localStorage.getItem("Date of Birth"));
      let BirthYear = Birth.getFullYear();
      let BirthMonth = months[Birth.getMonth()];
      let BirthDate = Birth.getDate();

      answerFinal = `You were born on ${BirthDate} ${BirthMonth} ${BirthYear}.`;
   } else if (searchTextValue.includes("can i drive")) {
      if (
         date.getFullYear() -
            localStorage.getItem("Date of Birth").split("-")[0] ==
         18
      ) {
         answerFinal = "Yes, you can drive";
      } else {
         answerFinal = "No, you can't drive because you are under-age.";
      }
   } else if (searchTextValue.includes("can i vote")) {
      if (
         date.getFullYear() -
            localStorage.getItem("Date of Birth").split("-")[0] ==
         18
      ) {
         answerFinal = "Yes, you can vote";
      } else {
         answerFinal = "No, you can't vote because you are under-age.";
      }
   } else if (searchTextValue.includes("my email")) {
      answerFinal = `Your email is ${localStorage.getItem("Email")}`;
   } else if (
      searchTextValue.includes("call") &&
      searchTextValueContainsNumber()
   ) {
      let regex = /[\+]?\d{10}|\(\d{3}\)\s?-\d{6}/;
      window.open(`tel:${searchTextValue.match(regex)}`, "_blank");
   } else if (
      searchTextValue.includes("call") &&
      searchTextValue.includes("police")
   )
      window.open(`tel:100`, "_blank");
   else if (
      searchTextValue.includes("call") &&
      (searchTextValue.includes("fire brigade") ||
         searchTextValue.includes("firebrigade"))
   )
      window.open(`tel:101`, "_blank");
   else if (
      searchTextValue.includes("call") &&
      searchTextValue.includes("ambulance")
   )
      window.open(`tel:102`, "_blank");
   else if (
      (searchTextValue.includes("hi") ||
         searchTextValue.includes("hello") ||
         searchTextValue.includes("hey")) &&
      !searchTextValue.includes("meaning")
   )
      answerFinal = `Hey ${localStorage.getItem("First Name")}! How are you.`;
   else if (
      searchTextValue.includes("bye") &&
      !searchTextValue.includes("meaning")
   ) {
      answerFinal = `Bye ${localStorage.getItem(
         "First Name"
      )}. I will miss you😊.`;
   } else if (
      searchTextValue.includes("i am fine") &&
      (searchTextValue.includes("what about you") ||
         searchTextValue.includes("what about u") ||
         searchTextValue.includes("how are you") ||
         searchTextValue.includes("how r u") ||
         searchTextValue.includes("how are u") ||
         searchTextValue.includes("how r you"))
   )
      answerFinal = "Oh, that's great! I'm fine too";
   else if (
      searchTextValue.includes("how are you") ||
      searchTextValue.includes("how r you") ||
      searchTextValue.includes("how r u") ||
      searchTextValue.includes("how are u")
   )
      answerFinal = "I am fine! What about you?";
   else if (searchTextValue.includes("i am fine"))
      answerFinal = "That's great!";
   else if (searchTextValue.includes("i am angry"))
      answerFinal =
         "Oh..I am really very upset to know that you are angry😔. How may I help you?";
   else if (searchTextValue.includes("i am upset"))
      answerFinal =
         "Oh..I am very sorry to hear that😔. How may I make your mood better😉?";
   else if (searchTextValue.includes("i am tired"))
      answerFinal =
         "Oh..You should take some rest, tell me how may I make you feel energetic😉?";
   else if (
      searchTextValue.includes("who are you") ||
      searchTextValue.includes("who r u") ||
      searchTextValue.includes("who r you")
   )
      answerFinal = "I am an AI made by Nandish Sarkar (AKA NanCoder900).";
   else if (searchTextValue.includes("ur name")) {
      answerFinal = "My name is Ai Sarkar. Hope you like it.";
   } else if (
      searchTextValue.includes("name") &&
      (searchTextValue.includes("ur inventor") ||
         searchTextValue.includes("who made you") ||
         searchTextValue.includes("ur creator"))
   ) {
      answerFinal =
         "The name of my creator is NanCoder900 (AKA Nandish Sarkar)";
   } else if (
      searchTextValue.includes("who made you") ||
      searchTextValue.includes("ur creator") ||
      searchTextValue.includes("ur inventor")
   )
      answerFinal =
         "My creator is Nandish Sarkar (AKA NanCoder900). His passion is Web Development.";
   else if (
      searchTextValue.includes("your age") ||
      searchTextValue.includes("ur age")
   )
      answerFinal = `Nandish got the idea of making me in August and then he started the work after some days and after all I was officially launched on 9th September 2021. <br> So now it's your turn to judge my correct age.`;
   else if (
      searchTextValue.includes("your birth") ||
      searchTextValue.includes("you born")
   )
      answerFinal = `Nandish got the idea of making me in August and then he started the work after some days and after all I was officially launched on 9th September 2021. <br> So now it's your turn to judge my correct birthday.`;
   else if (searchTextValue.includes("u do")) {
      answerFinal = `<h2 class="center-txt"> I can do many thing, like: </h2>  <li><b>1.</b> Open any website.</li> <li><b>2.</b> Search on other website(<b>exceptions are there.</b>)</li> <li><b>3.</b> Help you call somebody(e.g. Call police).</li> <li><b>4. </b>Chat with you.</li> <li><b>5.</b> Tell the time.</li> <li><b>6.</b> Perform math calculations(till now, only simple operations).</li> <li><b>7. </b> Tell the weather</li> <li><b>8. </b>Tell the meaning of a word</li> <li>etc.</li> `;
   } else if (searchTextValue.includes("how to do potty"))
      answerFinal =
         "Just go to the toilet and you will your self find the answer😉. Any more query?";
   else if (searchTextValue.includes("how to")) {
      answerFinal = `Showing some videos of youtube related to ${searchTextValue
         .replace("how to", "")
         .replace("do", "")
         .replace("?", "")
         .replace(".", "")}`;
      window.open(
         `https://youtube.com/results?search_query=${searchText.value}`,
         "_blank"
      );
   } else if (searchTextValue.includes("nandish")) {
      answerFinal =
         "<b>All about Nandish:</b> <br>Description: He is my inventor. <br> Likes: Maths and Computer. <br>Passion: Web Development <br>Nationality: Indian.";
   } else if (searchTextValue.includes("who is")) {
      answerFinal = `Showing <b>who is ${searchTextValue
         .replace("who is", "")
         .replace("?", "")
         .replace(".", "")}.</b>`;
      window.open(
         `https://www.google.com/search?q=${searchTextValue}`,
         "_blank"
      );
   } else if (
      searchTextValue === "Help" ||
      searchTextValue === "Help." ||
      searchTextValue === "Help!"
   )
      answerFinal = "Yes. How may I help you?";
   else if (
      searchTextValue.includes("gaming") &&
      searchTextValue.includes("yaars")
   )
      answerFinal = "Oh! Gaming Yaar, It's a wonerful youtube channel";
   else if (searchTextValue.includes("movie")) {
      answerFinal = "Showing search results for movies.";
      window.open("https://www.google.com/search?q=movies", "_blank");
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
   } else if (
      searchTextValue.includes("cuberoot") ||
      searchTextValue.includes("cube root")
   ) {
      findRoot(3);
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
   } else if (searchTextValue.includes("^")) Exponent();
   //Here no parameter is given because the function will itself find the index in special cases (i.e., when the 'searchTextValue' includes '^')
   else if (searchTextValueContainsNumber()) {
      function makeOperation(operator, term) {
         removeWordsForSolvingTheProblem();
         searchTextValue = searchTextValue.replace(" ", operator);
         answerFinal = `The ${term} is ${eval(searchTextValue)}.`;
      }
      if (searchTextValue.includes("divide")) {
         makeOperation("/", "quotient");
      } else if (searchTextValue.includes("multipl")) {
         // Here "multipl" is used instead of "multiply" so as to serve both in cases of "multiply" and "multiplied" since in both the letters "m, u, l, t, i, p, l" are present
         makeOperation("*", "product");
      } else if (searchTextValue.includes("add")) {
         makeOperation("+", "sum");
      } else if (
         searchTextValue.includes("subtract") ||
         searchTextValue.includes("difference")
      ) {
         makeOperation("-", "difference");
      } else {
         removeWordsForSolvingTheProblem();
         answer = eval(searchTextValue);

         if (!isNaN(eval(searchTextValue))) {
            answerFinal = `The answer is ${answer}.`;
         }
      }
   } else {
      // Dictionary
      removeWordsForSolvingTheProblem();

      const wordElem = document.createElement("div");
      const meaningElem = document.createElement("div");
      const exampleElem = document.createElement("div");
      const synonymsElem = document.createElement("div");

      // function makeGetRequest(api) {
      window.speechSynthesis.speak(speech);
      let api = `https://api.dictionaryapi.dev/api/v2/entries/en/${searchTextValue}`;
      fetch(api)
         .then((response) => response.json())
         .then((response) => {
            let word = searchTextValue;
            if (response.title) {
               submitForm = true;
               //if api returns the message of can't find word
               let userAgreesToGetTheAnswerFromGoogle = window.confirm(
                  "Sorry, I can't understand your query. So would you like to search in Google?."
               );

               if (userAgreesToGetTheAnswerFromGoogle) {
                  answerFinal = "Opening Google";
                  document.getElementById("form-next").value = location.href;
                  window.open(
                     `https://www.google.com/search?q=${encodeURIComponent(
                        searchText.value
                     )}`,
                     "_blank"
                  );
               } else {
                  answerFinal = "";
                  document.getElementById("form-next").value = location.href;
               }
            } else {
               let definitions = response[0].meanings[0].definitions[0],
                  phonetics = `${response[0].meanings[0].partOfSpeech} /${response[0].phonetics[0].text}/`;

               wordElem.innerHTML = `<b>Word:</b> ${response[0].word} <br> ${phonetics}`;
               meaningElem.innerHTML = `<h3>Meaning</h3> <p>${definitions.definition}</p>`;
               if (definitions.example) {
                  exampleElem.innerHTML = `<h3>Example</h3> <p>${definitions.example}.</p>`;
               } else {
                  exampleElem.innerHTML = "<h3>Example</h3> N/A.";
               }

               let synonyms = [];
               for (let i = 0; i < 5; i++) {
                  if (definitions.synonyms[i])
                     synonyms.push(definitions.synonyms[i]);
               }
               if (synonyms.length > 0) {
                  synonymsElem.innerHTML = `<h3>Synonyms</h3> <p>${synonyms.join(
                     ", "
                  )}.</p>`;
               } else synonymsElem.innerHTML = "<h1>Synonyms</h1> <br> N/A.";

               let dictionaryElems = [
                  wordElem,
                  meaningElem,
                  exampleElem,
                  synonymsElem,
               ];

               for (let i = 0; i < dictionaryElems.length; i++) {
                  answerDOM.appendChild(dictionaryElems[i]);
               }

               speech.text = answerDOM.innerText;
               window.speechSynthesis.speak(speech);
            }
         });
   }

   transcript = "";
   if (answerFinal) {
      answerFinal = String(answerFinal).replace("NaN", "invalid number");
      answerDOM.innerHTML = answerFinal;
      speech.text = answerDOM.innerText;
      window.speechSynthesis.speak(speech);

      // speech.text = ""; // Reseting the speech text after we're done
   }
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

if (hour > 12) {
   timeRange = "p.m.";
   hour -= 12;
} else if (hour == 12) {
   timeRange = "p.m.";
} else {
   timeRange = "a.m.";
}

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
   presentTime: hour + ":" + date.getMinutes() + " " + timeRange,
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
      alert(
         "Sorry! I can't find the weather because 'Geolocation' is not supported by the browser."
      );
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

            answerFinal = `Your are currently in ${place}. <br> Lat:${latitude} Lon:${longitude} <br> Description: ${description}. <br> Temperature: ${temp.toFixed(
               2
            )}°C(or ${fahrenheit.toFixed(
               2
            )}°F). <br> Sunrise: ${sunriseGMT.toLocaleDateString()}, ${sunriseGMT.toLocaleTimeString()}. <br> Sunset: ${sunsetGMT.toLocaleDateString()}, ${sunsetGMT.toLocaleTimeString()}`;
            // answerFinal = weatherResponse;
            answerDOM.innerHTML = answerFinal;
            speech.text = answerDOM.innerText;
            window.speechSynthesis.speak(speech);
         });
   }
}
/* /knowlege */

searchBtn.addEventListener("click", search);

const greetings = [
   "Good morning",
   "Good noon",
   "Good afternoon",
   "Good evening",
];
let greeting;
if (timeRange === "a.m.") greeting = greetings[0];
else if (time.presentHour === 12) {
   if (time.presentMinute === 0) {
      greeting = greetings[1];
   } else {
      greeting = greetings[2];
   }
} else if (time.presentHour >= 1 && time.presentHour < 4) {
   greeting = greetings[2];
} else greeting = greetings[3];

greetingDOM.innerText = greeting;
if (localStorage.getItem("First Name"))
   document.title = `AI - ${greeting} ${localStorage.getItem("First Name")}!`;
// 626ae011b9f2a70efc5fc4f98b510fe4

// Some FORM stuffs

document.getElementById("name").value = localStorage.getItem("First Name");
document.getElementById(
   "form-subject"
).value = `New query from ${localStorage.getItem("First Name")}!`;

form.addEventListener("submit", (e) => {
   if (submitForm) return true;
   else {
      e.preventDefault();
      return false;
   }
});

setInterval(() => {
   if (searchText.value) {
      // when user types something or searched something
      voice.style.display = "none";
      searchBtn.style.display = "";
   } else {
      searchBtn.style.display = "none";
      voice.style.display = "";
   }
}, 1000);
