let teamname;

firebase.auth().onAuthStateChanged(function(user) {
  if (!user) {
    $(".registered").hide()
	  $("#notregistered").show()
  } else {
    $(".registered").show()
	  $("#notregistered").hide()
    $("#menu ul").append(`<li><a href="/" onclick="signout()">Sign Out</a></li>`)
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
        $(".no-team").hide();
        teamname = data.team;
    } else {
        $(".no-team").show();
        $(".in-team").hide();
    }

    if (data.team) {
      verifyPasscode()
    }


    let urlParams = new URLSearchParams(window.location.search);
    let num = urlParams.get('num');
    if (num){
      $.ajax({
        url: "/verifyDone",
        type: "POST",
        data: {
          team: teamname,
          num: num,
        },
      success: function(data, textStatus, jqXHR) {
        if (data.message == "done") {
          $("#puzzle-box").hide();
          $("#puzzle-done").show();
          $('body').removeClass('is-preload');
        }
        else {
          $("#puzzle-box").show();
          $("#puzzle-done").hide();
          $('body').removeClass('is-preload');
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        
      }
      });
    }

    $.ajax({
      url: "/verifyAllDone",
      type: "POST",
      data: {
        team: teamname
      },
    success: function(data, textStatus, jqXHR) {
      if (data.done != null) {
        let arr = data.done;
        arr.forEach(id => {
          $("#"+id).removeClass();
          $("#"+id).addClass("style0");
          $("#"+id).children('a').children('h2').text("Solved")
        })
        $('body').removeClass('is-preload');
      } else {
        $('body').removeClass('is-preload');
      }

    },
    error: function (jqXHR, textStatus, errorThrown) {

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

function verifyPasscode() {
  $("#passcode-error").text("");
  
  $.ajax({
    url: "/passcode",
    type: "POST",
    data: {
      team: teamname,
      pc: $("#pc").val()
    },
    success: function(data, textStatus, jqXHR) {
      if (data.message == "good") {
        $(".passcode").hide();
        $(".in-team").show();
      } else {
        $(".in-team").hide();
        if (window.location.pathname == "/puzzle" && window.location.search.includes("num")) {
          $("#passcode-error").text("Wrong Passcode");
          window.location.href = window.location.origin + "/puzzle"
        } else if (data.message == "bad passcode") {
          $("#passcode-error").text("Wrong Passcode");
        }
      }
      return false;
    },
    error: function (jqXHR, textStatus, errorThrown) {
    
    }
  });
  return false;
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
      let res =  data.message;
      if (res == "wrong") {
        $("#answer-error").text("*Wrong answer");
      } else if (res == "fast") {
        $("#answer-error").text("*Please wait before submitting again");
      } else {
        $("#puzzle-box").hide();
        $("#puzzle-done").show();
      }
     
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#answer-error").text("*Server error");
    }
  });
  return false;
}

function runCode(value) {
  let urlParams = new URLSearchParams(window.location.search);
  let num = urlParams.get('num');
  $.ajax({
    url: "/runcode",
    type: "POST",
    data: {
      team: teamname,
      num: num,
      ans: value
    },
    success: function(data, textStatus, jqXHR) {
      let res =  data['message'];
      if (res === "fast") {
        $("#output").text("You can only run the code every 2 seconds!");
      } else {
        $("#output").text(res);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      let res =  jqXHR.responseJSON.message;
      $("#output").text(res);
    }
  });
  return false;
}

async function setupFormation(wave) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "/setupFormation",
      type: "POST",
      data: {
        team: teamname,
        wave: wave
      },
      success: function(data, textStatus, jqXHR) {
        let res =  data['message'];
        console.log(res);
        resolve(res);
      },
      error: function (response) {
        reject(response)
      }
    });
  })
}

async function makeMove(pos) {
  var x = Math.floor(pos.x/100);
  var y = Math.floor(pos.y/100);

  return new Promise((resolve, reject) => {
    $.ajax({
      url: "/tictactoe",
      type: "POST",
      data: {
        team: teamname,
        x: x,
        y: y
      },
      success: function(data, textStatus, jqXHR) {
        if (data.board){
          resolve(data);
        } else {
          resolve("bad move");
        }
      },
      error: function (response) {
        reject(response)
      }
    });
  })
}

function resetBoard(pos) {
  $.ajax({
    url: "/resetBoard",
    type: "POST",
    data: {
      team: teamname,
    },
    success: function(data, textStatus, jqXHR) {
    
    },
    error: function (response) {
      
    }
  });
}

async function getBoard() {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(function(user) {
      if (!user) {
        reject("no user")
      }
      $.ajax({
        url: "/getTeam",
        type: "POST",
        data: {
          uid: firebase.auth().currentUser.uid,
        },
        success: function(data, textStatus, jqXHR) {
          if (data.team) {
            $.ajax({
              url: "/getBoard",
              type: "POST",
              data: {
                team: teamname,
              },
              success: function(data, textStatus, jqXHR) {
                resolve(data.board)
              },
              error: function (response) {
                reject('team not found')
              }
            });
          }
        }
      })
    })
  })
}