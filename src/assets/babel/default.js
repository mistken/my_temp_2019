/**
 * 実行JS
 */

// import "babel-polyfill"; // 重い
import 'core-js/modules/es6.promise'; // 単体読み込みで大丈夫かテストする

import axios from "axios";

/*
  汎用関数
*/
// urlパラメーター処理
// urlパラメーター例：?filter=product
const paramsObj = new Object();
const urlParams = location.search.substring(1).split("&");

urlParams.forEach(function(val, i) {
  let kv = val.split("="); // keyValue
  if (kv[0] !== "") {
    paramsObj[kv[0]] = kv[1];
  }
});

//ua
const setUa = navigator.userAgent;
let ua = "";
if (
  setUa.indexOf("iPhone") == -1 &&
  setUa.indexOf("Android") == -1 &&
  setUa.indexOf("iPad") == -1
) {
  //PC
  ua = "PC";
} else {
  ua = "SP";
}

// 本番機 開発機 data api URL
const thisUrl = location.href;
const env = thisUrl.match("dev") !== null ? "dev" : "prod";
const dataApiURL = {
  prod: "https://admin.zenyaku.co.jp/mt/mt-data-api.cgi/v3/",
  dev: "http://dev-admin.zenyaku.co.jp/mt/mt-data-api.cgi/v3/"
};



// グローバルナビ開閉
const gnavToggleTriggerArray = document.querySelectorAll(
  ".toggle-trigger.gloval-nav-btn__block"
);
const gnavToggleTargetArray = document.querySelectorAll(
  ".toggle-target.gloval-nav"
);

for (let i = 0; i < gnavToggleTriggerArray.length; i++) {
  toggle(gnavToggleTriggerArray[i], gnavToggleTargetArray[i]);
}

// サブナビ開閉
const gnavSubToggleTriggerArray = document.querySelectorAll(
  ".toggle-trigger.gloval-nav__item-inner"
);
const gnavSubToggleTargetArray = document.querySelectorAll(
  ".toggle-target.dropmenu"
);

for (let i = 0; i < gnavSubToggleTriggerArray.length; i++) {
  toggle(gnavSubToggleTriggerArray[i], gnavSubToggleTargetArray[i]);
}

// トグル
function toggle(trigger, target) {
  trigger.addEventListener("touchstart", function(event) {
    event.preventDefault();
    trigger.classList.toggle("open");
    target.classList.toggle("open");
  });
  trigger.addEventListener("click", function() {
    trigger.classList.toggle("open");
    target.classList.toggle("open");
  });
}

// 文字サイズ
//標準ボタンのHTML取得 
const BtnFontSizeNormal = document.getElementById("js-fs-normal");
//拡大ボタンのHTML取得
const BtnFontSizeLarge = document.getElementById("js-fs-large");
// htmlタグ取得
const RootTag = document.documentElement;

// 標準ボタン
BtnFontSizeNormal.addEventListener("click", function() {
  setFsReset();
  return false;
});
// 拡大ボタン
BtnFontSizeLarge.addEventListener("click", function() {
  setFsUp();
  return false;
});

function setFsUp() {
  RootTag.classList.add("is-fs-l");
  RootTag.classList.remove("is-fs-m");
  BtnFontSizeNormal.classList.remove("current");
  BtnFontSizeLarge.classList.add("current");
}

function setFsReset() {
  RootTag.removeAttribute("class");
  BtnFontSizeLarge.classList.remove("current");
  BtnFontSizeNormal.classList.add("current");
}

