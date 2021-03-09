//初始化資料
let wordBook = [{
    word: "a lot of",
    description: "許多，(片)",
    type: "",
    group: "",
    learned: ""
}, {
    word: "abroad",
    description: "國外，海外，(adv)",
    type: "",
    group: "",
    learned: ""
}, {
    word: "available",
    description: "可用的",
    type: "",
    group: "",
    learned: ""
}]
let playStatus = true
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ wordBook });
    chrome.storage.sync.set({ playStatus });
});