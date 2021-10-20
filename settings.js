const settingsTitles = document.getElementById("settings-titles"),
   settingsTiles = document.getElementById("settings-tiles");

let settingsTitlesWidth;
setInterval(() => {
   settingsTitlesWidth = settingsTitles.offsetWidth;
   settingsTiles.style.marginLeft = `${settingsTitlesWidth}px`;
   settingsTiles.style.width = `${(window.innerWidth - settingsTitlesWidth)}px`;
}, 1000);

const allInputBoxsOfSettingsTiles = document.querySelectorAll(".settings-tiles input")

for (let input in allInputBoxsOfSettingsTiles) {
   let eachInput = allInputBoxsOfSettingsTiles[input];
   let eachInputPlaceholder = eachInput.placeholder;

   eachInput.title = eachInputPlaceholder;
}