$(document).on("pageshow", "#login", function() {
  navigator.splashscreen.hide();
});

function login_check() {
  var account = $('#account').val();
  var password = $('#password').val();

  var user = {
    "id": "",
    "name": "Bernie",
    "setting": {
      wifi_sync: true,
      mobile_network_sync: true,
      last_sync_time: 1419519614000,
      version: 0,
      modified: true
    }
  };
}

function successLogin(user) {
  // $('#msg').text('登入成功');
  localStorage.setItem('user', JSON.stringify(user));
  var folder = [{
    "name": "All",
    "id": "allPackId",
    "pack": []
  }, {
    "name": "我的最愛",
    "id": "fjoeiwjowfe",
    "pack": []
  }];
  localStorage.folder = JSON.stringify(folder);
  //testLocalStorage();

  $.mobile.changePage("index.html", {
    transition: "pop",
    reverse: false,
    changeHash: false
  });

  sync();
}

function logout() {
  var folder = new Folder();
  var count = 0;

  var callback = function() {
    count--;
    if (count === 0) {
      localStorage.clear();
      login();
    }
  };

  for (var key in localStorage) {
    if (key.indexOf('pack') != -1)
      count++;
  }

  for (var key1 in localStorage) {
    console.log(key1);
    if (key1.indexOf('pack') != -1)
      folder.deleteAPack(key1, callback);
  }

  localStorage.clear();
  login();
}

function login() {
  $.mobile.changePage("login.html", {
    transition: "pop",
    reverse: false,
    changeHash: false
  });
}


function fbLoginSuccess(userData) {
  //alert("UserInfo: " + JSON.stringify(userData));
  console.log(userData);

  var user = {
    "id": "user" + new Date().getTime(),
    "name": "Default",
    "setting": {
      wifi_sync: true,
      mobile_network_sync: true,
      last_sync_time: 1419519614000,
      version: 0,
      modified: true
    }
  };




  facebookConnectPlugin.api("/me", [],
    function(result) {
      console.log(result);
      user.id = result.id;
      user.name = result.name;
      successLogin(user);
      postDeviceId(user.id, sessionStorage.getItem('regID'));
    },
    function(error) {
      alert('登入失敗:' + JSON.stringify(error));
      console.log(error);
    });
}

function facebook_login() {
  facebookConnectPlugin.login(["public_profile", "user_birthday", "user_friends"],
    fbLoginSuccess,
    function(error) {
      console.log(error);
    }
  );
}
