var provider = new firebase.auth.GoogleAuthProvider();

function onHover()
{
    $("#logo").attr('src', 'images/logo-hov.svg');
}

function offHover()
{
    $("#logo").attr('src', 'images/logo2.svg');
}

firebase.auth().onAuthStateChanged(function(user) {
  if (!user) {
    $("#sign-in-opts").show();
  } else {
  	$("#sign-in-opts").hide();
    $("#menu ul").append(`<li><a href="/" onclick="signout()">Sign Out</a></li>`)
  }
  $('body').removeClass('is-preload');
});

function signup() {
	$("#login-error").text("")
	$("#signup-error").text("")
	firebase.auth().signInWithPopup(provider).then(function(result) {
		// This gives you a Google Access Token. You can use it to access the Google API.
		var token = result.credential.accessToken;
		// The signed-in user info.
		var user = result.user;
		$.ajax({
            url: "/signup",
            type: "POST",
            data: {
            	uid: result.user.uid,
                email: result.user.email
            },
            success: function(data, textStatus, jqXHR) {
				if (data.message == "exist") {
					$("#signup-error").text("* Email already registered as an account")
					$("#menu ul li:last").remove();
					signout();
				} else {
					window.location.href = 'team';
				}
        	},
			error: function (jqXHR, textStatus, errorThrown) {	
			}
        });
	}).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
	});
	return false;
}

function login() {
	$("#login-error").text("")
	$("#signup-error").text("")
	firebase.auth().signInWithPopup(provider).then(function(result) {
		// This gives you a Google Access Token. You can use it to access the Google API.
		var token = result.credential.accessToken;
		// The signed-in user info.
		var user = result.user;
		$.ajax({
            url: "/login",
            type: "POST",
            data: {
                uid: result.user.uid
            },
            success: function(data, textStatus, jqXHR) {
				if (data.message == "noexist") {
					$("#menu ul li:last").remove();
					$("#login-error").text("* Email is not registered as an account")
					signout();
				} else {
					window.location.href = 'team';
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
			}
        });
	}).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
	});
	return false;
}

function signout() {
	firebase.auth().signOut().then(function() {
	  // Sign-out successful.
	}).catch(function(error) {
	  // An error happened.
	});
}



