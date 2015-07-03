var promiseArray = [];
//var SERVER_URL = 'http://140.121.197.135:11116/';
var SERVER_URL = 'http://192.168.0.102:8080/';

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
      console.log('success get pack' + JSON.stringify(data));
      if (data.length !== 0) {
        localStorage.setItem(packId, JSON.stringify(data));
        callback();
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

function syncImg(files) {
  //upload image
  console.log(files);

  var i;
  for (i in files) {
    uploadImg(files[i].name, files[i].version_pack_id);
  }

  downloadServerImg();

}

function downloadServerImg() {
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
        var downloadDeffer = $.Deferred();
        promiseArray.push(downloadDeffer);
        FileNotExistThenDownload(packId, filesInVersion[fileIndex], downloadDeffer);
      }
    }
  }
}

function FileNotExistThenDownload(packId, filename, downloadDeffer) {
  //console.log('FileNotExistThenDownload:' + ' ' + packId + ' ' + versionId + ' ' + filename);
  var filePath = cordova.file.externalDataDirectory + packId + '/' + filename;
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
  var url = SERVER_URL + 'easylearn/download?pack_id=' +
    packId + '&filename=' + filename;
  console.log('downloadImgurl:' + url);

  downloadImgByUrl(url, packId, filename, function() {
    downloadDeffer.resolve();
  });
}

function uploadImg(filename, packId) {
  var uploadDeffer = $.Deferred();
  promiseArray.push(uploadDeffer);

  var failHandler = function(error) {
    fail(error);
    uploadDeffer.resolve();
  };

  var filePath = cordova.file.externalDataDirectory + packId + '/' + filename;
  console.log('filepath' + filePath);
  window.resolveLocalFileSystemURL(filePath, function(fileEntry) {
    console.log(fileEntry);
    fileEntry.file(function(file) {
      console.log(file);

      var reader = new FileReader();

      reader.onloadend = function() {
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
          success: function() {
            console.log('success upload img' + filename);
            uploadDeffer.resolve();
          },
          error: function(jqXHR, textStatus, errorThrown) {
            uploadDeffer.resolve();
            console.log('error');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          }
        });
      };

      reader.readAsDataURL(file);
    }, failHandler);
  }, failHandler);
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
        var pack = JSON.parse(localStorage.getItem(viewPackId));

        //get current note
        var comments = pack.version[viewPackVersion.index].note[viewNoteArrayIndex].comment = data;

        //update pack in localStorage
        localStorage.setItem(viewPackId, JSON.stringify(pack));
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
      promiseArray = [];
      console.log('[sync]all done');
      navigator.notification.activityStop();
    });
  }

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
      syncImg(data.sync.upload_file);

      //refresh home page
      refreshPage();


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


function refreshPage() {
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
