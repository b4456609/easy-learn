/*$(document).on("pageinit", "#login", function() {
  //show saved html
  
  //$('#iframe1').contents().find('#edit').editable("insertHTML", newPackTemp.content, true);
  
 
   var iframe = document.getElementById('iiframe');
	iframe.src = iframe.src;
	console.log("test");
	console.log("tes");
  //save pack in localStorage
  
});
 
 $(document).on("pageshow", "#login", function() {
  //set editor height
  $('#iiframe').load(function() {
    $(this).height($(window).height() - headerHeight - 8);
    $(this).width($(window).width());
  });
});
 
 
 
 
 function test(){
 $('#iiframe').contents().find('#ok').click(pass);
  console.log("test");
 }
 function pass(){
 var test = $('#iiframe').contents().find('#status').html();
	console.log(test);
 
 
   console.log("test");
 
 }
 
*/

function login_check(){
	 var account = document.getElementById('account');
	 var password = document.getElementById('password');
	 localstorage.setitem('account',account);
	 localstorage.setitem('password',password);
	
	
}	