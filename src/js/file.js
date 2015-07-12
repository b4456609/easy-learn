function addFileToPack(packId, fileEntry, callback) {
  var time = new Date().getTime();
  window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dirEntry) {
    dirEntry.getDirectory(packId, {
      create: true
    }, function(destDirEntry) {
      fileEntry.moveTo(destDirEntry, time + '.jpg');
      //add to pack's cover
      if (NEW_PACK !== null) {
        NEW_PACK.cover_filename = time + '.jpg';
      }
      destDirEntry.getFile(time + '.jpg', {
        create: false
      }, function(fileEntry) {
        callback(fileEntry);
      }, fail);
    }, fail);
  }, fail);
}

function getImgNode(packId, fileName, callback) {

  var path = cordova.file.externalDataDirectory + packId + '/' + fileName;

  window.resolveLocalFileSystemURL(path, function(fileEntry) {
    fileEntry.file(function(file) {
      var img = document.createElement("img");

      var reader = new FileReader();
      reader.onloadend = function() {
        img.src = reader.result;
        img.style["z-index"] = 1;
        img.style.width = '100%';
        return callback(packId, img);
      };
      reader.readAsDataURL(file);
    }, fail);
  }, fail);
}

function downloadImgByUrl(url, packId, prefixOrName, callback, errorCallback) {
  var fileTransfer = new FileTransfer();
  var uri = encodeURI(url);
  var time = new Date().getTime();
  var filename;
  //set file path
  var filepath;
  if (prefixOrName.indexOf('jpg') > 0) {
    filepath = cordova.file.externalDataDirectory + packId + '/' + prefixOrName;
    filename = prefixOrName;
  } else {
    filepath = cordova.file.externalDataDirectory + packId + '/' + prefixOrName + time + '.jpg';
    filename = prefixOrName + time + '.jpg';
  }

  fileTransfer.download(
    uri,
    filepath,
    function(entry) {
      //add to version's file
      editingFile[editingFile.length] = filename;
      console.log("download complete: " + entry.toURL());
      callback(entry);
    },
    function(error) {
      console.log("download error source " + error.source);
      console.log("download error target " + error.target);
      console.log("upload error code" + error.code);
      typeof errorCallback === 'function' && errorCallback();
    },
    false
  );
}

function displayPackImg(viewPackId, imgNode, imgName) {
  var path = cordova.file.externalDataDirectory + viewPackId + '/' + imgName;
  console.log(path);
  //console.log(imgNode);

  window.resolveLocalFileSystemURL(path, function(fileEntry) {
    console.log('getFileEntry');
    fileEntry.file(function(file) {

      var reader = new FileReader();
      reader.onloadend = function() {
        imgNode.attr('src', reader.result);
      };

      imgNode.attr('width', '100%');
      reader.readAsDataURL(file);

    }, fail);
  }, fail);
}

function fail(error) {
  console.log('FileSystem Error:' + error.code);
}

