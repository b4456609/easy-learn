function addFileToPack(packId, fileEntry, packVersion) {
  var time = new Date().getTime();
  window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dirEntry) {
    dirEntry.getDirectory(packId, {
      create: true
    }, function(dirEntry) {
		dirEntry.getDirectory(packVersion, {
			create: true
		}, function(destDirEntry) {
		  fileEntry.moveTo(destDirEntry, time + '.jpg');
		  new_pack.cover_filename = time + '.jpg';
		  destDirEntry.getFile(time + '.jpg', {
			create: false
		  }, function(fileEntry) {
			displayCoverImg(fileEntry);
		  }, fail);
		}, fail);
	}, fail);
  }, fail);
}

function getImgNode(packId, packVersion, fileName, callback) {

	var path = cordova.file.externalDataDirectory + packId + '/' + fileName;
	if (packVersion !== null){
		var path = cordova.file.externalDataDirectory + packId + '/' + packVersion + '/' + fileName;
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

function downloadSlideShareByUrl(url, packId, packVersion, callback) {
  var fileTransfer = new FileTransfer();
  var uri = encodeURI(url);
  var time = new Date().getTime();

  fileTransfer.download(
    uri,
    cordova.file.externalDataDirectory + packId + '/' + packVersion + '/slideshare' + time + '.jpg',
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

function displayPackImg(viewPackId, viewPackVersion, imgNode, imgName) {
  var path = cordova.file.externalDataDirectory + viewPackId +'/' + viewPackVersion + '/' + imgName;
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
