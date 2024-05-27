"use strict"

const url = 'https://backend-projekt-webservice.onrender.com/menu/dishes';

// DOM-content loaded
document.addEventListener('DOMContentLoaded', () => {
    let token = localStorage.getItem('token');
    if(!token) {
        window.location.href = 'login.html';
    }
    // Get current menu
    getMenu();
    // Get logut button and add event-listener
    let logoutBtn = document.getElementById('logout');
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });
    // Get addform and add eventlistener
    let addForm = document.getElementById('addDish');
    addForm.addEventListener('submit', (event) => {
        event.preventDefault();
        addDish();
    });
});


// Get menu
async function getMenu() {
    try {
        let result = await fetch(url);
        let menu = await result.json();
        categorize(menu);
    } catch (error) {
        const errorDiv = document.getElementById('menu-error');
        errorDiv.innerHTML = `<p>${error}</p>`;
    }
}

// Categorize dishes 
function categorize(menu) {
    // Get dishes by category
    const mixes = menu.filter(dish => dish.category.includes('mix'));
    const nigiri = menu.filter(dish => dish.category.includes('nigiri'));
    const maki = menu.filter(dish => dish.category.includes('maki'));
    const bowls = menu.filter(dish => dish.category.includes('bowls'));
    const sides = menu.filter(dish => dish.category.includes('sides'));
    
    // Get Ul's from document
    const mixUl = document.getElementById('mix');
    const nigiriUl = document.getElementById('nigiri');
    const makiUl = document.getElementById('maki');
    const bowlsUl = document.getElementById('bowls');
    const sidesUl = document.getElementById('sides');

    writeMenu(mixes, mixUl);
    writeMenu(nigiri, nigiriUl);
    writeMenu(maki, makiUl);
    writeMenu(bowls, bowlsUl);
    writeMenu(sides, sidesUl);
}

function writeMenu(dishes, ul) {
    if(dishes.length > 0) {
        dishes.forEach(dish => {
            const li = document.createElement('li');
            li.innerHTML = `
                <h4>${dish.name}</h4>
                <span class='price'>${dish.price} kr</span>
                <span class='ingredients'>${dish.ingredients}</span>
            `;
            // Change-button
            const changeBtn = document.createElement('a');
            changeBtn.textContent = 'Ändra';
            changeBtn.classList = 'changeBtn';
            changeBtn.href = '#edit-section';
            li.appendChild(changeBtn);
            changeBtn.addEventListener('click', () => {
                editDish(dish);
            })
            // Delete-button
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Ta bort';
            deleteBtn.classList = 'delete';
            li.appendChild(deleteBtn);
            deleteBtn.addEventListener('click', () => {
                deleteDish(dish._id);
            });
            ul.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.innerHTML = `
            <h4 class='noDish'>Finns inga rätter i denna kategorin</h4>`;
        ul.appendChild(li);
    }
}

// Add dish
async function addDish() {
    // Get the inputs
    let dishName = document.getElementById('addName');
    let dishIngredients = document.getElementById('addIngredients');
    let dishPrice = document.getElementById('addPrice');
    let dishCategory = document.getElementById('addCategory');
    // Message div
    let msgDiv = document.getElementById('addError');

    // Check input values
    if(dishName.value.length < 1 || dishIngredients.value.length < 1 || dishPrice.value.length < 1) {
        msgDiv.innerHTML = 'Alla fält behöver fyllas i';
    } else {
        //Create dish from inputs
        let dish = {
            name: dishName.value,
            ingredients: dishIngredients.value,
            price: dishPrice.value,
            category: dishCategory.value
        }
        // Add to database with post
        try {
            const response = await fetch(url, {
                method:"POST",
                headers: {
                    "authorization": `Bearer: ${localStorage.getItem('token')}`,
                    "Content-type": "Application/json"
                },
                body: JSON.stringify(dish)
            });
            const data = await response.json();
            // Clear inputs
            dishName.value = '';
            dishIngredients.value = '';
            dishPrice.value = '';
            msgDiv.innerHTML = '';

            getMenu();
        } catch (error) {
            msgDiv.innerHTML = 'Det verkar som att något har gått fel..'
        }
    }
}

// Edit dish (set values and get form)
function editDish(dish) {
    // Get the inputs
    let dishName = document.getElementById('editName');
    let dishIngredients = document.getElementById('editIngredients');
    let dishPrice = document.getElementById('editPrice');
    let dishCategory = document.getElementById('editCategory');
    // Set values
    dishName.value = dish.name;
    dishIngredients.value = dish.ingredients;
    dishPrice.value = dish.price;
    dishCategory.value = dish.category;
    // Get edit form
    let editForm = document.getElementById('editDish');
    editForm.addEventListener('submit', (event) => {
        event.preventDefault();
        saveEdits(dish._id);
    });
}

// Save edits
async function saveEdits(id) {
    // Get the inputs
    let dishName = document.getElementById('editName');
    let dishIngredients = document.getElementById('editIngredients');
    let dishPrice = document.getElementById('editPrice');
    let dishCategory = document.getElementById('editCategory');
    // Message div
    let msgDiv = document.getElementById('editError')
    // Check input values
    if(dishName.value.length < 1 || dishIngredients.value.length < 1 || dishPrice.value.length < 1) {
        msgDiv.innerHTML = 'Alla fält behöver fyllas i';
    } else {
        //Create dish from inputs
        let dish = {
            name: dishName.value,
            ingredients: dishIngredients.value,
            price: dishPrice.value,
            category: dishCategory.value
        }
        // Update dish in database
        try {
            const response = await fetch(url + '/' + id, {
                method:"PUT",
                headers: {
                    "authorization": `Bearer: ${localStorage.getItem('token')}`,
                    "Content-type": "Application/json"
                },
                body: JSON.stringify(dish)
            });
            const data = await response.json();
            // Clear inputs
            dishName.value = '';
            dishIngredients.value = '';
            dishPrice.value = '';
            msgDiv.innerHTML = '';
            getMenu();
            window.location.href = '#currentDishes';
        } catch (error) {
            msgDiv.innerHTML = 'Det verkar som att något har gått fel..'
        }    
    }
}

// Delete a dish
async function deleteDish(id) {
    // Fetch with delete-method
    try {
        const response = await fetch(url + '/' + id, {
            method: "DELETE",
            headers: {
                "authorization": `Bearer: ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        // Get menu again and write it out
        getMenu();
    } catch (error) {
        const msgDiv = document.getElementById('msg');
        msgDiv.innerHTML = 'Något verkar ha gått fel..';
    }
}