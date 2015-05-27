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
    zip.file(key, localStorage.getItem(key));
  }
  
  //zip file name
  var time = new Date().getTime();
  
  //write callback function after createFile 
  var writefile = function (fileEntry) {
    fileEntry.createWriter(function (writer) {
      // Generate the binary Zip file
      var content = zip.generate({ type: "blob", compression: "DEFLATE" });

      writer.onwriteend = function (evt) {
      };

      // Persist the zip file to storage
      writer.write(content);
    }, fail);
  };   

  //write callback function after createDir 
  var createFile = function (dirEntry, callback) {
    dirEntry.getFile(time + '.zip', {
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
  

  window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (dirEntry) {
    createDir(dirEntry);
  }, fail);


}

function import_data() {

}