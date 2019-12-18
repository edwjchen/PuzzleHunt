function onHover()
{
    $("#logo").attr('src', 'images/logo-hov.svg');
}

function offHover()
{
    $("#logo").attr('src', 'images/logo2.svg');
}

function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@ucsd.edu$/;
    return re.test(email);
}

function validatePassword(password) { 
    return password.length >= 6 && password.length <= 16;
}

function signupContinue() {
    if (validateEmail($('#signup-email')[0].value) && validatePassword($('#signup-password')[0].value)) {
    	return true;
    } else if (!validateEmail($('#signup-email')[0].value) && !validatePassword($('#signup-password')[0].value)) { 
    	$('#email-signup-wrong').html("*Must be a ucsd.edu email")
    	$('#password-signup-wrong').html("*Must be a within 3 - 16 chars")
    	return false;
    } else if (!validateEmail($('#signup-email')[0].value)) { 
    	$('#email-signup-wrong').html("*Must be a ucsd.edu email")
    	return false;
    } else {
		$('#password-signup-wrong').html("*Must be a within 6 - 16 chars")
    	return false;
    }
} 

function loginContinue() {
    if (validateEmail($('#login-email')[0].value) && validatePassword($('#login-password')[0].value)) {
    	return true;
    } else if (!validateEmail($('#login-email')[0].value) && !validatePassword($('#login-password')[0].value)) { 
    	$('#email-login-wrong').html("*Must be a ucsd.edu email")
    	$('#password-login-wrong').html("*Must be a within 3 - 16 chars")
    	return false;
    } else if (!validateEmail($('#login-email')[0].value)) { 
    	$('#email-login-wrong').html("*Must be a ucsd.edu email")
    	return false;
    } else {
		$('#password-login-wrong').html("*Must be a within 6 - 16 chars")
    	return false;
    }
} 


function signup() {
	$('#email-signup-wrong').html("")
    $('#password-signup-wrong').html("")
	if (signupContinue()) {
		firebase.auth().createUserWithEmailAndPassword($("#signup-email")[0].value, $("#signup-password")[0].value).then(function(user) {
			$.ajax({
                url: "/signup",
                type: "POST",
                data: {
                    email: $("#signup-email")[0].value
                }
            });
		}, function(error) {
		   	$('#email-signup-wrong').html("*Account already made or password is wrong");
		});
	} 
	return false;
}

function login() {
	$('#email-login-wrong').html("")
    $('#password-login-wrong').html("")
	if (loginContinue()) {
		firebase.auth().signInWithEmailAndPassword($("#login-email")[0].value, $("#login-password")[0].value).then(function(user) {
			$.ajax({
                url: "/login",
                type: "POST",
                data: {
                    email: $("#login-email")[0].value
                }
            });
		}, function(error) {
		   $('#email-login-wrong').html("*Account already made or password is wrong");
		});
	} 
	return false;
}

