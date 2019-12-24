firebase.auth().onAuthStateChanged(function(user) {
  if (!user) {
    $(".registered").hide()
	$("#notregistered").show()
  } else {
    $(".registered").show()
	$("#notregistered").hide()
    $("#menu ul").append(`<li><a href="/" onclick="signout()">Sign Out</a></li>`)
    $("#intro_title").text("Welcome "+user.displayName.split(" ")[0]+"!");
    getTeam();
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
		  	$("#teamname").text(data.team);
		  	if (data.team_leader){
		  		$("#secretkeydisplay").text(data.secretkey);
		  	} else {
		  		$("#secretkeydisplay").text("Ask the team leader!");
		  	}
		} else {
		  	$(".no-team").show();
		  	$(".in-team").hide();
		}
		$('#members').empty();
		data.emails.forEach(function(email) {
			$('#members').append(`<li>`+email+`</li>`)
		}) 
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

function quitTeam() {
	$("#create-error").text("")
	$("#join-error").text("")
	$.ajax({
        url: "/quitTeam",
        type: "POST",
        data: {
        	uid: firebase.auth().currentUser.uid,
            teamname: $("#teamname").text()
        },
        success: function(data, textStatus, jqXHR) {
    		window.location.reload();
		},
		error: function (jqXHR, textStatus, errorThrown) {
			$("#create-error").text("Team name already taken!")
		}
    });
	return false;
}

function createTeam() {
	$("#create-error").text("")
	$("#join-error").text("")
	$.ajax({
        url: "/createTeam",
        type: "POST",
        data: {
        	uid: firebase.auth().currentUser.uid,
            teamname: $("#create-teamname").val()
        },
        success: function(data, textStatus, jqXHR) {
    		window.location.reload();
		},
		error: function (jqXHR, textStatus, errorThrown) {
			$("#create-error").text("Team name already taken!")
		}
    });
	return false;
}

function joinTeam() {
	$("#create-error").text("")
	$("#join-error").text("")
	$.ajax({
        url: "/joinTeam",
        type: "POST",
        data: {
        	uid: firebase.auth().currentUser.uid,
            teamname: $("#join-teamname").val(),
            secretkey: $("#secretkey").val()
        },
        success: function(data, textStatus, jqXHR) {
    		window.location.reload();
		},
		error: function (jqXHR, textStatus, errorThrown) {
			$("#join-error").text("Team does not exist or secret key is wrong!")
		}
    });
	return false;
}