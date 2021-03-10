let play = document.getElementById("play");

play.addEventListener("click", async(event) => {
    debugger;
    chrome.storage.local.get("playStatus", ({ playStatus }) => {
        playStatus = !playStatus;
        chrome.storage.local.set({ playStatus });
        //console.log(1, this)
        event.target.innerText = playStatus ? "Stop" : "Play";
    });
});