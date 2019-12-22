firebase.auth().onAuthStateChanged(function(user) {
  if (!user) {
    $(".registered").hide()
	  $("#notregistered").show()
  } else {
    $(".registered").show()
	  $("#notregistered").hide()
    $("#menu ul").append(`<li><a href="index.html" onclick="signout()">Sign Out</a></li>`)
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