//changeCurrentPlayer changes the current player to be the logged in user
function changeCurrentPlayer(user, users, isCurrentPlayer) {
    user.currentPlayer = isCurrentPlayer;
    localStorage.setItem("users", JSON.stringify(users))
}

//userExists checks if user with this email and password is already registered
function userExists(email, password, users) {
    let exists = false;
    for(let i = 0; i < users.length; i++) {
        if(users[i].email === email && users[i].password === password) {
            changeCurrentPlayer(users[i], users, true);
            exists = true;
        }else {
            changeCurrentPlayer(users[i], users, false);
        }
    }
    if(exists) {
        return true;
    }else {
        alert("User with this email doesn't exist or wrong email/password")
        return false;
    }   
}

//cleanFields cleans login input fields
function cleanFields() {
    document.getElementById("login-email").value = "";
    document.getElementById("login-password").value = "";
}

//loginUser logins the user. If the credentials input are correct the user is forwarded to the game window
function loginUser() {
    let userEmail = document.getElementById("login-email").value;
    let userPassword = document.getElementById("login-password").value;

    let users = JSON.parse(localStorage.getItem("users"));
    console.log(users);
    if (userExists(userEmail, userPassword, users)) {
        window.open(
            "/views/game.html",
        );
    } else {
        return;
    }
}

//event listnere for submiting the login form
const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", (event) => {
    // Prevent default form submission 
    event.preventDefault();

    loginUser();
    cleanFields();
})