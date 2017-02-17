$(document).ready(function(){

	$(document).bind('keypress', function(e) {
        if(e.keyCode==13){
        	if($('#form-s').is(':visible')){

            	$('button#signup').trigger('click');

        	} else if($('#form-l').is(':visible')){

            	$('button#accedi').trigger('click');

        	} else if($('#form-r').is(':visible')){

            	$('button#recupera').trigger('click');

        	}
        }
	});

	$(".message a#fd").click(function(){
		$('#form-l').animate({height: "toggle", opacity: "toggle"}, "slow");
		$("#developers").hide();
	});

	$('.message a#subscribe').click(function(){
		$('#form-s').animate({height: "toggle", opacity: "toggle"}, "slow");
		$('#form-l').hide();
		$('#form-r').hide();
	});
	$('.message a#back-login').click(function(){
		$('#form-l').animate({height: "toggle", opacity: "toggle"}, "slow");
		$('#form-s').hide();
		$('#form-r').hide();
	});
	$('.reset a#rescue').click(function(){
		$('#form-r').animate({height: "toggle", opacity: "toggle"}, "slow");
		$('#form-l').hide();
		$('#form-s').hide();
	});

	$("#accedi").click(function(){
		var email = $("#l-mail").val();
		var pass = $("#l-login_passwd").val();
		var data = {
			email: email,
			passwd: pass
		};
		if(!checkEmptyFields(email, pass)){
			var current_url = $(location).attr('href');
			$.ajax({
				type: "POST",
				url: current_url,
				data: data,
				dataType: "json",
				error: function(err){
					console.log(err);
				},
				success: function(res){
					console.log(res);
					window.location.replace('/');
				},
				statusCode: {
					401: function(){
						$("#l-mail").val('');
						$("#l-login_passwd").val('');
						$("#unauthorized").show();
					}
				}
			});
		} else showCompulsory("login");
	});

	$('button#signup').click(function(){
		var nome = $("#s-nome").val();
		var cognome = $("#s-cognome").val();
		var email = $("#s-mail").val();
		var sex = $("#s-sesso").val();
		var passwd = $("#s-passwd").val();
		var conferma_passwd = $("#s-conferma_passwd").val();
		var data = {
			nome: nome,
			cognome: cognome,
			email: email,
			sex: sex,
			passwd: passwd,
		};
		if(passwd != conferma_passwd) {
			$('#p-different').show();
			$('#p-different').delay(3000).fadeOut(1000);
		}
		else{
			if(!checkEmptyFields(nome, cognome, email, passwd, conferma_passwd)){
				$.ajax({
					type: "POST",
					url: "/api/reqSignup",
					data: data,
					dataType: "json",
					statusCode: {
						200: function(){
							window.location.replace('/signup/sent');
						},
						409: function(){
							$('#u-exists').show();
							$('#u-exists').delay(3000).fadeOut(1000);
						}
					}
				});
			}  else showCompulsory("signUp");
	}
	});

	$('button#recupera').click(function(){
		var email = $("#r-mail").val();
		var data = {
			email: email,
		};
		if(!checkEmptyFields(email)){
			$.ajax({
				type: "POST",
				url: "/api/reqChangePasswd",
				data: data,
				dataType: "json",
				statusCode: {
					200: function(){
						window.location.replace('/restore/sent');
					},
					400: function(){
						$('#not-exist').show();
						$('#not-exist').delay(3000).fadeOut(1000);
					},
					409: function(){
						$('#not-exist').show();
						$('#not-exist').delay(3000).fadeOut(1000);
					}
				}
			});
		} else showCompulsory("resetPwd");
	});

	function checkEmptyFields(){ //ritorna 1 se i campi sono vuoti
		switch (arguments.length) {
			case 1:
				if(arguments[0].trim()=== '') return 1;
				else return 0;
				break;
			case 2:
				if(arguments[0].trim() === '' || arguments[1].trim() === '') return 1;
				else return 0;
				break;
			case 5:
				for(i = 0; i < arguments.length; i++){
					if(arguments[i].trim() === '') return 1;
				}
				return 0;
				break;
			default:

		}
	}

	function showCompulsory(arg){
		$(".compulsory").removeClass("compulsory-shown");
		$(".compulsory").addClass("compulsory-hidden");
		$(".form input").removeClass("error");
		switch(arg){
			case "resetPwd":
				$("#r-mail_").removeClass("compulsory-hidden");
				$("#r-mail_").addClass("compulsory-shown");
				$("input#r-mail").addClass("error");
				break;
			case "login":
				$("form#form-l div.input-container input").each(function(){
					if($(this).val().trim()===''){
						$("#"+$(this).attr("id")+"_").removeClass("compulsory-hidden");
						$("#"+$(this).attr("id")+"_").addClass("compulsory-shown");
						$(this).addClass("error");
					}
				});
				break;
			case "signUp":
				$("form#form-s div.input-container input").each(function(){
					if($(this).val().trim()===''){
						$("#"+$(this).attr("id")+"_").removeClass("compulsory-hidden");
						$("#"+$(this).attr("id")+"_").addClass("compulsory-shown");
						$(this).addClass("error");
					}
				});
				break;
		}
	}
});
