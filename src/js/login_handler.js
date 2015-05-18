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

  if ((account === 'loko') && (password === '123456789')) {
    user.id = 'loko';
    user.name = '洛林';
    successLogin(user);
  } else if ((account === 'b') && (password === 'b')) {
    user.id = 'b4456609';
    user.name = 'Bernie';
    successLogin(user);
  } else {
    $('#msg').text('帳號或密碼有錯誤!!');
  }

}

function successLogin(user) {
  $('#msg').text('登入成功');
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
}

function logout() {
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
    function (result) {
      console.log(result);
      user.id = result.id;
      user.name = result.name;
      successLogin(user);
    },
    function (error) {
      alert('登入失敗:' + JSON.stringify(error));
      console.log(error);
    });

}

function facebook_login() {
  facebookConnectPlugin.login(["public_profile"],
    fbLoginSuccess,
    function (error) { console.log(error); }
    );
}