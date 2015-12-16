function Pack() {
  this.id = '';
  this.name = '';
  this.description = '';
  this.create_time = '';
  this.tags = '';
  this.is_public = '';
  this.creator_user_id = '';
  this.cover_filename = '';
  this.creator_user_name = '';
  this.version = [];
}

Pack.prototype.getPack = function(packId) {
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

Pack.prototype.save = function() {
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

Pack.prototype.initial = function() {
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



function Version() {
  this.id = '';
  this.content = '';
  this.create_time = '';
  this.is_public = '';
  this.creator_user_id = '';
  this.creator_user_name = '';
  this.bookmark = '';
  this.note = '';
  this.file = '';
  this.version = 0;
  this.private_id = '';
  this.view_count = '';
  this.user_view_count = '';
  this.modified = 'false';

  this.initial = function() {
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
    this.private_id = '';
    this.view_count = 0;
    this.user_view_count = 0;
  };

  this.get = function() {
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
      private_id: this.private_id,
      view_count: this.view_count,
      user_view_count: this.user_view_count,
      modified: this.modified
    };
    return newVersion;
  };

  this.newPrivateId = function() {
    var time = new Date().getTime();
    this.private_id = "private" + time;
  };
}


function Folder() {
  this.folderArray = JSON.parse(localStorage.getItem('folder'));

  //add a pack id to all folder
  this.addToAllFolder = function(packId) {
    var j;
    for (j in this.folderArray) {
      if (this.folderArray[j].name == 'All') {
        this.folderArray[j].pack[this.folderArray[j].pack.length] = packId;
        break;
      }
    }
    this.save();
  };

  this.save = function() {
    localStorage.setItem("folder", JSON.stringify(this.folderArray));
    //setting modified
    var user = new User();
    user.modified();
  };

  this.deleteFolder = function(folderId) {

    for (var i in this.folderArray) {
      if (folderId === this.folderArray[i].id) {
        this.folderArray.splice(i, 1);
      }
    }

    this.save();
  };

  this.addFolder = function(name) {
    //get current time
    var time = new Date().getTime();

    //add new folder
    this.folderArray[this.folderArray.length] = {
      name: name,
      id: 'folder' + time,
      pack: []
    };

    //save in local stroage
    this.save();
  };

  this.getPacks = function(folderId) {
    console.log(folderId);
    for (var i in this.folderArray) {
      console.log(this.folderArray[i].id);
      if (folderId === this.folderArray[i].id) {
        return this.folderArray[i].pack;
      }
    }
  };

  this.changePackTo = function(originFolderId, packid, destFolderId) {
    console.log('changePackTo' + originFolderId + ' ' + packid + ' ' + destFolderId);

    if (originFolderId !== 'allPackId') {
      for (var i in this.folderArray) {
        //remove form origin folder
        if (originFolderId === this.folderArray[i].id) {
          var index = this.folderArray[i].pack.indexOf(packid);
          this.folderArray[i].pack.splice(index, 1);
        }
        //add to dest folder
        if (destFolderId === this.folderArray[i].id) {
          this.folderArray[i].pack.push(packid);
        }
      }
    } else { //only add to dest. folder
      for (var folderIndex in this.folderArray) {
        if (destFolderId === this.folderArray[folderIndex].id) {
          this.folderArray[folderIndex].pack.push(packid);
        }
      }
    }
    this.save();
  };

  //add a pack to all folder
  this.addAPack = function(packId) {

    for (var i in this.folderArray) {
      if (this.folderArray[i].id === 'allPackId') {
        console.log('[addAPack] packId:' + packId);
        if (!this.hasPack(packId))
          this.folderArray[i].pack.push(packId);
        break;
      }
    }

    this.save();
  };

  this.hasPack = function(packId) {
    for (var i in this.folderArray) {
      if (this.folderArray[i].id === 'allPackId') {
        for (var j in this.folderArray[i].pack) {
          if (this.folderArray[i].pack[j] === packId) {
            return true;
          }
        }
      }
    }
    return false;
  };

  //delete a pack from folder
  this.deleteAPack = function(packId) {
    //delete from folder
    for (var i in this.folderArray) {
      for (var j in this.folderArray[i].pack) {
        if (this.folderArray[i].pack[j] === packId) {
          console.log('[deleteAPack] packId:' + packId);
          this.folderArray[i].pack.splice(j, 1);
        }
      }
    }

    //delete pack from localStroage
    localStorage.removeItem(packId);

    //delete files in cellphone
    window.resolveLocalFileSystemURL(FILE_STORAGE_PATH + packId, function(dirEntry) {
      dirEntry.removeRecursively(function() {}, function() {});
    }, fail);

    this.save();
  };

  //rename folder
  this.renameFolder = function(folderId, name) {
    for (var j in this.folderArray) {
      if (this.folderArray[j].id === folderId) {
        this.folderArray[j].name = name;
        break;
      }
    }

    this.save();
  };

  //if no share folder add it
  this.addShareFolder = function() {
    for (var i in this.folderArray) {
      if (this.folderArray[i].id == 'shareFolder') {
        return;
      }
    }

    //add new folder
    this.folderArray[this.folderArray.length] = {
      name: '與你分享懶人包',
      id: 'shareFolder',
      pack: []
    };

    this.save();
  };

  //add a pack to all folder
  this.addPackToShareFolder = function(packId) {
    //if not in all folder add in
    if (!this.hasPack) {
      this.addToAllFolder(packId);
    }
    for (var i in this.folderArray) {
      if (this.folderArray[i].id === 'shareFolder') {
        console.log('[addAPack] addPackToShareFolder:' + packId);

        //check is exist in share folder
        var packs = this.folderArray[i].pack;
        for (var j in packs) {
          if (packs[j] === packId) {
            return;
          }
        }
        this.folderArray[i].pack.push(packId);

        break;
      }
    }

    this.save();
  };
}


function User() {
  var user = JSON.parse(localStorage.getItem('user'));
  this.id = user.id;
  this.name = user.name;
  this.setting = user.setting;

  //save to local storage
  this.save = function() {
    var user = {
      id: this.id,
      name: this.name,
      setting: this.setting,
    };

    localStorage.setItem('user', JSON.stringify(user));
  };

  //return setting
  this.getSetting = function() {
    return this.setting;
  };

  this.modified = function() {
    this.setting.modified = true;
    this.save();
  };

  this.modifiedFalse = function() {
    this.setting.modified = false;
    this.save();
  };
}

function Reference() {
  var youtube = [];
  var slideshare = [];
  var youtubeResult = [];
  var slideshareResult = [];
  var count = 0;
  var deferred;

  //add image
  this.addYoutube = function(str) {
    youtube.push(str);
    count++;
  };

  //add slideshare
  this.addSlideshare = function(str) {
    for (var i in slideshare) {
      if (slideshare[i] == str) {
        return;
      }
    }
    slideshare.push(str);
    count++;
  };

  this.getInfo = function(content) {
    console.log('[Reference]getInfo');
    //Deferred object
    deferred = $.Deferred();

    //no info can be produce
    if (navigator.network.connection.type == Connection.NONE) {
      console.log('[Reference]getInfo:no internet');
      //no internet connection
      deferred.resolve();
      return deferred.promise();
    }

    //parse content
    this.setRef(content);

    //no content Reference
    if (slideshare.length + youtube.length === 0) {
      console.log('[Reference]getInfo:no need to ajax');
      deferred.resolve();
      return deferred.promise();
    }

    //get slide share info
    var i;
    for (i in slideshare) {
      this.slideshareAjax(slideshare[i]);
    }

    //get youtube info
    for (i in youtube) {
      this.youtubeAjax(youtube[i]);
    }


    return deferred.promise();
  };

  this.youtubeAjax = function(id) {
    console.log('[youtubeAjax]' + id);
    var self = this;
    var url = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&id=' + id + '&key=AIzaSyBaRuuH-H3TCyW4ek-_J-XR9BCOBjfbP5s';
    var result;
    //ajax slideshare info and put into array
    $.get(url,
      function(data) {
        var video = data.items[0].snippet;
        //use exteranl broswer
        result = '<li><a href="#" onclick="window.open(\'http://www.youtube.com/watch?v=' + id + '\', \'_system\');">' + video.title + '</a></li>';
        youtubeResult.push(result);
        self.isFinish();
      });
  };

  this.slideshareAjax = function(slidesharePath) {
    var slideshareUrl = 'http://www.slideshare.net/' + slidesharePath;
    var ajaxUrl = "http://www.slideshare.net/api/oembed/2?url=http://www.slideshare.net/" + slidesharePath;

    var self = this;
    var result;
    //ajax slideshare info and put into array
    $.get(ajaxUrl,
      function(data) {
        result = '<li><a href="#" onclick="window.open(\'' + slideshareUrl + '\', \'_system\');">' + data.title + ' - ' + data.author_name + '</a></li>';
        slideshareResult.push(result);
        self.isFinish();
      });
  };

  //check is all complete
  this.isFinish = function() {
    //check is all finished
    count--;
    console.log(count);
    if (count === 0) {
      console.log(slideshare);
      console.log(slideshareResult);
      console.log(youtube);
      console.log(youtubeResult);
      deferred.resolve();
    }
  };

  //output html string
  this.get = function() {
    console.log('[Reference]toString');
    var youtubeLength = youtubeResult.length;
    var slideShareLength = slideshareResult.length;
    var result = '';
    if (youtubeLength + slideShareLength > 0) {
      result = '<div id="pack_refrence">';
      result += '<h1>引用資料</h1>';

      if (youtubeLength > 0) {
        result += '<h2>Youtube</h2>';
        result += '<ol>';
        for (var i in youtubeResult) {
          result += youtubeResult[i];
        }
        result += '</ol>';
      }

      if (slideShareLength > 0) {
        result += '<h2>Slideshare</h2>';
        result += '<ol>';
        for (var j in slideshareResult) {
          result += slideshareResult[j];
        }
        result += '</ol>';
        result += '</div>';
      }
    }
    console.log(result);

    return result;
  };

  //get the refrence from exsit version
  this.setRef = function(content) {
    console.log("[Reference]getExistRefrence");

    //add youtube id to youtube array
    var index = 0;
    var endIndex;
    index = content.indexOf('http://www.youtube.com/embed/');
    while (index !== -1) {
      console.log('youtube ' + index);
      endIndex = content.indexOf('?', index + 29);
      this.addYoutube(content.substring(index + 29, endIndex));
      index = content.indexOf('http://www.youtube.com/embed/', index + 1);
    }

    index = 0;
    index = content.indexOf('slideshare-img ');
    while (index !== -1) {
      console.log('slide ' + index);
      endIndex = content.indexOf(' ', index + 15);
      this.addSlideshare(content.substring(index + 15, endIndex).replace('_', '/'));
      index = content.indexOf('slideshare-img ', index + 1);
    }
  };

  //delete exist reference
  this.deleteRef = function(content) {
    console.log("[Reference]deleteRef");
    var endIndex = content.indexOf('<div id="pack_refrence">');
    if (endIndex === -1) {
      console.log('[Reference]no exist reference');
      return content;
    }

    return content.substring(0, endIndex);
  };
}

function ViewStorage() {
  this.packMemo = JSON.parse(localStorage.getItem('view_storage'));
  if (this.packMemo === null) this.packMemo = [];
  this.currentPack = null;
  this.versionIndex = 0;
  this.bookmarkPos = {
    ready: false,
    pos: 0
  };
  this.folder = '';
}

ViewStorage.prototype.setBookmarkPos = function(pos) {
  this.bookmarkPos.ready = true;
  this.bookmarkPos.pos = pos;
};

ViewStorage.prototype.getViewPos = function() {
  var pos = this.currentPack.pos;
  if(this.bookmarkPos.ready){
    pos = this.bookmarkPos.pos;
  }

  var isBookmark = this.bookmarkPos.ready;
  this.bookmarkPos.ready = false;
  return {
    isBookmark: isBookmark,
    pos: pos
  };
};

ViewStorage.prototype.getViewPackId = function() {
  return this.currentPack.packId;
};

ViewStorage.prototype.findPackRecord = function(packId) {
  for (var i in this.packMemo) {
    if (this.packMemo[i].packId == packId) {
      this.currentPack = this.packMemo[i];

      //set versionIndex
      var pack = new Pack();
      pack.getPack(packId);
      for (var j in pack.version) {
        if (pack.version[j].id === this.currentPack.versionId) {
          this.versionIndex = j;
          break;
        }
      }

      return;
    }
  }
  this.currentPack = null;
};

ViewStorage.prototype.checkoutVersion = function(index) {
  var pack = new Pack();
  pack.getPack(this.currentPack.packId);
  this.addOrUpdateRecord(this.currentPack.packId, pack.version[index].id, 0);
	this.versionIndex = index;
};

ViewStorage.prototype.addOrUpdateRecord = function(packId, versionId, pos) {
  this.findPackRecord(packId);
  //update record
  if (this.currentPack !== null) {
    this.currentPack.pos = pos;
    this.currentPack.versionId = versionId;
  }
  //add new record
  else {
    var record = {
      packId: packId,
      versionId: versionId,
      pos: pos
    };
    console.log(this.packMemo);
    this.packMemo.push(record);
  }

  this.save();
};

ViewStorage.prototype.save = function() {
  localStorage.setItem('view_storage', JSON.stringify(this.packMemo));
};

ViewStorage.prototype.setViewPackId = function(packId) {
  this.findPackRecord(packId);
  //not in record
  if (this.currentPack === null) {
    var pack = new Pack();
    pack.getPack(packId);
    pack.version.sort(function(a, b) {
      return a.create_time - b.create_time;
    });
    this.versionIndex = pack.version.length - 1;
    pack.save();
    this.addOrUpdateRecord(packId, pack.version[pack.version.length - 1].id, 0);
    this.findPackRecord(packId);
  }
};

ViewStorage.prototype.updatePos = function(pos) {
  console.log('[updatePos]', this.currentPack.pos, pos);
  this.currentPack.pos = pos;
  console.log('[updatePos]', this.currentPack.pos);
};
