function signInMessage() {
  // document.cookie = "user=Yourmother";
  console.log("doing this");

  var signedIn = window.sessionStorage.getItem("user")??window.localStorage.getItem("user");

  homeheaderStuff(signedIn);


}

function homeheaderStuff(username) {
  document.getElementById("homeHeader").innerHTML = "Welcome back, " + username +"!";
}

function loginBtn(isLoggedIn) {
  if (isLoggedIn) {
    //change button to a log out button instead;
    document
      .getElementById("logInOrOut")
      .setAttribute("onClick", "javascript: logOut();");
    document.getElementById("logInOrOut").innerHTML = "Log Out";
  } else {
    document
      .getElementById("logInOrOut")
      .setAttribute("onClick", "javascript: logIn();");
    document.getElementById("logInOrOut").innerHTML = "Log In";
    document.getElementById(
      "logInOutDiv"
    ).innerHTML += `<button id="signUp" onClick="signUp()">Sign Up</button>`;
  }
}