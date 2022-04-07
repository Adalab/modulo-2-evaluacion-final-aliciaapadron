'use strict';
//1-Obtener los datos del HTML
let listCoctails = document.querySelector('.js_listCoctails');
const input = document.querySelector('.js_inputCoctail');
const buttonSearch = document.querySelector('.js_btnSearch');
// const buttonReset = document.querySelector('.js_btnReset');
let coctails = [];
//los coctails deben estar dentro del listCoctails
//pintar la lista de cócteles
function paintCoctails(coctails) {
  console.log(coctails);
  let html = '';
  for (const coctail of coctails) {
    console.log(coctail);
    //creo todo el código html
    //favClass --> añade la clase de favorito en caso que corresponda
    html += `<li class="palettes js-palette" id="${coctail.idDrink}">`;
    html += `<h2>${coctail.strDrink}</h2>`;
    html += `<img class="imgcoctail" src=${coctail.strDrinkThumb}>`;
    html += `</li>`;
  }
  // añado el código html creado a la página
  listCoctails.innerHTML = html;
}

//hacer el fetch
function getFromApi(ev) {
  ev.preventDefault();
  let inputValue = input.value;
  fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${inputValue}`
  )
    .then((response) => response.json())
    .then((data) => {
      coctails = data.drinks;
      // pintamos los datos que nos  da la API
      paintCoctails(coctails);
      // los datos que me ha dado la API  los guardamos en el loscalStorage
      //   setInLocalStorage();
    });
}

buttonSearch.addEventListener('click', getFromApi);
