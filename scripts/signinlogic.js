

function signInLogic(){

    //check if user is signed in if not throw them at the login page


    //find the fucking token

    token = window.localStorage.getItem('token');
    if(token == null) {
        token = window.sessionStorage.getItem('token');
    }
    console.log(token);
    if(token == null){ //this is janky and bad, should find a better way someday.
        alert("not signed in.");
        window.location.replace("login.html");

    }
}