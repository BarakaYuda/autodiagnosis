function openSignup() {
    document.getElementById("signupForm").style.display = "flex";
}

function closeSignup() {
    document.getElementById("signupForm").style.display = "none";
}
function openSignIn(){
    document.getElementById("SIGN_IN_FORM").style.display = "flex";
}
function closeSignin(){
    document.getElementById("SIGN_IN_FORM").style.display = "none";
}


async function handleSignup(event) {
    event.preventDefault(); 
    
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password_hash = document .getElementById("password").value.trim();
    const category = document.getElementById("category").value;

    const userData = {name, email, password_hash,category};

    try{
        const response = await fetch ("http://localhost:3000/api/post", {
        method: "POST",
        headers:{
            "Content-type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    
    const result = await response.json();

    if (response.ok) {
            alert(`Welcome ${name}! Your account has been created successfully as a ${category}. You can now sign in.`);
            closeSignup();
    } else {
            alert(`Registration failed: ${result.error}`);
    }
    } catch (error) {
        console.error("Error submitting form:", error);
        alert("Unable to connect to the server. Make sure your Express backend is running.");
    }
}


async function handleSignin(event) {
    event.preventDefault(); 
    const email = document.getElementById("email").value;
    
    const password_hash = document .getElementById("password").value.trim();

    

    try{
        const response = await fetch ("http://localhost:3000/api/login",{
        method: "POST",
        headers:{
            "Content-type": "application/json"
        },
        body: JSON.stringify({email, password_hash})
    });
        const result = await response.json();

    if (response.ok) {
            alert(`Login successful! Welcome back, ${result.user.name}.`);
            localStorage.setItem("user", JSON.stringify(result.user));
            window.location.href = "dashboard.html";
            closeSignin();
        } else {
            alert(`Sign in failed: ${result.error}`);
        }
    } catch (error) {
        console.error("Sign-in error:", error);
        alert("Unable to connect to the server.");
    }
}
   

