'use strict';
//VARIABLES Y CONSTANTES GLOBALES//
const listFavoriteCoctails = document.querySelector('.js_listFavoriteCoctails');
const listCoctails = document.querySelector('.js_listCoctails');
const searchInputTitle = document.querySelector('.js_inputCoctail');
const buttonSearch = document.querySelector('.js_btnSearch');
const buttonReset = document.querySelector('.js_btnReset');
const buttonResetFav = document.querySelector('.js-button_reset_fav');
const defaultImage =
  'https://via.placeholder.com/210x295/ffffff/666666/?text=coctail%20img';

let data = []; //listado búsqueda
let dataFav = []; //listado favoritos

//FUNCIÓN PARA HACER EL FETCH CON LA API
function fetchItems() {
  fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchInputTitle.value}`
  )
    .then((response) => response.json())
    .then((dataFromApi) => {
      data = dataFromApi.drinks;
      renderAllItems();
    });
}
//FUNCIÓN PARA CARGAR LA LISTA DEL ITEM BUSCADO
function renderAllItems() {
  listCoctails.innerHTML = ''; //pongo la lista vacía
  if (data !== null) {
    //si el cóctel que busco existe haré el siguiente for
    for (const eachCoctail of data) {
      renderItem(eachCoctail); //carga la información de cada item/pinta cada li
    }
    const coctailLists = document.querySelectorAll('.js-list'); //coge todos los elementos que tenga esa clase
    for (const eachCoctailList of coctailLists) {
      eachCoctailList.addEventListener('click', handleCoctailFav);
    }
  } else {
    //si el cóctel que busco no existe me saldrá el siguiente mensaje
    listCoctails.innerHTML = 'Cóctel no encontrado';
  }
}
//FUNCIONES APRA PINTAR EN EL HTML
//PINTAR EL ITEM
function renderItem(data) {
  let imageUrl = data.strDrinkThumb;
  if (data.strDrinkThumb === null) {
    imageUrl = defaultImage;
  }
  const list = document.createElement('li');
  list.classList.add('js-list');
  list.classList.add('generalcoctails__list--item');
  list.dataset.name = data.strDrink;
  list.dataset.alcoholic = data.strAlcoholic;
  list.dataset.img = imageUrl;
  console.log(list.dataset.alcoholic);
  let html = `<img class="js-image generalcoctails__list--img" src="${imageUrl}" alt="${data.strDrink}">`;
  html += `<h3 class="generalcoctails__list--title js-card__title">${data.strDrink}</h3>`;

  if (list.dataset.alcoholic !== 'Non alcoholic') {
    html += `<p class="generalcoctails__list--alcoholic js-card__alcoholic">Tiene alcohol</p>`;
  } else {
    html += `<p class="generalcoctails__list--alcoholic js-card__alcoholic">Sin alcohol</p>`;
  }

  list.innerHTML = html;
  const isFav = dataFav.find((fav) => fav.name === data.strDrink);
  if (isFav !== undefined) {
    list.classList.add('js-fav');
  }

  listCoctails.appendChild(list); //añado los li al ul
}
//PINTAR LOS ITEMS FAVORITOS
function renderAllItemsFav() {
  listFavoriteCoctails.innerHTML = ''; //pongo la lista vacía

  for (const eachCoctailFav of dataFav) {
    renderItemFav(eachCoctailFav);
  }
  const botones = document.querySelectorAll('.js-favItem');

  for (const eachboton of botones) {
    eachboton.addEventListener('click', handleBoton);
  }
}
//PINTAR EL ITEM FAVORITO
function renderItemFav(dataFav) {
  const li = document.createElement('li');
  let imageUrl = dataFav.img;

  if (dataFav.img === null) {
    imageUrl = defaultImage;
  }
  li.classList.add('js-favItem');
  li.dataset.name = dataFav.name;
  li.dataset.img = imageUrl;
  let html = `<i class="fa-solid fa-circle-xmark"></i><img class="js-image generalcoctails__list--img" src="${imageUrl}" alt="" placeholder="">`;
  html += `<h3 class="generalcoctails__list--title js-card__title">${dataFav.name}</h3>`;
  li.innerHTML = html;

  listFavoriteCoctails.appendChild(li);
  console.log(dataFav.name);
}

//FUNCIONES MANEJADORAS
//FUNCIÓN MANEJADORA DEL BOTÓN X
function handleBoton(event) {
  let newDataFav = dataFav.filter((item) => {
    return item.name !== event.currentTarget.dataset.name;
  });
  dataFav = newDataFav;
  renderAllItemsFav();
  renderAllItems();
  setInLocalStorage();
}
//FUNCIÓN QUE SE EJECUTA AL HACER CLICK EN EL BOTÓN BUSCAR
//SIRVE PARA EJECUTAR LA LLAMADA A LA API
function handleCoctailTitle(event) {
  event.preventDefault();
  fetchItems();
}
//FUNCIÓN QUE SE EJECUTA AL HACER CLICK EN UN ITEM DE LA LISTA
function handleCoctailFav(event) {
  const existsFav = dataFav.find(
    (fav) => fav.name === event.currentTarget.dataset.name
  );

  if (existsFav === undefined) {
    dataFav.push(event.currentTarget.dataset); //añade un elemento al array
    event.currentTarget.classList.add('list-coctail-favorite'); //le añade una clase
    setInLocalStorage(); //lo añade al LocalStorage
    renderAllItemsFav(); //vuelve a crear la lista de favoritos
  } else {
    alert('El cóctel seleccionado ya está en la lista de favoritos'); //si está en la lista
  }
}

//FUNCIÓN PARA BORRAR TODOS LOS FAVORITOS
function handleClickResetAllFav() {
  dataFav = [];
  localStorage.clear();
  renderAllItemsFav();
}
//FUNCIÓN PARA BORRAR TODA LA LISTA
function handleClickResetAllList() {
  data = [];
  localStorage.clear();
  renderAllItems();
}
//FUNCIÓN PARA BORRAR TODO
function handleClickResetAll() {
  searchInputTitle.value = '';
  handleClickResetAllFav();
  handleClickResetAllList();
}
//FUNCIÓN PARA COLOCAR EN EL LOCALSTORAGE
function setInLocalStorage() {
  //convertir el array en un objeto JSON y eso se guarda en la memoria del navegador
  localStorage.setItem('dataLocalStorageFav', JSON.stringify(dataFav));
}
//FUNCIÓN PARA TRAEL DEL LOCALSTORAGE
function getFromLocalStorage() {
  const savedDataFav = localStorage.getItem('dataLocalStorageFav');
  if (savedDataFav === null) {
    dataFav = [];
  } else {
    dataFav = JSON.parse(savedDataFav);
    renderAllItemsFav();
  }
}

//FUNCIÓN QUE SE EJECUTA AL INICIAR LA WEB
getFromLocalStorage();

//--------------------------------EVENTOS-------------------------------------------
buttonSearch.addEventListener('click', handleCoctailTitle);
buttonResetFav.addEventListener('click', handleClickResetAllFav);
buttonReset.addEventListener('click', handleClickResetAll);
