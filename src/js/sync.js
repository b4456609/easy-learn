var uploadImgCount = 0;
var uploadTotal = 0;
var downloadCount = 0;
var downloadTotal = 0;
//var SERVER_URL = 'http://140.121.197.135:11116/';
var SERVER_URL = 'http://192.168.1.121:8080/';

function getPack(packId, callback) {
  var user = new User();
  var url = SERVER_URL + 'easylearn/pack';
  
  console.log(url);
  
  $.ajax({
    type: "GET",
    url: url,
    data: {
      user_id: user.id,
      pack_id: packId
    },
    success: function (data) {
      console.log('success get pack' + JSON.stringify(data));
      if (data.length !== 0) {
        localStorage.setItem(packId, JSON.stringify(data));
        callback();
      }
    }
  });
}

function syncImg(files) {

  //upload image
  console.log(files);
  uploadImgCount = 0;
  uploadTotal = files.length;

  var i;
  for (i in files) {
    uploadImg(files[i].name, files[i].version_pack_id);
  }

  downloadServerImg();

  if (uploadImgCount == uploadTotal && downloadCount == downloadTotal) {
    $.mobile.loading("hide");
  }

}

function downloadServerImg() {
  //initial variable
  downloadCount = 0;
  downloadTotal = 0;

  //download image sync
  for (var i = 0; i < localStorage.length; i++) {
    //get pack id and object
    var packId = localStorage.key(i);

    //doesn't contain img file so jump
    if (packId === 'user') {
      continue;
    }
    if (packId === 'folder') {
      continue;
    }

    var packObj = JSON.parse(localStorage.getItem(packId));

    //download cover file
    if (packObj.cover_filename !== '') {
      FileNotExistThenDownload(packId, packObj.cover_filename);
    }

    //get pack's version
    var packVersion = packObj.version;

    for (var j in packVersion) {
      var filesInVersion = packVersion[j].file;
      //console.log('packVersion for' + packId + ' ' + versionId + ' ' + filesInVersion);
      //console.log(filesInVersion);
      for (var fileIndex in filesInVersion) {
        FileNotExistThenDownload(packId, filesInVersion[fileIndex]);
      }
    }
  }
}

function FileNotExistThenDownload(packId, filename) {
  //console.log('FileNotExistThenDownload:' + ' ' + packId + ' ' + versionId + ' ' + filename);
  var filePath = cordova.file.externalDataDirectory + packId + '/' + filename;
  window.resolveLocalFileSystemURL(filePath, function (fileEntry) { }, function (error) {
    if (downloadTotal === 0) {
      $.mobile.loading("show", {
        text: "下載圖片中",
        textVisible: true,
        theme: "z",
        html: ""
      });
    }
    downloadTotal++;
    console.log('checkFileExist:' + ' ' + error.code + ' ' + packId + ' ' + filename);
    //first in to download show loading message
    downloadImg(filename, packId);
  });
}


function downloadImg(filename, packId) {
  var url = SERVER_URL + 'easylearn/download?pack_id=' +
    packId + '&filename=' + filename;
  console.log('downloadImgurl:' + url);

  downloadImgByUrl(url, packId, filename, function () {
    downloadCount++;
    if (downloadCount === downloadTotal) {
      $.mobile.loading("hide");
    }
  });
}

function uploadImg(filename, packId) {
  var filePath = cordova.file.externalDataDirectory + packId + '/' + filename;
  console.log('filepath' + filePath);
  window.resolveLocalFileSystemURL(filePath, function (fileEntry) {
    console.log(fileEntry);

    fileEntry.file(function (file) {
      console.log(file);

      var reader = new FileReader();

      reader.onloadend = function () {
        var srcdata = reader.result;
        console.log(srcdata);
        $.ajax({
          type: "POST",
          url: SERVER_URL + "easylearn/upload",
          data: {
            file: srcdata,
            filename: filename,
            pack_id: packId
          },
          cache: false,
          contentType: "application/x-www-form-urlencoded",
          success: function () {
            console.log('success upload img');
            uploadImgCount++;
            //hide for upload img
            if (uploadImgCount === uploadTotal) {
              $.mobile.loading("hide");
            }
          }
        });
      };

      reader.readAsDataURL(file);
    }, fail);
  }, fail);
}


//change last sync time to indicate newer data
function changeModifyStroageTime() {
  var user = JSON.parse(localStorage.user);
  user.setting.last_sync_time = (new Date().getTime()) + 30000;
  localStorage.setItem('user', JSON.stringify(user));
}

//comment instant sync handler
function postComment(noteId, newComment) {
  var jsonObj = JSON.stringify(newComment);
  $.ajax({
    type: "POST",
    url: SERVER_URL + 'easylearn/comment',
    data: {
      noteId: noteId,
      newComment: jsonObj
    },
    success: function () {
      console.log('success post new comment');
    },
  });
}

