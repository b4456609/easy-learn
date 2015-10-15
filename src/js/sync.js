var promiseArray = [];
//var SERVER_URL = 'http://140.121.197.135:11116/';
 var SERVER_URL = 'http://192.168.5.100:8080/';
var ImgurAuth = 'Client-ID 3cda8943e794d34';

function fileDataUpload(id, deletehash) {
  $.ajax({
    url: SERVER_URL + 'easylearn/file_data',
    type: 'POST',
    data: {
      id: id,
      deletehash: deletehash
    },
    success: function() {
      console.log('[fileDataUpload]success');
    },
    error: function() {
      console.log('[fileDataUpload]fail');
    }
  });
}

function uploadImgUseBase64(data, callback) {
  console.log('[uploadImgUseBase64]start');
  if (navigator.network.connection.type == Connection.NONE) {
    navigator.notification.alert(
      '需要網路才能使用此功能', // message
      null, // callback
      '錯誤', // title
      '確定' // buttonName
    );
  }

  $.ajax({
    xhr: function() {
      var xhr = new window.XMLHttpRequest();
      //Upload progress
      xhr.upload.addEventListener("progress", function(evt) {
        if (evt.lengthComputable) {
          var percentComplete = evt.loaded / evt.total;
          //Do something with upload progress
          console.log(percentComplete);
        }
      }, false);
      //Download progress
      xhr.addEventListener("progress", function(evt) {
        if (evt.lengthComputable) {
          var percentComplete = evt.loaded / evt.total;
          //Do something with download progress
          console.log(percentComplete);
        }
      }, false);
      return xhr;
    },
    url: 'https://api.imgur.com/3/image',
    type: 'POST',
    headers: {
      Authorization: ImgurAuth,
      Accept: 'application/json'
    },
    data: {
      image: data,
      type: 'base64',
      album: "dvtm9wHkgA5cbZa"
    },
    success: function(result) {
      console.log('[uploadImgUseBase64]success', result);
      if (result.success === true) {
        var item = {
          id: result.data.id,
          link: result.data.link,
          deletehash: result.data.deletehash
        };
        fileDataUpload(item.id, item.deletehash);

        callback(item);
      } else {
        console.log('[uploadImgUseBase64]imgeHostFail', result);
        navigator.notification.alert(
          '圖片伺服器錯誤，請稍後再重試', // message
          null, // callback
          '錯誤', // title
          '確定' // buttonName
        );
      }
    },
    error: function(e, s, t) {
      console.log('[uploadImgUseBase64]Fail');
      console.log(e, s, t);
      navigator.notification.alert(
        '上傳圖片失敗，請稍後再重試', // message
        null, // callback
        '錯誤', // title
        '確定' // buttonName
      );
    }
  });
}


function uploadImgUseUrl(imgUrl, callback) {
  console.log('[uploadImgUseUrl]start');
  if (navigator.network.connection.type == Connection.NONE) {
    navigator.notification.alert(
      '需要網路才能使用此功能', // message
      null, // callback
      '錯誤', // title
      '確定' // buttonName
    );
    return;
  }

  $.ajax({
    url: 'https://api.imgur.com/3/image',
    type: 'POST',
    headers: {
      Authorization: ImgurAuth,
      Accept: 'application/json'
    },
    data: {
      image: imgUrl,
      type: 'URL',
      album: "dvtm9wHkgA5cbZa"
    },
    success: function(result) {
      console.log('[uploadImgUseUrl]success', result);
      if (result.success === true) {
        var item = {
          id: result.data.id,
          link: result.data.link,
          deletehash: result.data.deletehash
        };
        fileDataUpload(item.id, item.deletehash);

        callback(item);
      } else {
        console.log('[uploadImgUseUrl]imgeHostFail', result);
        navigator.notification.alert(
          '圖片伺服器錯誤，請稍後再重試', // message
          null, // callback
          '錯誤', // title
          '確定' // buttonName
        );
      }
    },
    error: function(e, s, t) {
      console.log('[uploadImgUseUrl]Fail');
      console.log(e, s, t);
      navigator.notification.alert(
        '上傳圖片失敗，請稍後再重試', // message
        null, // callback
        '錯誤', // title
        '確定' // buttonName
      );
    }
  });
}

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
    success: function(data) {
      console.log('success get pack');
      if (data.length !== 0) {
        localStorage.setItem(packId, JSON.stringify(data));
        callback();
        downloadServerImg();
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('error');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    }
  });
}

