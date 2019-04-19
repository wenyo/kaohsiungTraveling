// AJAX JSON
let openData = "";
fetch("https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97",{})
    .then((res) => res.json())
    .then((jsonData) => openData = jsonData.result.records)
    .then(() => {
        showAreaSelect();
        searchAreaLoop('三民區');
    })
    .catch((err) => console.log("錯誤",err));

// 1.Dom
const banner = document.querySelector('.banner');
const list = document.querySelector('.list');
const areaSelect = document.querySelector('.areaSelect');
const popularAreaBtn = document.querySelectorAll('.popularAreaBtn');
const page = document.querySelector('.page');
const onePageNum = 8; // 一頁顯示資料數量

// 2.popularArea Setting
popularAreaBtn[0].innerHTML = "苓雅區";
popularAreaBtn[1].innerHTML = "三民區";
popularAreaBtn[2].innerHTML = "新興區";
popularAreaBtn[3].innerHTML = "鹽埕區";

// 3.Css Setting
banner.style.height =  window.screen.height / 2+ 'px';

// 4.Listener 監聽
areaSelect.addEventListener('change',selectChange,false);
for(let i = 0; i < popularAreaBtn.length; i++){
    popularAreaBtn[i].addEventListener('click',popularArea,false);
}

// 5-1-1. Area Select Options 選單選項建立
function showAreaSelect() {
    // 用 Set物件建立選單
    let areaSet = new Set();
    for(let i = 0; i < openData.length; i++){
        areaSet.add(openData[i].Zone);
    }
    // 選項建立
    let areaOption = "";
    const str = `<option selected="true" disabled="disabled">--請選擇行政區--</option>`;
    for (let key of areaSet.keys()){
        areaOption += `<option value="${key}">${key}</option>`;
    }
    areaSelect.innerHTML = str + areaOption;
}

// 5-2.Show Area Info 將選擇地區的旅遊資訊列出來
function searchAreaLoop(location){
    // Show Area Name 顯示地區大標
    const areaName = document.querySelector('.areaName');
    areaName.innerHTML = location;

    // Show Area List 顯示該地區列表
    const len = openData.length;
    let str = "";
    const clock = `<i class="fas fa-clock clockStyle"></i>`;
    const mapPin = `<i class="fas fa-map-marker-alt mapPinStyle"></i>`;
    const phone = `<i class="fas fa-phone phoneStyle"></i>`;
    const tag = `<i class="fas fa-tag tagStyle"></i>`;

    for(let i = 0; i < len; i++){
        if(location == openData[i].Zone){
            str += `<li class="place">\
                        <div class="areaTitle">\
                            <img src="${openData[i].Picture1}" alt=""></img>\
                            <h3>${openData[i].Name}</h3>\
                            <p class="area">${openData[i].Zone}</p></div>\
                        <div class="areaContent">\
                            <p class="serviceHours"> ${clock}${openData[i].Opentime}</p>\
                            <p class="address">${mapPin}${openData[i].Add} </p>\
                            <p class="tel"> ${phone}${openData[i].Tel}</p>\
                            <p class="ticketInfo"> ${tag}${openData[i].Ticketinfo}\
                            <div class="clear"></div>\
                        </div>\
                    </li>`;
        }
    }
    list.innerHTML = str;

    if(str !== ""){
        goPage(0,location);
    }else{
        page.textContent = ""
    }
}

// 6.Page 頁數
function goPage(num,location) {

    // 8-1.列出選擇地區陣列
    const len = openData.length;
    let chosenArea = [];

    for(let i = 0; i < len; i++){
        if(location == openData[i].Zone){
            chosenArea.push(openData[i]);
        }
    }
    const chosenLen = chosenArea.length // 陣列長度
    let pagetotal = 0; // 總頁數預設 0
    const nowPage = num; // 當前頁數

    pagetotal = Math.ceil( chosenLen / onePageNum); // 計算總頁數（最小整數）

    // 列出頁數列表
    let str = "";
    for(let i = 0; i < pagetotal; i++){
        str += `<li><a href="#">${i+1}</a></li>`
    }
    page.innerHTML = str;

    const place = document.querySelectorAll('.place');
    const aLi = page.querySelectorAll('li a');
    // 預設
    aLi[nowPage].setAttribute('class','pageActive'); 
    for (let i = 0; i < pagetotal; i++ ){
        aLi[i].index = i; //建立每個頁碼索引

        for(let j = 0; j < chosenLen; j++){
            if(j < onePageNum){
                if( place[j] == undefined){return;}
                place[j].style.display = 'block';
            }else{
                place[j].style.display = 'none';
            }
        }
        // 點擊頁碼
        aLi[i].addEventListener('click',function (e) {
            e.preventDefault();
            a = this.index;

            // 頁碼class
            for(let j = 0;j < aLi.length; j++){
                aLi[j].setAttribute('class','');
            }
            this.setAttribute('class','pageActive');

            // 頁面切換
            for(let j = 0; j < chosenLen; j++){
                if(j >= (a * onePageNum) && j < (a+1)*onePageNum ){
                    place[j].style.display = 'block';
                }else{
                    place[j].style.display = 'none';
                }
            }
        },false);
    }
}

// 7. Select 選單選擇後觸發函式
function selectChange (e){
    const select = e.target.value;
    searchAreaLoop(select);
}

// 8.PopularArea 點擊熱門地區後觸發函式
function popularArea (e) {
    e.preventDefault(); 
    const poular = e.target.innerText;
    searchAreaLoop(poular);
}