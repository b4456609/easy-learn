function Pack() {
  this.pack_id;
  this.name;
  this.description;
  this.create_time;
  this.tags;
  this.is_public;
  this.creator_user_id;
  this.cover_filename;
  this.version;

  this.getPack = function (packId) {
    var pack = JSON.parse(localStorage.getItem(packId));

    //set all value
    this.pack_id = pack.pack_id;
    this.name = pack.name;
    this.description = pack.description;
    this.create_time = pack.create_time;
    this.tags = pack.tags;
    this.is_public = pack.is_public;
    this.creator_user_id = pack.creator_user_id;
    this.cover_filename = pack.cover_filename;
    this.version = pack.version;
  };

  this.savePack = function (packId) {
    var pack;
    //set pack's all value
    pack.pack_id = this.pack_id;
    pack.name = this.name;
    pack.description = this.description;
    pack.create_time = this.create_time;
    pack.tags = this.tags;
    pack.is_public = this.is_public;
    pack.creator_user_id = this.creator_user_id;
    pack.cover_filename = this.cover_filename;
    pack.version = this.version;

    //save to local storage
    localStorage.setItem(this.pack_id, JSON.stringify(pack));
  };
}

function Version() {
  this.id;
  this.content;
  this.create_time;
  this.is_public;
  this.creator_user_id;
  this.bookmark;
  this.note;
  this.file;
}

function Bookmark() {
  this.id;
  this.name;
  this.position;
}

function Note() {
  this.id;
  this.content;
  this.create_time;
  this.user_id;
  this.user_name;
  this.comment;
}

function Comment() {
  this.id;
  this.content;
  this.create_time;
  this.user_id;
  this.user_name;
}

function Folder() {
  this.folder;

  this.getFolder = function () {
    var folder = JSON.parse(localStorage.getItem('folder'));
    this.folder = folder;
  };
}

function Setting() {
  this.wifi_sync;
  this.mobile_network_sync
  this.last_sync_time;
  this.last_version;
  this.modified;

  //get setting form local storage
  this.getSetting = function () {
    var user = JSON.parse(localStorage.getItem('user'));
    this.wifi_sync = user.setting.wifi_sync;
    this.mobile_network_sync = user.setting.mobile_network_sync;
    this.last_sync_time = user.setting.last_sync_time;
    this.last_version = user.setting.last_version;
    this.modified = user.setting.modified;
  };

  this.setSetting = function (source) {
    this.wifi_sync = source.wifi_sync;
    this.mobile_network_sync = source.mobile_network_sync;
    this.last_sync_time = source.last_sync_time;
    this.last_version = source.last_version;
    this.modified = source.modified;
  };
}

function User() {
  this.id;
  this.name;
  
  //get setting form local storage
  this.getSetting = function () {
    var user = JSON.parse(localStorage.getItem('user'));
    this.id = user.id;
    this.name = user.name;
  };
}
