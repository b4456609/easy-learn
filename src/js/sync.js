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

function test_prepare_data() {
  var data;

  var json = JSON.stringify(data);
  console.log(json);

  $.ajax({
    method: "POST",
    url: 'http://140.121.197.135:11116/easylearn/sync',
    data: {
      sync_data: json
    },
  }).done(function(result) {
    console.log(result);
  });
}

function testLocalStorage() {
  var user = {
    "id": "00157016",
    "name": "bernie",
    "setting": {
      "wifi_sync": true,
      "mobile_network_sync": true,
      "last_sync_time": "2015-04-22 21:30:29.0"
    }
  };

  var pack_id = {
    "cover_filename": null,
    "creator_user_id": "00157016",
    "create_time": "2015-03-19 21:43:10.0",
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
        "create_time": "2015-03-19 21:30:29.0",
        "user_id": "00157016",
        "comment": [{
          "create_time": "2015-03-19 21:30:29.0",
          "name": "bernie",
          "id": "commentId",
          "content": "commentContent"
        }],
        "id": "noteId",
        "content": "content"
      }],
      "file": [{
        "filename": "filename"
      }],
      "create_time": "2015-03-19 21:30:29.0",
      "is_public": false,
      "id": "versionId",
      "content": "vvery_long_content"
    }],
    "tags": "tagsJsonArray"
  };

  var pack_id2 = {
    "cover_filename": null,
    "creator_user_id": "00157016",
    "create_time": "2015-03-19 21:43:10.0",
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
      "create_time": "2015-03-19 21:30:29.0",
      "is_public": false,
      "id": "versionId",
      "content": '<p>Google Chrome是一個由Google開發的網頁瀏覽器。「Chrome」是化學元素「鉻」的英文名稱；過去也用Chrome稱呼瀏覽器的外框，中文名曾短暫地用過「鉻瀏覽器」。相應的開源計劃名為Chromium，其採用BSD授權條款授權並開放原始碼，但Google Chrome本身是非自由軟體，也未開放原始碼。[7] 截至2014年7月，StatCounter調查報告中，稱Chrome的市場佔有率已經升至45%，超越Internet Explorer和Mozilla Firefox成為全球第一大瀏覽器。[8] 但是，另一家市調機構Net Applications的調查報告中顯示，Internet Explorer的市佔率仍然較Chrome更高。其程式碼是基於其他開放原始碼軟體所撰寫，包括WebKit和Mozilla基金會，並開發出稱為「V8」的高效能JavaScript引擎。[9]「Google Chrome」的整體發展目標是提升穩定性、速度和安全性，並創造出簡單且有效率的用戶介面[10]。CNET旗下的Download.com網站評出的2008年6月最佳Windows應用程式，其中「Google Chrome」排名首位。[11]</p>                <h1>歷史</h1>                <p>                  Google執行長艾立克·史密特（Eric Schmidt）當初曾有六年時間反對開發自家網頁瀏覽器。他說："當時Google還是一家小公司。""他不想再經歷激烈的瀏覽器大戰了。"但是看到聯合創始人謝爾蓋·布魯（Sergey Brin）和賴利·佩吉（Larry Page）聘用了一些Mozilla Firefox的開發人員完成Chrome瀏覽器的原型後[12]，史密特坦承："它太棒了，我不得不改變自己的看法。"[13] 官方的正式宣佈原本預定在2008年9月3日舉行，並將寄給記者和部落格一則解說新瀏覽器特色和研發動機的漫畫，該漫畫由史考特·邁克勞德（Scott            McCloud）所繪製，並在創用CC的「姓名標示-非商業性-禁止改作2.5」版權協議下發行[14]。由於要送往歐洲的信件提早寄出，因此德國「Google Blogoscoped」部落格的作者菲利普·藍森（Philipp Lenssen）[15]在2008年9月1日收到漫畫後就掃描並放上自己的網站[16]。隨後Google就將這則漫畫放到Google Books和Google網站上[17]，並在自家的部落格中說明了提早釋出的原因[10]。</p>                <h1>發布</h1>          <p>Google官方部落格在2008年9月2日撰文說，將於第二天在超過100個國家同時發布「Google Chrome」的測試版。[18] 同日，Google官方部落格宣布「Google Chrome」測試版已經開放下載。[19] 首次發布的第一個測試版本僅提供43種語言版本，並只適用於Microsoft Windows XP SP2以上版本[19]，同年12月11日正式發布第一個穩定版本[來源請求]。 2009年6月5日，正式發布首個在Mac和Linux操作系統的開發者預覽版本[20]，同年12月正式發布第一個同時支援Windows，Mac            OS X和Linux操作系統的測試版[21] [22][23][24]。2010年5月25日發布的5.0版是第一個同時支援該3個操作系統的穩定版本[25]。 2010年，「Google Chrome」是提供給歐洲經濟區Microsoft Windows用戶的12個瀏覽器中其中一個[26]。 在2012年2月，Google釋出了Chrome for Android 測試版，該軟體只能在Android 4.0以上系統上執行。6月28日，Chrome for Android正式在Google            Play上釋出。第二天，即6月29日，Chrome for iOS在App Store上架，可免費安裝，標誌著「Google Chrome」全面進軍行動平台。 2013年1月11日，Chrome Beta for Android提供了Google Play入口，[27]可以點選此處進入。</p>',
    }],
    "tags": "tagsJsonArray"
  };

  var folder = [{
    "name": "All",
    "id": "folderId",
    "pack": ["pack_id", "pack_id2"]
  }, {
    "name": "我的最愛",
    "id": "fjoeiwjowfe",
    "pack": ["pack_id"]
  }];

  localStorage.user = JSON.stringify(user);
  localStorage.folder = JSON.stringify(folder);
  localStorage.pack_id = JSON.stringify(pack_id);
  localStorage.pack_id2 = JSON.stringify(pack_id2);
}
