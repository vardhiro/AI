// These are the informations for the AI to answer the client's question
var date = new Date();
var days = [
   "Sunday",
   "Monday",
   "Tuesday",
   "Wednesday",
   "Thursday",
   "Friday",
   "Saturday",
];
var months = [
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
var timeRange;
var hour = date.getHours();

hour > 12 ? ((hour -= 12), (timeRange = "p.m.")) : (timeRange = "a.m.");

var time = {
   presentHour: date.getFullYear(),
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
var wonders7 = [
   "Great Wall of China",
   "Chicén Itzá",
   "Petra",
   "Machu Picchu",
   "Christ the Redeemer",
   "Colosseum",
   "Taj Mahal",
];

// continents
var continents = [
   "Africa",
   "Antartica",
   "Asia",
   "Australlia",
   "Europe",
   "North America",
   "South America",
];

// Maths
function calculate() {
   let wordsToBeRemoved = ["solve", "what is the", "what is the value", "what is", "what", "is", "the", "value", "of"];
   let searchValue = searchText.value;
   let searchValueFinal;
   wordsToBeRemoved.forEach(element => {

	searchValue = searchValue.replace(element, "");
      let answer = eval(searchValue);
      console.debug(answer);
      console.log(searchValue);
})

}
searchBtn.addEventListener("click", calculate);
