function addFileToPack(packId, fileEntry, versionId, callback) {
  var time = new Date().getTime();
  window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dirEntry) {
    dirEntry.getDirectory(packId, {
      create: true
    }, function(dirEntry) {
      dirEntry.getDirectory(versionId, {
        create: true
      }, function(destDirEntry) {
        fileEntry.moveTo(destDirEntry, time + '.jpg');
        //add to pack's cover
        if(versionId === ''){
          new_pack.cover_filename = time + '.jpg';
        }
        destDirEntry.getFile(time + '.jpg', {
          create: false
        }, function(fileEntry) {
          callback(fileEntry);
        }, fail);
      }, fail);
    }, fail);
  }, fail);
}

function getImgNode(packId, versionId, fileName, callback) {

  var path = cordova.file.externalDataDirectory + packId + '/' + fileName;
  if (versionId !== null) {
    path = cordova.file.externalDataDirectory + packId + '/' + versionId + '/' + fileName;
  }

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

function downloadImgByUrl(url, packId, versionId, prefix, callback) {
  var fileTransfer = new FileTransfer();
  var uri = encodeURI(url);
  var time = new Date().getTime();

  fileTransfer.download(
    uri,
    cordova.file.externalDataDirectory + packId + '/' + versionId + '/' + prefix + time + '.jpg',
    function(entry) {
      console.log("download complete: " + entry.toURL());
      callback(entry);
    },
    function(error) {
      console.log("download error source " + error.source);
      console.log("download error target " + error.target);
      console.log("upload error code" + error.code);
    },
    false
  );
}

function displayPackImg(viewPackId, versionId, imgNode, imgName) {
  var path = cordova.file.externalDataDirectory + viewPackId + '/' + versionId + '/' + imgName;
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