function downloadServerImg() {
  promiseArray = [];
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
  //user defer object
  var downloadDeffer = $.Deferred();
  promiseArray.push(downloadDeffer);

  var filePath = FILE_STORAGE_PATH + packId + '/' + filename;
  window.resolveLocalFileSystemURL(filePath, function() {
    console.log('[FileNotExistThenDownload]FileExist:finished');
    downloadDeffer.resolve();
  }, function(error) {
    console.log('[FileNotExistThenDownload]FileNotExist:' + ' ' + error.code + ' ' + packId + ' ' + filename);
    //first in to download show loading message
    downloadImg(filename, packId, downloadDeffer);
  });
}


function downloadImg(filename, packId, downloadDeffer) {
  var url = 'http://i.imgur.com/' + filename;
  console.log('[downloadImg]url:' + url);

  var success = function() {
    downloadDeffer.resolve();
  };

  var fail = function() {
    downloadDeffer.resolve();
    console.log('[downloadImg]:fail');
  };

  downloadImgByUrl(url, packId, filename, success, fail);
}

//comment instant sync handler
function postDeviceId(userId, deviceId) {
  if (navigator.network.connection.type == Connection.NONE) {
    return;
  }
  $.ajax({
    type: "POST",
    url: SERVER_URL + 'easylearn/device',
    data: {
      user_id: userId,
      device_id: deviceId
    },
    success: function() {
      console.log('success post device');
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('error');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    }
  });
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
    success: function() {
      console.log('success post new comment');
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('error');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    }
  });
}

function getComment(NoteId) {
  //set url for get comment
  var url = SERVER_URL + 'easylearn/comment?note_id=' +
    NoteId;
  console.log(url);
  $.ajax({
    type: "GET",
    url: url,
    success: function(data) {
      console.log('success get comment');
      console.log(data);
      if (data.length !== 0) {
        displayComment(data);

        //get pack for comment content
        var pack = JSON.parse(localStorage.getItem(viewStorage.getViewPackId()));

        //get current note
        var comments = pack.version[viewStorage.versionIndex].note[viewNoteArrayIndex].comment = data;

        //update pack in localStorage
        localStorage.setItem(viewStorage.getViewPackId(), JSON.stringify(pack));
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log('error');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    }
  });
}
// check if the situation can sync
function canSync() {
  //check setting and compare to network state
  var networkState = navigator.connection.type;
  var user = new User();
  var wifi = user.setting.wifi_sync;
  var mobile_network = user.setting.mobile_network_sync;

  if (wifi === false && Connection.WIFI === networkState) {
    return false;
  } else if (mobile_network === false && Connection.CELL === networkState) {
    return false;
  }

  return true;
}

function sync() {
  navigator.notification.activityStart('同步中', '請稍後...');

  //reset promise
  promiseArray = [];
  var syncDeffer = $.Deferred();
  promiseArray.push(syncDeffer);

  var defferedFinish = function() {
    //promise array downloadImg and upload img and sync operation
    $.when.apply($, promiseArray).done(function() {
      //force to reload img
      $("img").ForceReload();
      promiseArray = [];
      console.log('[sync]all done');
      navigator.notification.activityStop();
    });
  };

  if (!canSync()) {
    $('#sync').text(navigator.connection.type + '狀態下不同步');
    return;
  }

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

  var syncAjax = $.ajax({
    method: "POST",
    url: SERVER_URL + 'easylearn/sync',
    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
    data: {
      sync_data: JSON.stringify(sendData)
    },
  });

  //success
  syncAjax.done(function(data) {
    syncDeffer.resolve();
    console.log('success sync');
    console.log(data);

    if (data.sync.status === 'success') {
      //save DB data to local storage
      saveToLocalStorage(data);

      //sync image
      downloadServerImg();

      //refresh home page
      refreshHomePage();


    } else if (data.sync.status === 'conflict') {
      //decide To Replace
      $("#sync_conflict_popup").popup("open", {
        history: false
      });
      //the user will decide Replace or keep;
      // onclick will handle
    } else {
      //deal with sync fail
    }
    $('#sync').text('同步');

    defferedFinish();
  });

  //fail
  syncAjax.fail(function(xhr, textStatus, error) {
    syncDeffer.resolve();
    console.log(xhr.statusText);
    console.log(textStatus);
    console.log(error);
    $('#sync').text('同步失敗');

    defferedFinish();
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


function refreshHomePage() {
  //refresh every visit home page
  display_pack();

  //update count in panel page
  display_folder();
}

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

(function($){
$.fn.ForceReload = function(UserSettings){

    // Settings
    var Settings = $.extend({
        Hash: new Date().getTime()
    }, UserSettings);

    // Image iteration
    this.each(function(){
        var _this = $(this);
        var img = _this.clone();
        var src = img.attr("src");
        img.attr("src", src + (src.indexOf("?") > -1 ? "&" : "?") + "hash=" + Settings.Hash).one("load", function(){
            _this.after(img);
            _this.remove();
        });
    });
}
}(jQuery));