/* 
  新着情報フィルタリング
*/
// newsのフィルター名取得 .newsがある場合のみ
const isNews = document.querySelector(".news.is-archive") !== null;
const msg = "対象の記事は1件もありません";
if (isNews) {
  if (Object.keys(paramsObj).length !== 0) {
    //document.getElementById("btn-" + paramsObj["filter"]).classList.add("current");
    let selectClass = document.querySelectorAll(".data-" + paramsObj["filter"]);
    for (let i = 0; i < selectClass.length; i++) {
      selectClass[i].style.display = "block";
    }
  } else {
    // 全て
    //document.getElementById("btn-all").classList.add("current");
    allNews("block");
  }

  // ボタンでフィルタリング
  // const btn_news = document.querySelectorAll(".btn-news");
  // for (let i = 0; i < btn_news.length; i++) {
  //   btn_news[i].addEventListener("click", function() {
  //     for (let i = 0; i < btn_news.length; i++) {
  //       btn_news[i].classList.remove("current");
  //     }

  //     let thisId = this.getAttribute("id");
  //     document.getElementById(thisId).classList.add("current");
  //     // ニュース詳細全てdisplay none
  //     allNews("none");

  //     // 該当ニュースをdisplay block allか否か比較前提
  //     let setSelectClass =
  //       thisId === "btn-all"
  //         ? ".news__block"
  //         : "." + thisId.replace("btn-", "data-");
  //     let selectClass = document.querySelectorAll(setSelectClass);
  //     for (let i = 0; i < selectClass.length; i++) {
  //       selectClass[i].style.display = "block";
  //     }
  //     return false;
  //   });
  // }
}

function allNews(display) {
  const newsBlockClass = document.querySelectorAll(".news__block");
  for (let i = 0; i < newsBlockClass.length; i++) {
    newsBlockClass[i].style.display = display;
  }
}

// 一覧フィルタリング
const isk1ban = document.querySelector(".news.is-k1ban") !== null;
if (isk1ban) {
  const dataApiHealthURL = dataApiURL[env] + "search?search=field:news_category:%E5%81%A5%E5%BA%B7%E6%83%85%E5%A0%B1&limit=3";
  axios.get(dataApiHealthURL).then(function(response) {
    let html = "";
    let items = response.data.items;
    for (let i = 0; i < items.length; i++) {
      let t = Date.parse(items[i].date);
      html += '<div class="news__block is-top row">';
      html += '<div class="news__item col l3 s12">';
      html +=
        '<span class="date is-key is-mb-less">' + unixTime2ymd(t) + "</span>";
      html +=
        '<span class="label is-news is-health is-mb-less">健康情報</span>';
      html += "</div>";
      html +=
        '<div class="news__item col l9 s12"><a href="' +
        items[i].permalink +
        '" class="txt is-3">' +
        items[i].title +
        "</a></div>";
      html += "</div><!-- /.news__block -->";
    }
    document.querySelector(".news.is-k1ban").innerHTML = html;
  });
}

function unixTime2ymd(intTime) {
  var d = new Date(intTime);
  var year = d.getFullYear();
  var month = ("0" + (d.getMonth() + 1)).slice(-2);
  var day = ("0" + d.getDate()).slice(-2);

  return year + "/" + month + "/" + day;
}

/* 動画：CM */
const isCm = document.querySelector(".is-cm") !== null;
if (isCm) {
  cmSet();

  if (ua === "PC") {
    const btn_cm = document.querySelectorAll(".is-cm");
    const modal = document.querySelector(".cm-modal");
    const modalVideo = document.querySelector(".cm-modal__video");

    for (let i = 0; i < btn_cm.length; i++) {
      btn_cm[i].addEventListener("click", function() {
        let data = this.querySelector(".image");
        console.log(data.dataset.videoSrc);
        let html =
          '<video controls=""><source src="' +
          data.dataset.videoSrc +
          '"></video>';

        modalVideo.innerHTML = html;
        modal.style.display = "block";
        return false;
      });
    }

    document
      .querySelector(".cm-modal__bt-close")
      .addEventListener("click", function() {
        modal.style.display = "none";
      });
  }
}

// 動画 or poster セット
function cmSet() {
  // PCはposter画像をセット
  const cm = document.querySelectorAll(".is-cm .image");
  for (let i = 0; i < cm.length; i++) {
    let posterImgSrc = cm[i].dataset.videoPoster;
    let videoSrc = cm[i].dataset.videoSrc;
    let html = "";

    if (ua === "PC") {
      html += '<span class="cm-play"></span>';
      html += '<img src="' + posterImgSrc + '" />';
    } else {
      html +=
        '<video src="' +
        videoSrc +
        '" onclick="this.play();" controls="" controlslist="nodownload" poster="' +
        posterImgSrc +
        '" class="thumb is-video"></video>';
    }
    cm[i].innerHTML = html;
  }
}
