function Pack() {
  this.id;
  this.name;
  this.description;
  this.create_time;
  this.tags;
  this.is_public;
  this.creator_user_id;
  this.cover_filename;
  this.creator_user_name;
  this.version;

  this.getPack = function (packId) {
    var pack = JSON.parse(localStorage.getItem(packId));

    //set all value
    this.id = packId;
    this.name = pack.name;
    this.description = pack.description;
    this.create_time = pack.create_time;
    this.tags = pack.tags;
    this.is_public = pack.is_public;
    this.creator_user_id = pack.creator_user_id;
    this.cover_filename = pack.cover_filename;
    this.version = pack.version;
    this.creator_user_name = pack.creator_user_name;
  };

  this.save = function () {
    var pack = {
      name: this.name,
      description: this.description,
      create_time: this.create_time,
      tags: this.tags,
      is_public: this.is_public,
      creator_user_id: this.creator_user_id,
      cover_filename: this.cover_filename,
      creator_user_name: this.creator_user_name,
      version: this.version,
    };

    //save to local storage
    localStorage.setItem(this.id, JSON.stringify(pack));
  };

  this.initial = function () {
    //get current time
    var time = new Date().getTime();
    
    //set id
    this.id = 'pack' + time;
    
    //set user
    var user = new User();
    this.creator_user_id = user.id;
    this.creator_user_name = user.name;

    this.create_time = time;
    this.name = '';
    this.is_public = false;
    this.description = '';
    this.tags = '';
    this.cover_filename = '';
    this.version = [];
  };
}

function Version() {
  this.id;
  this.content;
  this.create_time;
  this.is_public;
  this.creator_user_id;
  this.creator_user_name;
  this.bookmark;
  this.note;
  this.file;
  this.version;
  this.modified;

  this.initial = function () {
    //get current time
    var time = new Date().getTime();
    this.id = "version" + time;
    this.create_time = time;
    
    //set user
    var user = new User();
    this.creator_user_id = user.id;
    this.creator_user_name = user.name;

    this.content = '';
    this.is_public = false;
    this.bookmark = [];
    this.note = [];
    this.file = [];
    this.version = 0;
    this.modified = false;
  };

  this.get = function () {
    var newVersion = {
      id: this.id,
      content: this.content,
      create_time: this.create_time,
      is_public: this.is_public,
      creator_user_id: this.creator_user_id,
      creator_user_name: this.creator_user_name,
      bookmark: this.bookmark,
      note: this.note,
      file: this.file,
      version: this.version,
      modified: this.modified,
    };
    return newVersion;
  };
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
  this.folderArray = JSON.parse(localStorage.getItem('folder'));

  //add a pack id to all folder
  this.addToAllFolder = function (packId) {
    var j;
    for (j in this.folderArray) {
      if (this.folderArray[j].name == 'All') {
        this.folderArray[j].pack[this.folderArray[j].pack.length] = packId;
        break;
      }
    }
    this.save();
  };

  this.save = function () {
    localStorage.setItem("folder", JSON.stringify(this.folderArray));
  };
}


function User() {
  var user = JSON.parse(localStorage.getItem('user'));
  this.id = user.id;
  this.name = user.name;
  this.setting = user.setting;
  
  //save to local storage
  this.saveUser = function () {
    var user = {
      id: this.id,
      name: this.name,
      setting: this.setting,
    };

    localStorage.setItem('user', JSON.stringify(user));
  };
  
  //return setting
  this.getSetting = function () {
    this.getUser();
    return this.setting;
  };
}

