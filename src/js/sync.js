function changeModifyStroageTime(){
  var user = JSON.parse(localStorage.user);
  user.setting.last_sync_time = new Date().getTime();
  localStorage.setItem('user', JSON.stringify(user));
}

function postComment(noteId, newComment) {
  var jsonObj = JSON.stringify(newComment);
  $.ajax({
    type: "POST",
    url: 'http://140.121.197.135:11116/easylearn/comment',
    data: {
      noteId: noteId,
      newComment: jsonObj
    },
    success: function() {
      console.log('success post new comment');
    },
  });
}

function getComment(NoteId, lastestCreateTime) {
  //set url for get comment
  var url = 'http://140.121.197.135:11116/easylearn/comment?note_id=' +
    NoteId + '&lastest_create_time?=' + lastestCreateTime;

  $.ajax({
    type: "GET",
    url: url,
    success: function(data) {
      console('success get comment' + JSON.stringify(data));
      if (data !== {}) {
        displayComment(data);

        //get pack for comment content
        var pack = JSON.parse(localStorage.getItem(viewPackId));

        //get current note
        var currentNote = pack.version[viewPackVersion].note[viewNoteArrayIndex];

        //add new comment
        currentNote.comment.concat(newComment);

        //update pack in localStorage
        localStorage.setItem(viewPackId, JSON.stringify(pack));
      }
    }
  });
}

function sync() {
  var sendData = {
    user: JSON.parse(localStorage.user),
    folder: JSON.parse(localStorage.folder),
  };

  //get folder array
  var folderArray = JSON.parse(localStorage.folder);
  var i;
  for(i in folderArray){
    if(folderArray[i].name === 'All'){
      var j;
      var allPack = folderArray[i].pack;
      for(j in allPack){
        sendData[allPack[j]] = (JSON.parse(localStorage.getItem(allPack[j])));
      }
      break;
    }
  }

  console.log(sendDate);

  $.ajax({
    method: "POST",
    url: 'http://140.121.197.135:11116/easylearn/sync',
    data: {
      sync_data: JSON.stringify(json)
    },
  }).done(function(result) {
    console.log(result);
  });
}

