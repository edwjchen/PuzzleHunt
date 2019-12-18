firebase.auth().onAuthStateChanged(function(user) {
  if (!user) {
    $(".registered").css('display', 'none')
	$("#notregistered").css('display', 'block')
  } else {
    $(".registered").css('display', 'block')
	$("#notregistered").css('display', 'none')
    $("#menu ul").append(`<li><a href="index.html" onclick="signout()">Sign Out</a></li>`)
  }
});


function onHover()
{
    $("#logo").attr('src', 'images/logo-hov.svg');
}

function offHover()
{
    $("#logo").attr('src', 'images/logo2.svg');
}

function signout() {
	firebase.auth().signOut().then(function() {
	  // Sign-out successful.
	}).catch(function(error) {
	  // An error happened.
	});
}