function export_data() {
  //start loading spinner
  navigator.notification.activityStart('', '輸出中');
  $('#export_popup').popup('close');

  //prepare zip file
  var zip = new JSZip();

  //generate localstroage data to zip file
  for (var key in localStorage) {
    zip.file(key + '.json', localStorage.getItem(key));
  }

  //get image into zip file
  var executeTimes;
  var dirArray = [];
  var dirFullArray = [];


  //zip file name
  var time = new Date();
  var filename = formatDate(time.toString(), "yyyyMMdd_HHmmss") + '.zip';

  //write callback function after createFile
  var writefile = function(fileEntry) {
    fileEntry.createWriter(function(writer) {
      // Generate the binary Zip file
      var content = zip.generate({
        type: "arraybuffer"
      });

      writer.onwriteend = function(evt) {
        //start loading spinner
        navigator.notification.activityStop();
        navigator.notification.alert(
          '檔案位置: /easylearn/' + filename, // message
          null, // callback
          '成功輸出', // title
          '完成' // buttonName
        );
        console.log("zip create success");
      };

      // Persist the zip file to storage
      writer.write(content);
    }, fail);
  };

  //write callback function after createDir
  var createFile = function(dirEntry, callback) {
    dirEntry.getFile(filename, {
      create: true
    }, function(fileEntry) {
      writefile(fileEntry);
    }, fail);
  };

  //write callback function after external
  var createDir = function(dirEntry) {
    dirEntry.getDirectory('easylearn', {
      create: true
    }, function(destDirEntry) {
      createFile(destDirEntry);
    }, fail);
  };

  var getExternalDir = function() {
    window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function(dirEntry) {
      createDir(dirEntry);
    }, fail);
  };

  var putImgToZip = function() {
    //run this callbak times to ready to get next phase
    executeTimes = 0;
    for (var i in dirFullArray) {
      executeTimes += dirFullArray[i].length - 1;
    }
    console.log('total IMG: ' + executeTimes);

    //call back function for next
    var callback = function(fileEntry) {
      //remeber pack folder name
      var folderName = fileEntry.fullPath;
      folderName = folderName.replace(cordova.file.externalDataDirectory, '');
      var index = folderName.lastIndexOf("/");
      folderName = folderName.substr(1, index - 1);

      fileEntry.file(function(file) {
        var reader = new FileReader();

        reader.onloadend = function() {
          //add to zip
          zip.folder(folderName).file(file.name, reader.result, {
            binary: true
          });
          console.log('success add ' + folderName + '/' + file.name);
          //check if end
          executeTimes--;
          if (executeTimes === 0) {
            console.log('success add all image to zip');
            getExternalDir();
          }
        };
        reader.readAsArrayBuffer(file);
      }, fail);
    };

    //for loop for all pic
    for (var index in dirFullArray) {
      var j;
      for (j = 1; j < dirFullArray[index].length; j++) {
        window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory + dirFullArray[index][0] + '/' + dirFullArray[index][j], callback, fail);
      }
    }
  };

  //get pack's image array
  var getPicArray = function() {
    //success callback
    var callback = function(dirEntry) {
      var success = function(entries) {
        //first is dir name and rest is img name
        var dirContent = [];
        dirContent.push(dirEntry.name);

        var i;
        for (i = 0; i < entries.length; i++) {
          dirContent.push(entries[i].name);
        }
        //push to final array
        dirFullArray.push(dirContent);

        //check if is the last one
        executeTimes--;
        if (executeTimes === 0) {
          console.log("success getPicArray");
          putImgToZip();
        }
      };
      var directoryReader = dirEntry.createReader();
      // Get a list of all the entries in the directory
      directoryReader.readEntries(success, fail);
    };

    for (var j in dirArray) {
      window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory + dirArray[j], callback, fail);
    }
  };

  //get externalDataDirectory's dir array
  var getDirArray = function() {
    window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dirEntry) {
      var success = function(entries) {
        executeTimes = entries.length;
        var i;
        for (i = 0; i < entries.length; i++) {
          dirArray.push(entries[i].name);
        }

        //call back function
        getPicArray();
      };
      var directoryReader = dirEntry.createReader();
      // Get a list of all the entries in the directory
      directoryReader.readEntries(success, fail);
    }, fail);
  };


  getDirArray();


}

