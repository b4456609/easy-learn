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
  //return img node
  var img;


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
            img.style["z-index"] =  1;
            reader.readAsDataURL(file);
            console.log(img);
            return callback(packId, img);
          }, fail);
        }, fail);
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