function getComment(NoteId, lastestCreateTime) {
  //set url for get comment
  var url = SERVER_URL + 'easylearn/comment?note_id=' +
    NoteId + '&lastest_create_time=' + lastestCreateTime;
  console.log(url);
  $.ajax({
    type: "GET",
    url: url,
    success: function (data) {
      console.log('success get comment' + JSON.stringify(data));
      if (data.length !== 0) {
        displayComment(data);

        //get pack for comment content
        var pack = JSON.parse(localStorage.getItem(viewPackId));

        //get current note
        var comments = pack.version[viewPackVersion.index].note[viewNoteArrayIndex].comment;

        //add new comment
        //currentNote.comment.concat(data);
        for (var i in data) {
          comments[comments.length] = data[i];
        }
        //update pack in localStorage
        localStorage.setItem(viewPackId, JSON.stringify(pack));
      }
    }
  });
}

function sync() {
  $('#sync').text('同步中...');

  var sendData = {
    user: JSON.parse(localStorage.user),
    folder: JSON.parse(localStorage.folder),
  };

  //get folder array
  var folderArray = JSON.parse(localStorage.folder);
  var i;
  for (i in folderArray) {
    if (folderArray[i].name === 'All' || folderArray[i].name === '全部的懶人包') {
      var j;
      var allPack = folderArray[i].pack;
      for (j in allPack) {
        if (!sendData.hasOwnProperty(allPack[j])) {
          sendData[allPack[j]] = (JSON.parse(localStorage.getItem(allPack[j])));
        }
      }
      break;
    }
  }

  console.log(sendData);

  var sync = $.ajax({
    method: "POST",
    url: SERVER_URL + 'easylearn/sync',
    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
    data: {
      sync_data: JSON.stringify(sendData)
    },
  });
  
  //success
  sync.done(function (data) {
    console.log('success sync');
    console.log(data);

    if (data.sync.status === 'success') {
      //save DB data to local storage
      saveToLocalStorage(data);
        
      //sync image
      syncImg(data.sync.upload_file);

      //refresh home page
      refreshPage();
    } else if (data.sync.status === 'conflict') {
      //decide To Replace
      $("#sync_conflict_popup").popup("open", { history: false });
      //the user will decide Replace or keep;
      // onclick will handle
    }
    else {
      //deal with sync fail
    }
    $('#sync').text('同步');
  });
  
  //fail
  sync.fail(function (xhr, textStatus, error) {
    console.log(xhr.statusText);
    console.log(textStatus);
    console.log(error);
    $('#sync').text('同步失敗');
  });
}
function saveToLocalStorage(data) {
  console.log('saveInLocalStroage');
  //get object's key
  var keys = Object.keys(data);

  for (var i in keys) {
    if (keys[i] === 'setting') {
      var user = JSON.parse(localStorage.user);
      user.setting = data[keys[i]];
      localStorage.setItem('user', JSON.stringify(user));
    } else if (keys[i] !== 'sync') {
      localStorage.setItem(keys[i], JSON.stringify(data[keys[i]]));
    }
  }
}

function replace_data() {
  // modified setting to let server is old version not conflict
  var user = new User();
  user.modifiedFalse();
  //do sync again should be normal
  sync();
}


function refreshPage() {
  //refresh every visit home page
  display_pack();

  //update count in panel page
  display_folder();
}

$(document).on("click", ".show-page-loading-msg", function () {
  var $this = $(this),
    theme = $this.jqmData("theme") || $.mobile.loader.prototype.options.theme,
    msgText = $this.jqmData("msgtext") || $.mobile.loader.prototype.options.text,
    textVisible = $this.jqmData("textvisible") || $.mobile.loader.prototype.options.textVisible,
    textonly = !!$this.jqmData("textonly");
  html = $this.jqmData("html") || "";
  $.mobile.loading("show", {
    text: msgText,
    textVisible: textVisible,
    theme: theme,
    textonly: textonly,
    html: html
  });
})
  .on("click", ".hide-page-loading-msg", function () {
  $.mobile.loading("hide");
});

function checkConnection() {
  var networkState = navigator.connection.type;

  var states = {};
  states[Connection.UNKNOWN] = 'Unknown connection';
  states[Connection.ETHERNET] = 'Ethernet connection';
  states[Connection.WIFI] = 'WiFi connection';
  states[Connection.CELL_2G] = 'Cell 2G connection';
  states[Connection.CELL_3G] = 'Cell 3G connection';
  states[Connection.CELL_4G] = 'Cell 4G connection';
  states[Connection.CELL] = 'Cell generic connection';
  states[Connection.NONE] = 'No network connection';

  alert('Connection type: ' + states[networkState]);
}