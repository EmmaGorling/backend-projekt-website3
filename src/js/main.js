"use strict"

const url = 'https://backend-projekt-webservice.onrender.com/menu/dishes';

window.onload = init;

function init() {
    // Get menu from API
    getMenu();
}

async function getMenu() {
    try {
        let result = await fetch(url);
        let menu = await result.json();
        categorize(menu);
    } catch (error) {
        console.log(error);
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
            ul.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.innerHTML = `
            <h4 class='noDish'>Finns inga rätter i denna kategorin</h4>`;
        ul.appendChild(li);
    }
}