function export_pack(packId) {
  //start loading spinner
  navigator.notification.activityStart('', '輸出中');
  $('#export_popup').popup('close');

  //prepare zip file
  var zip = new JSZip();
  //get pack json data
  zip.file(packId + '.json', localStorage.getItem(packId));

  //get image into zip file
  var executeTimes;
  var dirArray = [];
  var dirFullArray = [];


  //zip file name
  var time = new Date();
  var filename = formatDate(time.toString(), "yyyyMMdd_HHmmss") + '.zip';

  //write callback function after createFile
  var writefile = function(fileEntry) {
    fileEntry.createWriter(function(writer) {
      // Generate the binary Zip file
      var content = zip.generate({
        type: "arraybuffer"
      });

      writer.onwriteend = function(evt) {
        //start loading spinner
        navigator.notification.activityStop();

        navigator.notification.alert(
          '檔案位置:\n/easylearn/' + filename, // message
          null, // callback
          '成功輸出', // title
          '完成' // buttonName
        );
        console.log("zip create success");
      };

      // Persist the zip file to storage
      writer.write(content);
    }, fail);
  };

  //write callback function after createDir
  var createFile = function(dirEntry, callback) {
    dirEntry.getFile(filename, {
      create: true
    }, function(fileEntry) {
      writefile(fileEntry);
    }, fail);
  };

  //write callback function after external
  var createDir = function(dirEntry) {
    dirEntry.getDirectory('easylearn', {
      create: true
    }, function(destDirEntry) {
      createFile(destDirEntry);
    }, fail);
  };

  var getExternalDir = function() {
    window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function(dirEntry) {
      createDir(dirEntry);
    }, fail);
  };

  var putImgToZip = function() {
    //run this callbak times to ready to get next phase
    executeTimes = 0;
    for (var i in dirFullArray) {
      executeTimes += dirFullArray[i].length - 1;
    }
    console.log('total IMG: ' + executeTimes);

    //call back function for next
    var callback = function(fileEntry) {
      //remeber pack folder name
      var folderName = fileEntry.fullPath;
      folderName = folderName.replace(cordova.file.externalDataDirectory, '');
      var index = folderName.lastIndexOf("/");
      folderName = folderName.substr(1, index - 1);

      fileEntry.file(function(file) {
        var reader = new FileReader();

        reader.onloadend = function() {
          //add to zip
          zip.folder(folderName).file(file.name, reader.result, {
            binary: true
          });
          console.log('success add ' + folderName + '/' + file.name);
          //check if end
          executeTimes--;
          if (executeTimes === 0) {
            console.log('success add all image to zip');
            getExternalDir();
          }
        };
        reader.readAsArrayBuffer(file);
      }, fail);
    };

    //for loop for all pic
    for (var i in dirFullArray) {
      var j;
      for (j = 1; j < dirFullArray[i].length; j++) {
        window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory + dirFullArray[i][0] + '/' + dirFullArray[i][j], callback, fail);
      }
    }
  };

  //get pack's image array
  var getPicArray = function() {
    //success callback
    var callback = function(dirEntry) {
      var success = function(entries) {
        //first is dir name and rest is img name
        var dirContent = [];
        dirContent.push(dirEntry.name);

        var i;
        for (i = 0; i < entries.length; i++) {
          dirContent.push(entries[i].name);
        }
        //push to final array
        dirFullArray.push(dirContent);

        console.log("success getPicArray");
        putImgToZip();
      };
      var directoryReader = dirEntry.createReader();
      // Get a list of all the entries in the directory
      directoryReader.readEntries(success, fail);
    };

    window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory + packId, callback, function() {
      //no image's pack generate zip file
      getExternalDir();
    });

  };

  getPicArray();
}

