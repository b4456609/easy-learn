$(document).on("pageinit", "#setting", function () {
  setCurrentSetting();
});

$(document).on("pageshow", "#setting", function () {
  setCurrentSetting();
});

function setCurrentSetting(){
  var user = new User();
  $("#mobile_network_sync").prop("checked", user.setting.mobile_network_sync).checkboxradio("refresh");
  $("#wifi_sync").prop("checked", user.setting.wifi_sync).checkboxradio("refresh");
}

function save_setting(){
  var mobile_network_sync = document.getElementById("mobile_network_sync").checked;
  var wifi_sync = document.getElementById("wifi_sync").checked;

  var user = new User();
  user.setting.mobile_network_sync = mobile_network_sync;
  user.setting.wifi_sync = wifi_sync;
  user.save();
}