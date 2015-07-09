var gcm = require('node-gcm');
      var message = new gcm.Message();

      //API Server Key
      var sender = new gcm.Sender('AIzaSyB4hcjvpiAStqtjOqfVrAuDtIxm-NItaes');
      var registrationIds = [];

      // Value the payload data to send...
      message.addData('message',"\u270C Peace, Love \u2764 and 加油 \u2706!");
      message.addData('title','Push Notification Sample' );
      message.addData('msgcnt','3'); // Shows up in the notification in the status bar
      message.addData('soundname','beep.wav'); //Sound to play upon notification receipt - put in the www folder in app
      //message.collapseKey = 'demo';
      //message.delayWhileIdle = true; //Default is false
      message.timeToLive = 3000;// Duration in seconds to hold in GCM and retry before timing out. Default 4 weeks (2,419,200 seconds) if not specified.

      // At least one reg id required
      registrationIds.push('APA91bGdK1glBzAg2pTRd0zI_GITF_i6pnxM2xNOZ4_Pvie4zmlCibisxwd5IUYP5HPKgp18QefPPvtXQujpYIftanE16a8bKZU2HwKngQgB5_5JvYBIDrhyf366MQhFgrKLS3OUa5EU');

      /**
       * Parameters: message-literal, registrationIds-array, No. of retries, callback-function
       */
      sender.send(message, registrationIds, 4, function (result) {
          console.log(result);
      });