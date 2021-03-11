var data = {}
var wordBook = {}
var inputButton = document.querySelector("#excelFile")

inputButton.addEventListener('change', uploadFile);

window.onload = function() {
    chrome.storage.local.get('wordBook', (x) => {
        data.words = x.wordBook
        wordBook = x.wordBook
        chrome.storage.local.get('title', ({ title }) => {
            buildTable(document.querySelector('#table'), title)
        });

    })
}

function uploadFile(event) {
    let reader = new FileReader();
    //在FileReader load 被觸發時
    reader.addEventListener('load', () => {
        //1.將檔案轉為xlsx物件(使用binary格式)
        var workbook = XLSX.read(reader.result, {
            type: 'array'
        });

        //2. 選擇要匯入的Sheet
        var sheetNames = workbook.SheetNames;
        var choiceName = prompt(`工作簿有： ${sheetNames.toString()}，請輸入工作簿名稱 :`, sheetNames[0])
            //console.log(`choice SheetName ${choiceName}`)

        //3. 將一個工作簿轉成JSON
        let results = XLSX.utils.sheet_to_json(workbook.Sheets[choiceName], {
            // header: 1,
            defval: '' //設定預設值//當欄位沒有設置時key也不會消失

        });
        //console.log(results)

        //4. 將取得的Json存入data
        data.words = results;
        wordBook = data.words;
        chrome.storage.local.set({ wordBook });

        var title = Object.keys(data.words[0]);
        chrome.storage.local.set({ title });

        buildTable(document.querySelector('#table'), title)
    });

    reader.readAsArrayBuffer(event.target.files[0]);

    event.target.value = '' //匯入完成後將target清空，使得同一檔案可以一直上傳
}

function buildTable(dom, title) {
    var table = document.createElement('table');
    var thead = document.createElement('thead');
    var tbody = document.createElement('tbody');
    table.appendChild(thead);
    table.appendChild(tbody);

    //表單標題
    var theadTr = document.createElement('tr');
    var th = document.createElement('th');
    th.innerText = "";
    theadTr.appendChild(th);
    title.forEach(x => {
        var th = document.createElement('th');
        th.innerText = x;
        theadTr.appendChild(th);
    });
    thead.appendChild(theadTr);

    //表單內容
    data.words.forEach((row, index) => {
        var tr = document.createElement('tr');

        var td = document.createElement('td')
        td.innerText = index + 1
        tr.appendChild(td)
        title.forEach(col => {
            var td = document.createElement('td');
            td.innerText = row[col];
            tr.appendChild(td);
        })
        tbody.appendChild(tr);
    });
    dom.innerHTML = "";
    dom.appendChild(table);

}