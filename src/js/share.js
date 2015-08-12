$(document).on('pageshow', "#share_contact", function() {
  var friend_array;


  facebookConnectPlugin.api("/me/friends", [],
    function(result) {
      console.log(result)
      friend_array=result.data;
      for (i in friend_array) {
          var templete ='<input type="checkbox" name="'+friend_array[i].id+'" id="contact-'+i+'" data-cacheval="true"> <label for="contact-'+i+'">'+friend_array[i].name+'</label></div>';
          $("fieldset").controlgroup("container").append(templete);
      }
      $('input[type=checkbox]').checkboxradio();
      $('fieldset').controlgroup('refresh');

    },
    function(error) {
      //alert('搜索失敗:' + JSON.stringify(error));
      console.log(error);
    }
  );


  $("#share").click(share_friends);


});


function share_friends(){
  var elements = document.querySelectorAll('input[type="checkbox"]:checked');
  var checkedElements = Array.prototype.map.call(elements, function (el, i) {
    return el.name;
  });
  console.log(checkedElements);

  //console.log(user_ID);


   var sendData = '{"User":[';
   var x,length;
   length=checkedElements.length;
   for(x in checkedElements){
     sendData+='{"name":"';
     sendData+=checkedElements[x];
     if(x==length-1){
        sendData+='"}';
        }
     else {
       sendData+='"},'
     }
   }
   sendData+='],"pack":"'+viewPackId+'","userName":"'+(JSON.parse(localStorage.user)).name+'"}';


  var temp1 = JSON.parse(sendData);
  var temp2 = JSON.stringify(temp1);

  console.log(temp2);

  $.ajax({
              url: SERVER_URL+'easylearn/push',
              contentType: 'application/json',
              data: {
                RegID:temp2
              },
              type:'GET',
              success: function(msg){
                  //alert(msg);
              },
               error:function(xhr, ajaxOptions, thrownError){
                  //alert(xhr.status);
                  //alert(thrownError);
               }
    });
}
/*
      run the index's share Pack
*/

$(document).on("pageshow","#share_pack",function(){
  var folderArray = JSON.parse(localStorage.folder);

  var packArray;
  //find current folder in data
  var i;
  for (i in folderArray) {
    if (folderArray[i].id === "allfolder") {
      packArray = folderArray[i].pack;
      break;
    }
  }



  for (i in packArray) {
    var pack = new Pack();
    pack.getPack(packArray[i]);

      //var templete ='<input type="checkbox" name="'+packArray[i].id+'" id="contact-'+i+'" data-cacheval="true"> <label for="contact-'+i+'">'+friend_array[i].name+'</label>';
    if (pack.cover_filename !== "") {
      var templete ='<input type="checkbox" name="'+packArray[i].id+'" id="contact-'+i+'" data-cacheval="true"><label for="contact-'+i+'"><img  style="float:left; width:50%;height : 10%;" src="' + FILE_STORAGE_PATH + pack.id + '/' + pack.cover_filename + '"/><h2>' + pack.name + '</h2><font style="white-space:normal; font-size: small">' + pack.description + '</font></lable></input>';

        }
   else {
     var templete ='<input type="checkbox" name="'+packArray[i].id+'" id="contact-'+i+'" data-cacheval="true"><label for="contact-'+i+'"><img  style="float:left; width:20%;height : 10%;" src="img/light102.png"/><h2>' + pack.name + '</h2><font style="white-space:normal; font-size: small">' + pack.description + '</font></lable></input>';
   }

      $("fieldset").controlgroup("container").append(templete);
  }
  $('input[type=checkbox]').checkboxradio();
  $('fieldset').controlgroup('refresh');
});
