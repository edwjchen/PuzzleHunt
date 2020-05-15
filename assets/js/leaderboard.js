let teamname;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    $("#menu ul").append(`<li><a href="/" onclick="signout()">Sign Out</a></li>`)
    getTeam();
  } else {
  	$(".in-team").hide();
  	getLeaderboard()
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
		  	teamname = data.team;
		} else {
		  	$(".in-team").hide();
		}
		getLeaderboard()
	},
	error: function (jqXHR, textStatus, errorThrown) {
  		$(".in-team").hide();
  		getLeaderboard()
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

function getLeaderboard() {
	$.ajax({
	    url: "/getLeaderboard",
	    type: "GET",
	    success: function(data, textStatus, jqXHR) {
	      populateLeaderboard(data.lb)
	      $('body').removeClass('is-preload');
	    },
	    error: function (jqXHR, textStatus, errorThrown) {
	      $('body').removeClass('is-preload');
	    }
	  });
	setInterval(function() {
		$.ajax({
		    url: "/getLeaderboard",
		    type: "GET",
		    success: function(data, textStatus, jqXHR) {
		      populateLeaderboard(data.lb)
		    },
		    error: function (jqXHR, textStatus, errorThrown) {
		    }
		  });
	}, 60 * 1000)
}

function populateLeaderboard(lb) {
	let count = 0;
	let rank = count+1
	$(".in-team").empty()
	$("#lb").empty();
	lb.forEach(function(arr) {
		if (!arr[3].length) {
			arr[3] = "n/a"
		} else {
			arr[3].map(function(v){return parseInt(v, 10)});
			arr[3].sort(sortNums);
			arr[3] = arr[3].join(', ')
		}
		if (count == 0) {
			$("#lb").append("<tr><td><span style=\"color: #ffd700;\">1st</span></td><td>"+arr[0]+"</td><td>"+arr[3]+"</td><td>"+arr[1]+"/9</td></tr>")
			if (teamname && arr[0] == teamname){
				$(".in-team").append("Team "+teamname+" placed <span style=\"color: #ffd700;\">1st!</span>")
			}
		} else if (count == 1) {
			$("#lb").append("<tr><td><span style=\"color: #c0c0c0;\">2nd</span></td><td>"+arr[0]+"</td><td>"+arr[3]+"</td><td>"+arr[1]+"/9</td></tr>")
			if (teamname && arr[0] == teamname){
				$(".in-team").append("Team "+teamname+" placed <span style=\"color: #c0c0c0;\">2nd!</span>")
			}
		} else if (count == 2) {
			$("#lb").append("<tr><td><span style=\"color: #cd7f32;\">3rd</span></td><td>"+arr[0]+"</td><td>"+arr[3]+"</td><td>"+arr[1]+"/9</td></tr>")
			if (teamname && arr[0] == teamname){
				$(".in-team").append("Team "+teamname+" placed <span style=\"color: #cd7f32;\">3rd!</span>")
			}
		} else {
	  		$("#lb").append("<tr><td>"+rank+"th</td><td>"+arr[0]+"</td><td>"+arr[3]+"</td><td>"+arr[1]+"/9</td></tr>")
	  		if (teamname && arr[0] == teamname){
				$(".in-team").append("Team "+teamname+" placed <span style=\"color: #f2849e;\">"+rank+"th!</span>")
			}
	  	} 
	  	count++;
	  	rank = count+1;
	})
}

function sortNums(a, b) {
  return a - b;
}