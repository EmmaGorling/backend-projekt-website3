"use strict"

const url = 'https://backend-projekt-webservice.onrender.com/admin/login';

document.addEventListener('DOMContentLoaded', () => {
    const longinForm = document.getElementById('loginForm');
    longinForm.addEventListener('submit', (event) => {
        event.preventDefault();
        loginUser();
    });
});

async function loginUser() {
    // Get values from inputs
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    // Error-div
    let errorDiv = document.getElementById('errorMsg');

    // Check values
    if(username.length < 1 || password.length < 1) {
        errorDiv.innerHTML = 'Både användarnamn och lösenord behöver fyllas i';
    } else {
        // Create user object
        let user = {
            username: username,
            password: password
        }
        // Fetch to login
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "content-type": "Application/json"
                },
                body: JSON.stringify(user)
            });
            const data = await response.json();
            // Bad request
            if(response.status == 401) {
                errorDiv.innerHTML = 'Fel användarnamn eller lösenord'
            };
            // Ok response - save token to logal storage and redirect to edit
            if(response.ok) {
                const token = data.response.token;
                localStorage.setItem('token', token);
                window.location.href= 'edit.html';
            }
        } catch (error) {
            errorDiv.innerHTML = 'Något verkar ha gått fel..'
        }
    }
}