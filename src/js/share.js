$(document).on('pageshow', "#share_contact", function() {
  var friend_array;


  facebookConnectPlugin.api("/me/friends", [],
    function(result) {
      console.log(result)
      friend_array=result.data;
      console.log("Friedns:"+friend_array[0].name);

      for (i in friend_array) {
          var templete ='<input type="checkbox" name="contact-'+i+'" id="contact-'+i+'" data-cacheval="true"> <label for="contact-'+i+'">'+friend_array[i].name+'</label></div>';
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
