document.addEventListener("deviceready", onDeviceReady, false);

var userFile;

function onDeviceReady() {
  console.log(cordova.file);

  localStorage.clear();
  testLocalStorage();

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

}

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
// function fail(error) {
//   console.log('FileSystem Error:' + error.code);
//}
