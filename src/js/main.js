'use strict';
//-----------------------------------------constantes y variables
const listCoctails = document.querySelector('.js_listCoctails');
const listFavoriteCoctails = document.querySelector('.js_listFavoriteCoctails');
const filteredInput = document.querySelector('.js_inputCoctail');
const buttonSearch = document.querySelector('.js_btnSearch');
// const buttonReset = document.querySelector('.js_btnReset');
let coctails = [];
let favorites = [];

//-----------------------------------------funciones
//FUNCIÓN PARA ESCUCHAR CADA ITEM DE LA LISTA
function handleFilter(event) {
  event.preventDefault();
  const filteredValue = filteredInput.value;
  const listFiltered = coctails.filter((coctail) => {
    return coctail.strDrink.toLowerCase().includes(filteredValue.toLowerCase());
  });
  paintCoctails(listFiltered);
}

//FUNCIÓN PARA SABER SI ES FAVORITO
function handleCoctail(ev) {
  const selectedCoctail = ev.currentTarget.id;
  const objetClicked = coctails.find((coctail) => {
    return coctail.idDrink === selectedCoctail;
  });
  const favoritesFound = favorites.findIndex((fav) => {
    return fav.idDrink === selectedCoctail;
  });
  if (favoritesFound === -1) {
    favorites.push(objetClicked);
  } else {
    favorites.splice(favoritesFound, 1);
  }
}

// FUNCIÓN PARA ESCUCHAR LOS EVENTOS DE LOS COCTAILS
function listenCoctails() {
  const listCoctails = document.querySelectorAll('.js-coctail');
  for (const coctailElement of listCoctails) {
    coctailElement.addEventListener('click', handleCoctail);
  }
}

//FUNCIÓN ENCOTRAR LOS FAVORITOS
function isFavorite(coctail) {
  const favoriteFound = favorites.find((fav) => {
    return fav.idDrink === coctail.idDrink;
  });
  if (favoriteFound === undefined) {
    return false;
  } else {
    return true;
  }
}

//FUNCIÓN PARA PINTAR LAS LISTAS DE CÓCTELES
function paintCoctails(coctails) {
  let html = '';
  let favClass = '';
  if (coctails !== null) {
    for (const coctail of coctails) {
      const isFav = isFavorite(coctail);
      if (isFav) {
        favClass = 'list-coctail-favorite';
        html = paintItemList(coctail, favClass, html);
        listFavoriteCoctails.innerHTML = html;
      } else {
        favClass = '';
        html = paintItemList(coctail, favClass, html);

        listCoctails.innerHTML = html;
      }
    }
  }
  listenCoctails();
}

//FUNCIÓN PARA PINTAR LOS ITEMS DE LAS LISTAS
function paintItemList(item, classCss, html) {
  html += `<li class="coctail js-coctail ${classCss}" id="${item.idDrink}">`;
  html += `<h2>${item.strDrink}</h2>`;
  if (item.strDrinkThumb !== null) {
    html += `<img class="imgcoctail" src=${item.strDrinkThumb}>`;
  } else {
    html += `<img class="imgcoctail" src="https://via.placeholder.com/210x295/ffffff/666666/?text=coctail%20img">`;
  }
  html += `</li>`;
  return html;
}

// // FUNCIÓN PARA AÑADIR INFORMACIÓN AL LOCAL STORAGE
// function setInLocalStorage() {
//   // stringify me permite transformar a string el array de palettes
//   const stringCoctails = JSON.stringify(coctails);
//   //añadimos  al localStorage  los datos convertidos en string previamente
//   localStorage.setItem('coctails', stringCoctails);
// }

//FUNCIÓN PARA HACER EL FETCH CON LA API
function getFromApi(ev) {
  let filteredInputValue = filteredInput.value;
  ev.preventDefault();
  fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${filteredInputValue}`
  )
    .then((response) => response.json())
    .then((data) => {
      coctails = data.drinks;
      paintCoctails(coctails);
      // setInLocalStorage();
    });
}
// FUNCIÓN PARA TRAER EL LOCALSTORAGE
// function getLocalStorage() {
//   // obtenermos lo que hay en el LS
//   const localStorageCoctails = localStorage.getItem('coctails');
//   // siempre que cojo datos del local storage tengo que comprobar si son válidos
//   // es decir si es la primera vez que entro en la página
//   if (localStorageCoctails === null) {
//     // no tengo datos en el local storage, así que llamo al API
//     getFromApi();
//   } else {
//     // sí tengo datos en el local storage, así lo parseo a un array y
//     const arrayCoctails = JSON.parse(localStorageCoctails);
//     // lo guardo en la variable global de palettes
//     coctails = arrayCoctails;
//     // cada vez que modifico los arrays de palettes o de favorites vuelvo a pintar y a escuchar eventos
//     paintCoctails(coctails);
//   }
// }
//FUNCIÓN RESET
// function handleReset() {}
//---------------------------------------------eventos
buttonSearch.addEventListener('click', getFromApi);
filteredInput.addEventListener('click', handleFilter);
// buttonReset.addEventListener('click', handleReset);

// getLocalStorage();
