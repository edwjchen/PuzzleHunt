let teamname;

firebase.auth().onAuthStateChanged(function(user) {
  if (!user) {
    $(".registered").hide()
	  $("#notregistered").show()
  } else {
    $(".registered").show()
	  $("#notregistered").hide()
    $("#menu ul").append(`<li><a href="index" onclick="signout()">Sign Out</a></li>`)
    getTeam()
  }
});

function getTeam() {
  $.ajax({
    url: "/getTeam",
    type: "POST",
    data: {
      uid: firebase.auth().currentUser.uid,
    },
    success: function(data, textStatus, jqXHR) {
      if (data.team != '') {
        $(".in-team").show();
        $(".no-team").hide();
        teamname = data.team;
    } else {
        $(".no-team").show();
        $(".in-team").hide();
    }

    $('body').removeClass('is-preload');
  },
  error: function (jqXHR, textStatus, errorThrown) {
    $(".no-team").show();
    $(".in-team").hide();
    $('body').removeClass('is-preload');
  }
  });
}

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

function verify() {
  $.ajax({
    url: "/verify",
    type: "POST",
    data: {
      teamname: teamname,
      ans: $("#answer").val()
    },
    success: function(data, textStatus, jqXHR) {
    
    },
    error: function (jqXHR, textStatus, errorThrown) {
      
    }
  });
}