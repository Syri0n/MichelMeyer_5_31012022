// Récupération des données localStorage
const datasInStorage = JSON.parse(localStorage.getItem("cart"));

// Récupération des quantités des différents produits du panier
const listOfQuantity = document.getElementsByClassName("itemQuantity");

// Balise pour l'insertion de la quantité totale de produits
let totalQuantity = document.getElementById("totalQuantity");

// Balise pour l'insertion du prix total
let totalPrice = document.getElementById("totalPrice");

// Récupération de l'url de la page produit
const queryStringUrl = window.location.search;

// Extraction de l'id
const urlSearchParams = new URLSearchParams(queryStringUrl);
const newOrderId = urlSearchParams.get("id");

// Création d'un ajout d'article dans le panier
function createCart(product) {
  // Création de la section pour afficher les détails d'un article
  let article = document.createElement("article");
  article.classList.add("cart__item");
  article.dataset.id = product.id;

  let items = document.getElementById("cart__items");
  items.appendChild(article);

  // Ajout de l'image
  let imageItemContent = document.createElement("div");
  imageItemContent.classList.add("cart__item__img");

  let imageItem = document.createElement("img");
  imageItem.src = product.imageUrl;
  imageItem.alt = product.altTxt;

  imageItemContent.appendChild(imageItem);
  article.appendChild(imageItemContent);

  // Ajout de la section pour ajouter le nom du produit et son prix
  let content = document.createElement("div");
  content.classList.add("cart__item__content");

  let contentTitlePrice = document.createElement("div");
  contentTitlePrice.classList.add("cart__item__content__titlePrice");

  let settings = document.createElement("div");
  settings.classList.add("cart__item__content__settings");

  content.appendChild(contentTitlePrice);
  content.appendChild(settings);
  article.appendChild(content);

  // Ajout du nom du produit
  let titleProduct = document.createElement("h2");
  titleProduct.innerHTML = product.name;
  contentTitlePrice.appendChild(titleProduct);

  // Ajout du prix du produit
  let priceProduct = document.createElement("p");
  priceProduct.innerHTML = product.price + " €";
  contentTitlePrice.appendChild(priceProduct);

  // Ajout de la couleur choisie pour le produit
  let productColor = document.createElement("p");
  productColor.innerHTML = product.color;
  settings.appendChild(productColor);

  // Ajout de la quantité choisie
  let settingsQuantity = document.createElement("div");
  settingsQuantity.classList.add("cart__item__content__settings__quantity");
  settings.appendChild(settingsQuantity);

  let productQuantity = document.createElement("p");
  productQuantity.innerHTML = "Qté : ";
  settingsQuantity.appendChild(productQuantity);

  let setProductQuantity = document.createElement("input");
  setProductQuantity.type = "number";
  setProductQuantity.name = "itemQuantity";
  setProductQuantity.classList.add("itemQuantity");
  setProductQuantity.min = 1;
  setProductQuantity.max = 100;
  setProductQuantity.value = product.qty;
  setProductQuantity.dataset.value = parseInt(product.quantity, 10);
  settingsQuantity.appendChild(setProductQuantity);

  // Ajout du bouton "supprimer"
  let settingsDelete = document.createElement("div");
  settingsDelete.classList.add("cart__item__content__settings__delete");
  settings.appendChild(settingsDelete);

  let deleteItem = document.createElement("p");
  deleteItem.innerHTML = "Supprimer";
  deleteItem.classList.add("deleteItem");
  settingsDelete.appendChild(deleteItem);
}

// Ajout des produits du localStorage dans le panier
function addItemsToCart() {
  for (let data of datasInStorage) {
    createCart(data);
  }
}

// Calcul de la quantité totale de produits et du prix total
function totalQuantityPrices() {
  //Quantité totale
  let sumQuantity = 0;
  for (let i = 0; i < listOfQuantity.length; i++) {
    sumQuantity += parseInt(listOfQuantity[i].value);
  }
  totalQuantity.innerHTML = sumQuantity;

  //Prix total
  let listOfPrices = document.querySelectorAll(
    ".cart__item__content__titlePrice p"
  );
  let sumPrices = 0;
  for (let i = 0; i < listOfPrices.length; i++) {
    sumPrices += parseInt(listOfPrices[i].innerHTML) * listOfQuantity[i].value;
  }
  totalPrice.innerHTML = sumPrices;
}

// Changement de la quantité depuis le panier
function changeQuantity() {
  for (let input of listOfQuantity) {
    input.addEventListener("change", function () {
      totalQuantityPrices();
      input.dataset.value = input.value;

      for (let i = 0; i < datasInStorage.length; i++) {
        datasInStorage[i].quantity = listOfQuantity[i].dataset.value;
      }
      localStorage.setItem("cart", JSON.stringify(datasInStorage));
    });
  }
}

// Suppression d'un produit dans le panier
function deleteItem() {
  let deleteProduct = document.querySelectorAll(".deleteItem");

  for (let deleteButton of deleteProduct) {
    deleteButton.addEventListener("click", function () {
      let deleteProductInCart = deleteButton.closest("article");
      deleteProductInCart.remove();

      for (let i = 0; i < datasInStorage.length; i++) {
        if (deleteProductInCart.dataset.id == datasInStorage[i].id) {
          datasInStorage.splice(i, 1);
          localStorage.setItem("cart", JSON.stringify(datasInStorage));
        }
      }
      totalQuantityPrices();
    });
  }
}

//-------------------------------- Formulaire --------------------------------------------

const orderButton = document.querySelector("#order");
orderButton.addEventListener("click", (e) => submitForm(e));

