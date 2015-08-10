/*
    message pass scuess or not
    and display message
*/

function pushNotification() {
  var pushNotification = window.plugins.pushNotification;
  pushNotification.register(
    successHandler,
    errorHandler, {
      'senderID': '277155669423',
      'ecb': 'onNotificationGCM' // callback function
    }
  );

  function successHandler(result) {
    console.log('Success: ' + result);
  }

  function errorHandler(error) {
    console.log('Error: ' + error);
  }
}

function onNotificationGCM(e) {
  switch (e.event) {
    case 'registered':
      if (e.regid.length > 0) {
        // Your GCM push server needs to know the regID before it can push to this device
        // here is where you might want to send it the regID for later use.
        console.log("regID = " + e.regid);
        sessionStorage.setItem('regID', e.regid);
      }
      break;

    case 'message':
      // if this flag is set, this notification happened while we were in the foreground.
      // you might want to play a sound to get the user's attention, throw up a dialog, etc.
      if (e.foreground) {
        window.plugins.toast.showShortTop('有人與你分享懶人包', function(a) {
          console.log('toast success: ' + a)
        }, function(b) {
          alert('toast error: ' + b)
        });
        //add to local share folder
        var packId = e.payload.packId;
        var folder = new Folder();
        if (folder.hasPack(packId)) {
          console.log('[checkout_pack]has pack in local');
          addSharePack(packId);
        } else {
          console.log('[checkout_pack]no pack in local');
          getPack(packId, function() {
            addSharePack(packId);
          });
        }


      } else { // otherwise we were launched because the user touched a notification in the notification tray.


        /*   device   push notificaion  after tap  e.payload.packId  */

        checkout_pack(e.payload.packId);
        addSharePack(e.payload.packId);
      }
      break;

    case 'error':
      $("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
      break;

    default:
      $("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
      break;
  }
}

function addSharePack(packId) {
  //add to local share folder
  var folder = new Folder();
  folder.addShareFolder();
  folder.addPackToShareFolder(packId);
  refreshHomePage();
}
