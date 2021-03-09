//初始化資料
let wordBook = [{
    word: "Apple",
    description: "蘋果",
    type: "",
    group: "",
    learned: ""
}, {
    word: "Red",
    description: "紅色",
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
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ wordBook });
});