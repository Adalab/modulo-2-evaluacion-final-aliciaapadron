'use strict';
//constantes y variables
const listCoctails = document.querySelector('.js_listCoctails');
const listFavoriteCoctails = document.querySelector('.js_listFavoriteCoctails');
const filteredInput = document.querySelector('.js_inputCoctail');
const buttonSearch = document.querySelector('.js_btnSearch');
// const buttonReset = document.querySelector('.js_btnReset');
let coctails = [];
let favorites = [];

//funciones
//creo la función que se va a ejecutar cuando haga click en el elemento de la lista
function handleFilter(event) {
  event.preventDefault();
  const filteredValue = filteredInput.value;
  //arrays: filter
  const listFiltered = coctails.filter((coctail) => {
    return coctail.strDrink.toLowerCase().includes(filteredValue.toLowerCase());
  });
  paintCoctails(listFiltered);
}

//función que comprueba si el cóctel es favorito ya o no
function handleCoctail(ev) {
  // obtengo el id de la paleta clickada
  const selectedCoctail = ev.currentTarget.id;
  // busco la paleta clickada en el array de paletas
  const objetClicked = coctails.find((coctail) => {
    return coctail.idDrink === selectedCoctail;
  });
  // busco si la paleta clickada está en el array de favoritos
  const favoritesFound = favorites.findIndex((fav) => {
    return fav.idDrink === selectedCoctail;
  });
  // si la paleta no está en favoritos findIndex me ha devuelto -1
  if (favoritesFound === -1) {
    // añado al array de favoritos
    favorites.push(objetClicked);
  } else {
    // si el findIndex me ha devuelto un número mayor o igual a 0 es que sí está en el array de favoritos
    // quiero sacarlo de array de favoritos
    // para utilizar splice necesito el índice del elemento que quiero borrar
    // y quiero borrar un solo elemento por eso colocamos 1
    favorites.splice(favoritesFound, 1);
  }
  // cada vez que modifico los arrays de coctails o de favorites vuelvo a pintar y a escuchar eventos
  paintCoctails(coctails);
}

// escucho eventos sobre los elementos del array
function listenCoctails() {
  // selecciono todos los li pintados de la lista
  const listCoctails = document.querySelectorAll('.js-coctail');
  // recorro el array de los LI para escuchar eventos en cada uno de ellos
  for (const coctailElement of listCoctails) {
    //escucho evento sobre cada una de las paletas
    coctailElement.addEventListener('click', handleCoctail);
  }
}

//función de cóctel favorito
function isFavorite(coctail) {
  //compruebo si la paleta que recibo por parámetro está en los favoritos
  const favoriteFound = favorites.find((fav) => {
    // la dificultad de esta función interna del find es saber que tengo que comparar
    // yo consolearía console.log(fav, palette) para ver los datos que debo comparar
    return fav.idDrink === coctail.idDrink;
  });
  //find devuelve undefined si no lo encuentra, es decir sino esta en el array de favoritos
  //retorno si está o no está en favoritos
  if (favoriteFound === undefined) {
    //retorno false cuando NO está favoritos
    return false;
  } else {
    //retorno true cuando SI está favoritos
    return true;
  }
}
//pintar la lista de cócteles
function paintCoctails(coctails) {
  let html = '';
  //añado la clase si el cóctel es favorito
  let favClass = '';
  if (coctails !== null) {
    for (const coctail of coctails) {
      // obtengo lo que me ha devuelto la funcion que valida si es favorito
      const isFav = isFavorite(coctail);
      //dependiendo es valor devuelto tomo la decision si le añado la clase de favorito o no
      if (isFav) {
        favClass = 'list-coctail-favorite';
        html = paintItemList(coctail, favClass, html);
        listFavoriteCoctails.innerHTML = html;
      } else {
        favClass = '';
        //creo todo el código html
        html = paintItemList(coctail, favClass, html);
        // añado el código html creado a la página
        listCoctails.innerHTML = html;
      }
    }
  }
  //después de añadir o quitar de favoritos escucho de nuevo los eventos
  listenCoctails();
}

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
// // Añadimos la informacion al local storage
// function setInLocalStorage() {
//   // stringify me permite transformar a string el array de palettes
//   const stringCoctails = JSON.stringify(coctails);
//   //añadimos  al localStorage  los datos convertidos en string previamente
//   localStorage.setItem('coctails', stringCoctails);
// }
//hacer el fetch
function getFromApi(ev) {
  let filteredInputValue = filteredInput.value;
  ev.preventDefault();
  fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${filteredInputValue}`
  )
    .then((response) => response.json())
    .then((data) => {
      coctails = data.drinks;
      // pintamos los datos que nos  da la API
      paintCoctails(coctails);
      // los datos que me ha dado la API  los guardamos en el loscalStorage
      //   setInLocalStorage();
      // setInLocalStorage();
    });
}
// esta función  nos permite buscar en el localStorage si hay información guardada
// para no hacer petición al servidor cada vez que cargue la página
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
//eventos
///escuchamos evento sobre el input sobre el que vamos a filtrar
// liElements.addEventListener('click', handleFilter);
buttonSearch.addEventListener('click', getFromApi);

//escuchamos evento sobre el input sobre el que vamos a filtrar
filteredInput.addEventListener('click', handleFilter);
// 1- start app -- Cuando carga la pagina
// getLocalStorage();
