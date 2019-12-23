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


    let urlParams = new URLSearchParams(window.location.search);
    let num = urlParams.get('num');
    $.ajax({
      url: "/verifyDone",
      type: "POST",
      data: {
        team: teamname,
        num: num,
      },
    success: function(data, textStatus, jqXHR) {
      $("#puzzle-box").hide();
      $("#puzzle-done").show();
      $('body').removeClass('is-preload');

    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#puzzle-box").show();
      $("#puzzle-done").hide();
      $('body').removeClass('is-preload');
    }
    });

    $.ajax({
      url: "/verifyAllDone",
      type: "POST",
      data: {
        team: teamname
      },
    success: function(data, textStatus, jqXHR) {
      let arr = data.done;
      arr.forEach(id => {
        $("#"+id).removeClass();
        $("#"+id).addClass("style0");
        $("#"+id).children('a').children('h2').text("Done")
      })
      $('body').removeClass('is-preload');

    },
    error: function (jqXHR, textStatus, errorThrown) {
      $('body').removeClass('is-preload');
    }
    });
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
  $("#answer-error").text("");
  let urlParams = new URLSearchParams(window.location.search);
  let num = urlParams.get('num');
  $.ajax({
    url: "/verify",
    type: "POST",
    data: {
      team: teamname,
      num: num,
      ans: $("#answer").val()
    },
    success: function(data, textStatus, jqXHR) {
      $("#puzzle-box").hide();
      $("#puzzle-done").show();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      let res =  jqXHR.responseJSON.message;
      if (res == "wrong") {
        $("#answer-error").text("*Wrong answer");
      } else if (res == "fast") {
        $("#answer-error").text("*Please wait before submitting again");
      } else {
        $("#answer-error").text("*Server error");
      }
    }
  });
  return false;
}