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
      version: -1,
      modified: false
    }
  };

  if ((account === 'loko') && (password === '123456789')) {
    user.id = 'loko';
    user.name = '洛林';
    success(user);
  } else if ((account === 'b4456609') && (password === 'b4456609')) {
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
    "id": "folderId",
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
