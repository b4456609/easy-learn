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
