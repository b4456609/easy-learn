require 'rubygems'
require 'pushmeup'
GCM.host = 'https://android.googleapis.com/gcm/send'
GCM.format = :json
GCM.key = "AIzaSyB4hcjvpiAStqtjOqfVrAuDtIxm-NItaes"
destination = ["APA91bGdK1glBzAg2pTRd0zI_GITF_i6pnxM2xNOZ4_Pvie4zmlCibisxwd5IUYP5HPKgp18QefPPvtXQujpYIftanE16a8bKZU2HwKngQgB5_5JvYBIDrhyf366MQhFgrKLS3OUa5EU"]
data = {:message => "PhoneGap Build rocks!", :msgcnt => "1", :soundname => "beep.wav"}

GCM.send_notification( destination, data)
