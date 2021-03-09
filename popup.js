let play = document.getElementById("play");

play.addEventListener("click", async(event) => {
    debugger;
    chrome.storage.sync.get("playStatus", ({ playStatus }) => {
        playStatus = !playStatus;
        chrome.storage.sync.set({ playStatus });
        //console.log(1, this)
        event.target.innerText = playStatus ? "Stop" : "Play";
    });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: test,
    });
});

function test() {
    console.log('test')
}