function submitForm(e) {
  e.preventDefault();
  if (datasInStorage.length === 0) {
    alert("Veuillez choisir un article !");
    return;
  }

  if (isFormInvalid()) return;
  if (isEmailInvalid()) return;

  const contact = makeRequestContact();
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    contact: JSON.stringify(contact),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const orderId = data.orderId;
      window.location.href =
        "../html/confirmation.html" + "?orderId=" + orderId;
    })
    .catch((err) => console.error(err));
}

function isEmailInvalid() {
  let email = document.querySelector("#email").value;
  let regex = /^[A-Za-z0-9\-\.]+@([A-Za-z0-9\-]+\.)+[A-Za-z0-9-]{2,4}$/;
  if (regex.test(email) === false) {
    let erreurDeSaisi = document.getElementById("emailErrorMsg");
    erreurDeSaisi.innerHTML = "Veuillez compléter ce champ";
    return true;
  }
  return false;
}

function isFormInvalid() {
  // Variables pour récupérer les id du HTML
  let inputFirstName = document.getElementById("firstName");
  let inputLastName = document.getElementById("lastName");
  let inputAdress = document.getElementById("address");
  let inputCity = document.getElementById("city");
  let email = document.querySelector("#email").value;

  // Variables Regex pour imposer des conditions de saisi
  let regexNameLastNameCity = /^([a-zA-Z-\s]{1,50})+$/;
  let regexAdress = /^([A-Za-z0-9\s]{3,50})+$/;
  let regex = /^[A-Za-z0-9\-\.]+@([A-Za-z0-9\-]+\.)+[A-Za-z0-9-]{2,4}$/;

  // Condition de validation pour le champ PRENOM -----------------
  // Si il est vide
  if (inputFirstName.value == "") {
    let erreurDeSaisi = document.getElementById("firstNameErrorMsg");
    erreurDeSaisi.innerHTML = "Veuillez compléter ce champ";

    // Si il est mal rempli selon le Regex
  } else if (regexNameLastNameCity.test(inputFirstName.value) == false) {
    let erreurDeSaisi = document.getElementById("firstNameErrorMsg");
    erreurDeSaisi.innerHTML =
      "Le prénom doit comporter que des lettres, des tirets";

    // Si il est bien rempli (suppression du message d'erreur)
  } else {
    let erreurDeSaisi = document.getElementById("firstNameErrorMsg");
    erreurDeSaisi.innerHTML = "";
  }

  // Condition de validation pour le champ NOM -----------------
  // Si il est vide
  if (inputLastName.value == "") {
    let erreurDeSaisi = document.getElementById("lastNameErrorMsg");
    erreurDeSaisi.innerHTML = "Veuillez compléter ce champ";

    // Si il est mal rempli selon le Regex
  } else if (regexNameLastNameCity.test(inputLastName.value) == false) {
    let erreurDeSaisi = document.getElementById("lastNameErrorMsg");
    erreurDeSaisi.innerHTML =
      "Le nom doit comporter que des lettres, des tirets";

    // Si il est bien rempli (suppression du message d'erreur)
  } else {
    let erreurDeSaisi = document.getElementById("lastNameErrorMsg");
    erreurDeSaisi.innerHTML = "";
  }

  // Condition de validation pour le champ ADRESSE -----------------
  // Si il est vide
  if (inputAdress.value == "") {
    let erreurDeSaisi = document.getElementById("addressErrorMsg");
    erreurDeSaisi.innerHTML = "Veuillez compléter ce champ";

    // Si il est mal rempli selon le Regex
  } else if (regexAdress.test(inputAdress.value) == false) {
    let erreurDeSaisi = document.getElementById("addressErrorMsg");
    erreurDeSaisi.innerHTML =
      "L'adresse doit comporter que des lettres, des tirets, des chiffres";

    // Si il est bien rempli (suppression du message d'erreur)
  } else {
    let erreurDeSaisi = document.getElementById("addressErrorMsg");
    erreurDeSaisi.innerHTML = "";
  }

  // Condition de validation pour le champ VILLE -----------------
  // Si il est vide
  if (inputCity.value == "") {
    let erreurDeSaisi = document.getElementById("cityErrorMsg");
    erreurDeSaisi.innerHTML = "Veuillez compléter ce champ";

    // Si il est mal rempli selon le Regex
  } else if (regexNameLastNameCity.test(inputCity.value) == false) {
    let erreurDeSaisi = document.getElementById("cityErrorMsg");
    erreurDeSaisi.innerHTML =
      "La ville doit comporter que des lettres, des tirets";

    // Si il est bien rempli (suppression du message d'erreur)
  } else {
    let erreurDeSaisi = document.getElementById("cityErrorMsg");
    erreurDeSaisi.innerHTML = "";
  }
  if (regex.test(email) === false) {
    let erreurDeSaisi = document.getElementById("emailErrorMsg");
    erreurDeSaisi.innerHTML = "Veuillez compléter ce champ";
    return true;
  }
  return false;
}

function makeRequestContact() {
  const form = document.querySelector(".cart__order__form");
  const firstName = form.elements.firstName.value;
  const lastName = form.elements.lastName.value;
  const address = form.elements.address.value;
  const city = form.elements.city.value;
  const email = form.elements.email.value;
  const contact = {
    contact: {
      firstName: firstName,
      lastName: lastName,
      address: address,
      city: city,
      email: email,
    },
    products: getIdsFromCache(),
  };
  return contact;
}

function getIdsFromCache() {
  const numberOfProducts = localStorage.length;
  const ids = [];
  for (let i = 0; i < numberOfProducts; i++) {
    const key = localStorage.key(i);
    const id = key.split("-")[0];
    ids.push(id);
  }
  return ids;
}

function isCart() {
  // Fonctions à appliquer sur la page panier
  //   if (localStorage.getItem("cart")) {
  addItemsToCart();
  totalQuantityPrices();
  changeQuantity();
  deleteItem();
}

isCart();