function import_action(zipFilename) {

  //start loading spinner
  navigator.notification.activityStart('', '匯入中');

  //close popup
  $('#import_popup').popup('close');

  var path = cordova.file.externalRootDirectory + 'easylearn/' + zipFilename;
  //zip file
  var zip;
  var count = 0;

  var exitFunction = function() {
    //exit function
    return;
  };

  var finish = function() {
    //resfresh home
    refreshPage();

    //stop spinner
    navigator.notification.activityStop();
  };

  var writeAFile = function(packId, filename, data) {
    window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(fileEntry) {
      //create dir
      fileEntry.getDirectory(packId, {
        create: true
      }, function(destDirEntry) {
        //create file
        destDirEntry.getFile(filename, {
          create: true
        }, function(fileEntry) {
          function win(writer) {
            writer.onwrite = function(evt) {
              console.log("write success " + packId + "/" + filename);

              count--;
              if (count === 0) finish();
            };
            writer.write(data);
          }
          fileEntry.createWriter(win, fail);
        }, fail);
      }, fail);
    }, fail);
  };

  var writeToLocalStorage = function(name, data) {
    localStorage.setItem(name, data);
    count--;
    if (count === 0) finish();
  };

  var extractZip = function() {
    //start loading spinner
    navigator.notification.activityStart('', '匯入中');

    var files = zip.files;
    for (var i in files) {
      if (i.indexOf('.jpg') != -1) {
        var path = i;
        var index = path.indexOf('/');
        var folder = path.substr(0, index);
        var filename = path.substr(index + 1);


        //write in to externalDataDirectory
        writeAFile(folder, filename, zip.file(i).asArrayBuffer());
      } else if (i.indexOf('.json') != -1) {
        //write in to localstorage
        writeToLocalStorage(i.replace('.json', ''), zip.file(i).asText());
      }
    }

  };

  var checkFile = function() {
    var files = zip.files;
    var singlePack = true;

    //check if the same user
    for (var i in files) {
      if (i == 'user.json') {
        singlePack = false;
        var data = zip.file(i).asText();
        var user = new User();
        console.log('[checkFile] ' + data + ' ' + user.id + ' function ' + data.indexOf(user.id));
        if (data.indexOf(user.id) == -1) {
          //stop spinner
          navigator.notification.activityStop();
          navigator.notification.alert('這個不是您的匯出檔案', null, '錯誤', '確定');
          return;
        }
        break;
      }
    }

    // add count for determine if action finished because there are all async function
    var confirmCallback = function(buttonIndex) {
      console.log('click button index: ' + buttonIndex);
      if (buttonIndex == 1) { // overwirte
        extractZip();
      } else if (buttonIndex === 0) { //user cancel the import
        exitFunction();
      }
    };

    for (var i in files) {
      if (i.indexOf('.jpg') != -1) {
        count++;
      } else if (i.indexOf('.json') != -1) {
        count++;
        //if is only single pack in zip file add to folder
        if (singlePack) {
          console.log("is singlePack");
          var folder = new Folder();
          var packId = i.replace('.json', '');

          //check if the pack exist
          if (!folder.hasPack(packId)) {
            folder.addAPack(packId);
            extractZip();
          } else { //pack already in folder. ask user to overwrite or cancel
            console.log("singlePack conflict");
            var pack = new Pack();
            pack.getPack(packId);
            //stop spinner
            navigator.notification.activityStop();
            navigator.notification.confirm('是否要覆蓋已經擁有的懶人包\n懶人包名稱: ' + pack.name, confirmCallback, '衝突', ['覆蓋', '取消匯入']);
          }
        }
      }
    }
    //if single pack confirmCallback will execute extractZip()
    if (!singlePack) extractZip();
  };

  var callback = function(fileEntry) {
    fileEntry.file(function(file) {
      var reader = new FileReader();

      reader.onloadend = function() {
        console.log('success load ' + file.name);
        //add to zip
        zip = new JSZip(reader.result);

        //next step check file
        checkFile();
      };
      reader.readAsArrayBuffer(file);
    }, fail);
  };

  window.resolveLocalFileSystemURL(path, callback, fail);

}

function import_data() {
  var zipFileArray = [];

  var display = function() {
    var result = '<li data-role="list-divider" id="zip">選擇一個ZIP檔案</li>';
    for (var i in zipFileArray) {
      if (zipFileArray[i].indexOf('.zip') != -1)
        result += '<li><a href="#" onclick="import_action(\'' + zipFileArray[i] + '\')">' + zipFileArray[i] + '</a></li>';
    }

    $('#zip_listview').html(result);
    $('#zip_listview').listview('refresh');
    $('#import_popup').popup('open');
  };

  var getZipFileArray = function() {
    window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory + 'easylearn/', function(dirEntry) {
      var success = function(entries) {
        var i;
        for (i = 0; i < entries.length; i++) {
          zipFileArray.push(entries[i].name);
        }
        //call back function
        display();
      };
      var directoryReader = dirEntry.createReader();
      // Get a list of all the entries in the directory
      directoryReader.readEntries(success, fail);
    }, fail);
  };


  getZipFileArray();
}


function formatDate(date, format) {
  if (!date) return;
  if (!format) format = "yyyy-MM-dd";
  switch (typeof date) {
    case "string":
      date = new Date(date.replace(/-/, "/"));
      break;
    case "number":
      date = new Date(date);
      break;
  }
  if (!(date instanceof Date)) return;
  var dict = {
    "yyyy": date.getFullYear(),
    "M": date.getMonth() + 1,
    "d": date.getDate(),
    "H": date.getHours(),
    "m": date.getMinutes(),
    "s": date.getSeconds(),
    "MM": ("" + (date.getMonth() + 101)).substr(1),
    "dd": ("" + (date.getDate() + 100)).substr(1),
    "HH": ("" + (date.getHours() + 100)).substr(1),
    "mm": ("" + (date.getMinutes() + 100)).substr(1),
    "ss": ("" + (date.getSeconds() + 100)).substr(1)
  };
  return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function() {
    return dict[arguments[0]];
  });
}
