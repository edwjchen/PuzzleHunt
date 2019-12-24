firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    $("#menu ul").append(`<li><a href="/" onclick="signout()">Sign Out</a></li>`)
  }
  $('body').removeClass('is-preload'); 
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
    localStorage.clear();
	  // Sign-out successful.
	}).catch(function(error) {
	  // An error happened.
	});
}