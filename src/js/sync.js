function test_prepare_data() {
  var data = {
    "user": {
      "id": "00157016",
      "name": "bernie",
      "setting": {
        "wifi_sync": true,
        "mobile_network_sync": true,
        "last_sync_time": "2015-04-22 21:30:29.0"
      }
    },
    "packId": {
      "creator_user_id": "00157016",
      "create_time": "2015-03-19 21:43:10.0",
      "name": "firstPackName",
      "is_public": false,
      "description": "description",
      "version": [{
        "creator_user_id": "00157016",
        "bookmark": [{
          "name": "name",
          "id": "ff",
          "position": 123
        }],
        "note": [{
          "color": 1,
          "create_time": "2015-03-19 21:30:29.0",
          "user_id": "00157016",
          "comment": [{
            "note_id": "noteId",
            "create_time": "2015-03-19 21:30:29.0",
            "name": "bernie",
            "id": "commentId",
            "content": "commentContent"
          }],
          "id": "noteId",
          "content": "content"
        }],
        "file": [{
          "filename": "filename"
        }],
        "create_time": "2015-03-19 21:30:29.0",
        "is_public": false,
        "id": "versionId",
        "content": "vvery_long_content"
      }],
      "tags": "tagsJsonArray"
    },
    "folder": [{
      "user_id": "00157016",
      "name": "newFolderName",
      "id": "folderId",
      "pack": [{
        "pack_id": "packId"
      }]
    }]
  };

    var json = JSON.stringify(data);
    console.log(json);
  $.ajax({
    method: "POST",
    url: 'http://140.121.197.135:11116/easylearn/sync',
    data: {sync_data: json},
  }).done(function( result ) {
    console.log(result);
  });
}
