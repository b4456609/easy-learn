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
      alert('搜索失敗:' + JSON.stringify(error));
      console.log(error);
    }
  );


  $("#share").click(share_friends);

/*
  <fieldset data-role="controlgroup" id="choose_contact">

    <input type="checkbox" name="contact-2a" id="contact-2a">
    <label for="contact-2a">Doritos</label>

    <input type="checkbox" name="contact-3a" id="contact-3a">
    <label for="contact-3a">Fritos</label>

    <input type="checkbox" name="contact-4a" id="contact-4a">
    <label for="contact-4a">Sun Chips</label>
  </fieldset>
  */

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
   sendData+=']}';
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
                  alert(msg);
              },
               error:function(xhr, ajaxOptions, thrownError){
                  alert(xhr.status);
                  alert(thrownError);
               }
    });



}
