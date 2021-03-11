let partOfSpeech = [{
    code: "n",
    description: "名詞"
}, {
    code: "v",
    description: "動詞"
}, {
    code: "vi",
    description: "不及物動詞"
}, {
    code: "vt",
    description: "及物動詞"
}, {
    code: "adj",
    description: "形容詞"
}, {
    code: "adv",
    description: "副詞"
}, {
    code: "conj",
    description: "連接詞"
}, {
    code: "prep",
    description: "介係詞"
}, {
    code: "pron",
    description: "代名詞"
}, {
    code: "s",
    description: "主詞"
}, {
    code: "sc",
    description: "主詞補語"
}, {
    code: "o",
    description: "受詞"
}, {
    code: "oc",
    description: "受詞補語"
}, {
    code: "art",
    description: "冠詞"
}, {
    code: "num",
    description: "數詞"
}, {
    code: "int",
    description: "感嘆詞"
}, {
    code: "u",
    description: "不可數名詞"
}, {
    code: "c",
    description: "可數名詞"
}];

var isPlay = true;
var keepPlayStatus

partOfSpeech = partOfSpeech.sort((x, y) => {
    return x.code.length < y.code.length ? 1 : -1;
})

chrome.storage.local.get("wordBook", async({ wordBook }) => {
    console.log(wordBook)
    sliderWords(wordBook)
});


function sliderWords(wordBook) {
    var wordBookDiv = document.createElement('div')
    wordBookDiv.id = "word"
    document.body.appendChild(wordBookDiv)
    let currentIndex = 0
    setWordText(wordBookDiv, wordBook, currentIndex)
    setInterval(function() {
        chrome.storage.local.get("playStatus", async({ playStatus }) => {
            if (keepPlayStatus == undefined || keepPlayStatus != playStatus) {
                keepPlayStatus = playStatus;
                isPlay = playStatus;
            }

            if (isPlay) {
                var speakButton = setWordText(wordBookDiv, wordBook, currentIndex)
                currentIndex++
                currentIndex = currentIndex % (wordBook.length)
                speakButton.click()
            } else if (!keepPlayStatus) {
                var playButton = document.querySelector("#play")
                var stopImageUrl = chrome.runtime.getURL("images/stop.png");
                playButton.style.backgroundImage = `url(${stopImageUrl})`;
            }
        });
    }, 9000)
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
        setTimeout(function() {
            speech(transferCode(dataList[index].description))
        }, 3000)
    });

    var playButton = document.createElement('button');
    playButton.id = "play";
    var playImageUrl = chrome.runtime.getURL("images/play.png");
    var pauseImageUrl = chrome.runtime.getURL("images/pause.png");
    playButton.style.backgroundImage = `url(${playImageUrl})`;
    playButton.addEventListener('click', function(event) {
        isPlay = !isPlay;
        var currentImage = isPlay ? `url(${playImageUrl})` : `url(${pauseImageUrl})`;
        event.target.style.backgroundImage = currentImage;

    })

    dom.appendChild(speak)
    dom.insertBefore(playButton, dom.childNodes[0]);

    return speak;
}

function speech(text) {
    //使用原生JS
    window.speechSynthesis.cancel(); //先停止先前的發音事件
    let speechSynthesis = window.speechSynthesis;
    var words = new SpeechSynthesisUtterance(text);
    let voices = speechSynthesis.getVoices();
    var voiceName = "Google 國語（臺灣）"; //"Microsoft Hanhan Desktop - Chinese(Taiwan)" //微軟發音
    words.voice = voices.find(x => x.name == voiceName) || void(words.lang = "zh-TW"); //使用其它來源 發音
    speechSynthesis.speak(words);
}

function transferCode(text) {
    if (text) {
        partOfSpeech.forEach(x => {
            var re = new RegExp(x.code, 'gi')
            text = text.replace(re, x.description);
        })
    }
    return text;
}