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
    $("#sign-in-opts").css('display', 'block-inline');
  } else {
  	$("#sign-in-opts").css('display', 'none');
    $("#menu ul").append(`<li><a href="index.html" onclick="signout()">Sign Out</a></li>`)
  }
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
                email: result.user.email
            },
            success: function(data, textStatus, jqXHR) {
			    $("#menu ul").append(`<li><a href="index.html" onclick="signout()">Sign Out</a></li>`)
        		window.location.href = 'team.html';
			},
			error: function (jqXHR, textStatus, errorThrown) {
				$("#signup-error").text("* Email already registered as an account")
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
                email: result.user.email
            },
            success: function(data, textStatus, jqXHR) {
			    $("#sign-in-opts").css('display', 'none');
			    $("#menu ul").append(`<li><a href="index.html" onclick="signout()">Sign Out</a></li>`)
        		window.location.href = 'team.html';
			},
			error: function (jqXHR, textStatus, errorThrown) {
				$("#login-error").text("* Email is not registered as an account")
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

