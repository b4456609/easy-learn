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
    success(user);
  } else if ((account === 'b') && (password === 'b')) {
    user.id = 'b4456609';
    user.name = 'Bernie';
    success(user);
  } else {
    $('#msg').text('帳號或密碼有錯誤!!');
  }

}

function success(user) {
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

//  facebookConnectPlugin.login(["public_profile"],
//    fbLoginSuccess,
//    function (error) { console.log(error); }
//    );
}

function fbLoginSuccess(userData) {
  //alert("UserInfo: " + JSON.stringify(userData));
  console.log(userData);

  facebookConnectPlugin.api("/me", [],
    function (result) {
      alert("Result: " + JSON.stringify(result));
      console.log(result);
    },
    function (error) {
      alert(JSON.stringify(error));
    });
}

