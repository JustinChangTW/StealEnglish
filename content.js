chrome.storage.sync.get("wordBook", async({ wordBook }) => {
    sliderWords(wordBook)
});


function sliderWords(wordBook) {
    var wordBookDiv = document.createElement('div')
    wordBookDiv.id = "word"

    document.body.appendChild(wordBookDiv)
    let currentIndex = 0
    setWordText(wordBookDiv, wordBook, currentIndex)
    setInterval(function() {
        var speakButton = setWordText(wordBookDiv, wordBook, currentIndex)
        currentIndex++
        currentIndex = currentIndex % (wordBook.length)
        speakButton.click()
    }, 5000)
}

function setWordText(dom, dataList, index) {
    dom.innerText = `${dataList[index].word} ${dataList[index].description} `
    var speak = document.createElement("button")
    speak.id = "speak"
    var imageUrl = chrome.runtime.getURL("images/volume-up-fill.png")
    speak.style.backgroundImage = `url(${imageUrl})`;
    speak.addEventListener('click', function() {
        //使用原生JS
        setTimeout(function() { speech(dataList[index].word) }, 0)
        setTimeout(function() { speech(dataList[index].description) }, 2000)
    })
    dom.appendChild(speak);
    return speak;
}

function speech(text) {
    //使用原生JS
    window.speechSynthesis.cancel(); //先停止先前的發音事件
    var words = new SpeechSynthesisUtterance(text);
    let voices = window.speechSynthesis.getVoices();
    var voiceName = "Google 國語（臺灣）"; //"Microsoft Hanhan Desktop - Chinese(Taiwan)" //微軟發音
    words.voice = voices.find(x => x.name == voiceName) || void(words.lang = "zh-TW"); //使用其它來源 發音
    window.speechSynthesis.speak(words);
}