function testLocalStorage() {
  var user = {
    "id": "00157016",
    "name": "Bernie",
    "setting": {
      "wifi_sync": true,
      "mobile_network_sync": true,
      "last_sync_time": 1429519614000
    }
  };

  var pack_id = {
    "cover_filename": "",
    "creator_user_id": "00157016",
    "create_time": 1428408016186,
    "name": "firstPackName",
    "is_public": false,
    "description": "description",
    "version": [{
      "creator_user_id": "00157016",
      "bookmark": [{
        "name": "name",
        "id": "ff",
        "position": 123
      }],
      "note": [{
        "color": 1,
        "create_time": 1428408016186,
        "user_id": "00157016",
        "comment": [{
          "create_time": 1428408016186,
          "name": "Bernie",
          "id": "commentId",
          "content": "commentContent"
        }],
        "id": "noteId",
        "content": "content"
      }],
      "file": [{
        "filename": "filename"
      }],
      "create_time": 1428408016186,
      "is_public": false,
      "id": "versionId",
      "content": "vvery_long_content"
    }],
    "tags": "tagsJsonArray"
  };

  var pack_id2 = {
    "cover_filename": "",
    "creator_user_id": "00157016",
    "create_time": 1428408016186,
    "name": "Chrome",
    "is_public": false,
    "description": "Google Chrome is a free, open-source web browser. Released in 2008.",
    "version": [{
      "creator_user_id": "00157016",
      "bookmark": [{
        "name": "name",
        "id": "ff",
        "position": 123
      }],
      "note": [],
      "file": [],
      "create_time": 1428408016186,
      "is_public": false,
      "id": "versionId",
      "content": "<p>Google Chrome是一個由Google開發的網頁瀏覽器。「Chrome」是化學元素「鉻」的英文名稱；過去也用Chrome稱呼瀏覽器的外框，中文名曾短暫地用過「鉻瀏覽器」。相應的開源計劃名為Chromium，其採用BSD授權條款授權並開放原始碼，但Google Chrome本身是非自由軟體，也未開放原始碼。[7] 截至2014年7月，StatCounter調查報告中，稱Chrome的市場佔有率已經升至45%，超越Internet Explorer和Mozilla Firefox成為全球第一大瀏覽器。[8] 但是，另一家市調機構Net Applications的調查報告中顯示，Internet Explorer的市佔率仍然較Chrome更高。其程式碼是基於其他開放原始碼軟體所撰寫，包括WebKit和Mozilla基金會，並開發出稱為「V8」的高效能JavaScript引擎。[9]「Google Chrome」的整體發展目標是提升穩定性、速度和安全性，並創造出簡單且有效率的用戶介面[10]。CNET旗下的Download.com網站評出的2008年6月最佳Windows應用程式，其中「Google Chrome」排名首位。[11]</p> <h1>歷史</h1> <p> Google執行長艾立克·史密特（Eric Schmidt）當初曾有六年時間反對開發自家網頁瀏覽器。他說：\"當時Google還是一家小公司。\"\"他不想再經歷激烈的瀏覽器大戰了。\"但是看到聯合創始人謝爾蓋·布魯（Sergey Brin）和賴利·佩吉（Larry Page）聘用了一些Mozilla Firefox的開發人員完成Chrome瀏覽器的原型後[12]，史密特坦承：\"它太棒了，我不得不改變自己的看法。\"[13] 官方的正式宣佈原本預定在2008年9月3日舉行，並將寄給記者和部落格一則解說新瀏覽器特色和研發動機的漫畫，該漫畫由史考特·邁克勞德（Scott McCloud）所繪製，並在創用CC的「姓名標示-非商業性-禁止改作2.5」版權協議下發行[14]。由於要送往歐洲的信件提早寄出，因此德國「Google Blogoscoped」部落格的作者菲利普·藍森（Philipp Lenssen）[15]在2008年9月1日收到漫畫後就掃描並放上自己的網站[16]。隨後Google就將這則漫畫放到Google Books和Google網站上[17]，並在自家的部落格中說明了提早釋出的原因[10]。</p> <h1>發布</h1> <p>Google官方部落格在2008年9月2日撰文說，將於第二天在超過100個國家同時發布「Google Chrome」的測試版。[18] 同日，Google官方部落格宣布「Google Chrome」測試版已經開放下載。[19] 首次發布的第一個測試版本僅提供43種語言版本，並只適用於Microsoft Windows XP SP2以上版本[19]，同年12月11日正式發布第一個穩定版本[來源請求]。 2009年6月5日，正式發布首個在Mac和Linux操作系統的開發者預覽版本[20]，同年12月正式發布第一個同時支援Windows，Mac OS X和Linux操作系統的測試版[21] [22][23][24]。2010年5月25日發布的5.0版是第一個同時支援該3個操作系統的穩定版本[25]。 2010年，「Google Chrome」是提供給歐洲經濟區Microsoft Windows用戶的12個瀏覽器中其中一個[26]。 在2012年2月，Google釋出了Chrome for Android 測試版，該軟體只能在Android 4.0以上系統上執行。6月28日，Chrome for Android正式在Google Play上釋出。第二天，即6月29日，Chrome for iOS在App Store上架，可免費安裝，標誌著「Google Chrome」全面進軍行動平台。 2013年1月11日，Chrome Beta for Android提供了Google Play入口，[27]可以點選此處進入。</p>"
    }],
    "tags": "tagsJsonArray"
  };

  var pack1428407706975 = {
    "creator_user_id": "00157016",
    "create_time": 1428408016186,
    "name": "炸油檢測疑未落實 摩斯：了解處理",
    "is_public": true,
    "description": "食安問題多，速食業者提出自主油品檢測盼民眾吃的安心。",
    "tags": "食安",
    "cover_filename": "1428407811333.jpg",
    "version": [{
      "creator_user_id": "00157016",
      "bookmark": [],
      "note": [{
        "id": "note1428407991262",
        "content": "有可能這麼勤勞嗎",
        "user_id": "00157016",
        "user_name": "Bernie",
        "create_time": 1428408016186,
        "comment": [{
          "id": "comment1428408060151",
          "content": "沒圖沒真相",
          "create_time": 1428408060151,
          "user_id": "00157016",
          "user_name": "Bernie"
        }]
      }],
      "file": [],
      "create_time": 1428408016186,
      "is_public": true,
      "id": "version1428407903953",
      "content": "<p class=\"first\" id=\"yui_3_9_1_1_1428407726192_209\" style=\"margin-bottom: 0px; padding: 0px; line-height: 27.972000122070313px; font-size: 15px; font-family: arial, STHeiti, pmingliu, sans-serif !important;\">（中央社記者張茗喧台北7日電）食安問題多，速食業者提出自主油品檢測盼民眾吃的安心。但今天爆發四大速食業者油品檢驗不落實，其中摩斯漢堡甚至出現油品檢測「預填」狀況，摩斯漢堡表示會進一步了解處理。</p><p style=\"margin-top: 11px; margin-bottom: 0px; padding: 0px; line-height: 27.972000122070313px; font-size: 15px; font-family: arial, STHeiti, pmingliu, sans-serif !important;\">2009年曾爆發速食業者的炸油驗出酸價、砷含量超標，隨後衛生福利部要求業者必須自主管理進行油品檢測；不過，今天卻有媒體報導，台灣四大速食業者麥當勞、摩斯、肯德基和漢堡王在油品檢測表上都有缺失，尤其摩斯漢堡不僅沒有填檢測表，甚至有補填、預填的情況，引發網友批評。</p><p style=\"margin-top: 11px; margin-bottom: 0px; padding: 0px; line-height: 27.972000122070313px; font-size: 15px; font-family: arial, STHeiti, pmingliu, sans-serif !important;\">摩斯漢堡今天上午發聲明稿指出，每天只有在營業前及營業中的離峰時間才會進行油品檢測，將了解是否有未按規定填表的狀況，進行懲處。</p><p><br></p><p style=\"margin-top: 11px; margin-bottom: 0px; padding: 0px; line-height: 27.972000122070313px; font-size: 15px; font-family: arial, STHeiti, pmingliu, sans-serif !important;\">麥當勞表示，每天會<span class=\"note note-teal\" noteid=\"note1428407991262\">進行2次炸油檢測</span>並且公布在點餐櫃檯附近，強調比政府的換油標準更嚴格；肯德基則指出，表格設計以民眾可以簡單看得懂為主；漢堡王則表示，因衛福部沒有強制規定要公開，但若其他業者都有公開，也會考慮跟進。</p><div class=\"video-container\" youtube=\"0\"><iframe width=\"560\" height=\"315\" src=\"http://www.youtube.com/embed/EN3IonBXxnE?controls=1&amp;disablekb=1&amp;modestbranding=1&amp;showinfo=0&amp;rel=0\" frameborder=\"0\" allowfullscreen=\"\"></iframe></div>"
    }]
  };

  var folder = [{
    "name": "All",
    "id": "folderId",
    "pack": [
      "pack_id",
      "pack_id2",
      "pack1428407706975"
    ]
  }, {
    "name": "我的最愛",
    "id": "fjoeiwjowfe",
    "pack": [
      "pack_id"
    ]
  }];

  localStorage.user = JSON.stringify(user);
  localStorage.folder = JSON.stringify(folder);
  localStorage.pack_id = JSON.stringify(pack_id);
  localStorage.pack_id2 = JSON.stringify(pack_id2);
  localStorage.pack1428407706975 = JSON.stringify(pack1428407706975);

  var send = {
    user: JSON.parse(localStorage.user),
    folder: JSON.parse(localStorage.folder),
    pack_id: JSON.parse(localStorage.pack_id),
    pack_id2: JSON.parse(localStorage.pack_id2),
    pack1428407706975: JSON.parse(localStorage.pack1428407706975),
  };

  console.log(JSON.stringify(send));
}
