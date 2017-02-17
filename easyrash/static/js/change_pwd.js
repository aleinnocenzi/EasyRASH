$(document).ready(function(){

  $(document).bind('keypress', function(e) {
        if(e.keyCode==13){
            $('button#reset').trigger('click');
        }
  });

  $("#not_match").hide();
  $("#reset").click(function(){
    var mail = $("meta#user").attr("data-name");
    var passwd = $("input#passwd").val();
    var conf_passwd = $("input#conf_passwd").val();
    var reset_data = {
      mail: mail,
      passwd: passwd
    }
    if(passwd === conf_passwd){
      $.ajax({
        type: "POST",
        url: "/api/restorePassword",
        data: reset_data,
        success: function(res){
          window.location.replace('/login');
        },
        error: function(err){
          console.log("error changing password");
        },
      });
    }
    else $("#not_match").show();
  });

});
