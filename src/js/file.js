function fail(error) {
  console.log('FileSystem Error:' + error.code);
}

function addFileToPack(packId, fileEntry) {
  var time = new Date().getTime();
  window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dirEntry) {
    console.log('addFileToPack dirEntry1');
    dirEntry.getDirectory(packId, {
      create: true
    }, function(destDirEntry) {
      console.log('addFileToPack dirEntry2');
      fileEntry.moveTo(destDirEntry, time + '.jpg');
      cover_filename = time + '.jpg';
      destDirEntry.getFile(time + '.jpg', {
        create: false
      }, function(fileEntry) {
        console.log('addFileToPack dirEntry3');
        displayCoverImg(fileEntry);
      }, fail);
    }, fail);
  }, fail);
}

function getImgNode(packId, fileName, callback) {

  window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dirEntry) {
    console.log('getFile dirEntry');
    dirEntry.getDirectory(packId, {
      create: false
    }, function(destDirEntry) {
      destDirEntry.getFile(fileName, {
        create: false
      }, function(fileEntry) {
        fileEntry.file(function(file) {
          img = document.createElement("img");

          var reader = new FileReader();
          reader.onloadend = function() {
            img.src = reader.result;
          };
          img.style["z-index"] = 1;
          img.style.width = '100%';
          reader.readAsDataURL(file);
          console.log(img);
          return callback(packId, img);
        }, fail);
      }, fail);
    }, fail);
  }, fail);
}

function downloadSlideShareByUrl(url, packId, callback) {
  var fileTransfer = new FileTransfer();
  var uri = encodeURI(url);
  var time = new Date().getTime();

  fileTransfer.download(
    uri,
    cordova.file.externalDataDirectory + '/' + packId + '/slideshare' + time + '.jpg',
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

      imgNode.attr('width' , '100%');
      reader.readAsDataURL(file);

    }, fail);
  }, fail);
}


// window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dir) {
//   console.log("got main dir", dir);
//   dir.getFile("user.json", {
//     create: true
//   }, function(file) {
//     console.log("got the file", file);
//     userFile = file;
//     writeLog(localStorage.user);
//   });
// });

// function writeLog(str) {
//   console.log("in writeLog" + userFile);
//   if (!userFile) return;
//   console.log("going to log " + str);
//   userFile.createWriter(function(fileWriter) {
//
//     var blob = new Blob([str], {
//       type: 'text/plain'
//     });
//     fileWriter.write(blob);
//     console.log("ok, in theory i worked");
//   }, fail);
// }
//
// function onResolveSuccess(dirEntry) {
//   dataDirEntry = dirEntry;
//   createUserFile();
// }
//
// function createUserFile(data) {
//   dataDirEntry.getFile(name, {
//     create: true
//   }, function(file) {
//     console.log("got the file", file);
//     file.createWriter(function(writerA) {
//       writer.onwrite = function(evt) {
//         console.log("write success");
//       };
//       writer.write(data);
//     }, fail);
//   }, fail);
// }
//
