function addFileToPack(packId, fileEntry, callback) {
  var time = new Date().getTime();
  window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (dirEntry) {
    dirEntry.getDirectory(packId, {
      create: true
    }, function (destDirEntry) {
        fileEntry.moveTo(destDirEntry, time + '.jpg');
        //add to pack's cover
        if (NEW_PACK !== null) {
          NEW_PACK.cover_filename = time + '.jpg';
        }
        destDirEntry.getFile(time + '.jpg', {
          create: false
        }, function (fileEntry) {
            callback(fileEntry);
          }, fail);
      }, fail);
  }, fail);
}

function getImgNode(packId, fileName, callback) {

  var path = cordova.file.externalDataDirectory + packId + '/' + fileName;

  window.resolveLocalFileSystemURL(path, function (fileEntry) {
    fileEntry.file(function (file) {
      var img = document.createElement("img");

      var reader = new FileReader();
      reader.onloadend = function () {
        img.src = reader.result;
        img.style["z-index"] = 1;
        img.style.width = '100%';
        return callback(packId, img);
      };
      reader.readAsDataURL(file);
    }, fail);
  }, fail);
}

function downloadImgByUrl(url, packId, prefixOrName, callback) {
  var fileTransfer = new FileTransfer();
  var uri = encodeURI(url);
  var time = new Date().getTime();
  var filename;
  //set file path
  var filepath;
  if (prefixOrName.indexOf('jpg') > 0) {
    filepath = cordova.file.externalDataDirectory + packId + '/' + prefixOrName;
    filename = prefixOrName;
  }
  else {
    filepath = cordova.file.externalDataDirectory + packId + '/' + prefixOrName + time + '.jpg';
    filename = prefixOrName + time + '.jpg';
  }



  fileTransfer.download(
    uri,
    filepath,
    function (entry) {
      //add to version's file
      editingFile[editingFile.length] = filename;
      console.log("download complete: " + entry.toURL());
      callback(entry);
    },
    function (error) {
      console.log("download error source " + error.source);
      console.log("download error target " + error.target);
      console.log("upload error code" + error.code);
    },
    false
    );
}

function displayPackImg(viewPackId, imgNode, imgName) {
  var path = cordova.file.externalDataDirectory + viewPackId + '/' + imgName;
  console.log(path);
  //console.log(imgNode);

  window.resolveLocalFileSystemURL(path, function (fileEntry) {
    console.log('getFileEntry');
    fileEntry.file(function (file) {

      var reader = new FileReader();
      reader.onloadend = function () {
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
  var writefile = function (fileEntry) {
    fileEntry.createWriter(function (writer) {
      // Generate the binary Zip file
      var content = zip.generate({ type: "arraybuffer" });

      writer.onwriteend = function (evt) {
        console.log("zip create success");
      };

      // Persist the zip file to storage
      writer.write(content);
    }, fail);
  };   

  //write callback function after createDir 
  var createFile = function (dirEntry, callback) {
    dirEntry.getFile(filename, {
      create: true
    }, function (fileEntry) {
        writefile(fileEntry);
      }, fail);
  };

  //write callback function after external
  var createDir = function (dirEntry) {
    dirEntry.getDirectory('easylearn', {
      create: true
    }, function (destDirEntry) {
        createFile(destDirEntry);
      }, fail);
  };

  var getExternalDir = function () {
    window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (dirEntry) {
      createDir(dirEntry);
    }, fail);
  };

  var putImgToZip = function () {
    //run this callbak times to ready to get next phase
    executeTimes = 0;
    for (var i in dirFullArray) {
      executeTimes += dirFullArray[i].length - 1;
    }
    console.log('total IMG: ' + executeTimes);
    
    //call back function for next
    var callback = function (fileEntry) {
      //remeber pack folder name
      var folderName = fileEntry.fullPath;
      folderName = folderName.replace(cordova.file.externalDataDirectory, '');
      var index = folderName.lastIndexOf("/");
      folderName = folderName.substr(1, index - 1);

      fileEntry.file(function (file) {
        var reader = new FileReader();

        reader.onloadend = function () {
          //add to zip
          zip.folder(folderName).file(file.name, reader.result, { binary: true });
          console.log('success add ' + folderName + '/' + file.name);
          //check if end
          executeTimes--;
          if (executeTimes == 0) {
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
  }
  
  //get pack's image array
  var getPicArray = function () {
    //success callback
    var callback = function (dirEntry) {
      var success = function (entries) {
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
        if (executeTimes == 0) {
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
  var getDirArray = function () {
    window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (dirEntry) {
      var success = function (entries) {
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

function import_data() {
  
}


function formatDate(date, format) {
    if (!date) return;
    if (!format) format = "yyyy-MM-dd";
    switch(typeof date) {
        case "string":
            date = new Date(date.replace(/-/, "/"));
            break;
        case "number":
            date = new Date(date);
            break;
    } 
    if (!date instanceof Date) return;
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