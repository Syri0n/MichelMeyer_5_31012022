const cart = [];

// On récupère les articles depuis le cache

retrieveItemsFromCache();

cart.forEach((item) => displayItem(item));

function retrieveItemsFromCache() {
  const numberOfItems = localStorage.length;
  for (let i = 0; i < numberOfItems; i++) {
    const item = localStorage.getItem(localStorage.key(i)) || "";
    // On récupère les produits sous forme d'objet
    const itemObject = JSON.parse(item);
    cart.push(itemObject);
  }
}

// On affiche les articles dans le panier

function displayItem(item) {
  const article = makeArticle(item);
  const imageDiv = makeImageDiv(item);
  article.appendChild(imageDiv);
  const cardItemContent = makeCartContent(item);
  article.appendChild(cardItemContent);
  displayArticle(article);
  displayTotalQuantity();
  displayTotalPrice();
}

// Insertion de l'article
function makeArticle(item) {
  const article = document.createElement("article");
  article.classList.add("cart__item");
  article.dataset.id = item.id;
  article.dataset.color = item.color;
  return article;
}

function displayArticle(article) {
  document.querySelector("#cart__items").appendChild(article);
}

function makeCartContent(item) {
  const cardItemContent = document.createElement("div");
  cardItemContent.classList.add("cart__item__content");

  const description = makeDescription(item);
  const settings = makeSettings(item);

  cardItemContent.appendChild(description);
  cardItemContent.appendChild(settings);
  return cardItemContent;
}

function makeSettings(item) {
  const settings = document.createElement("div");
  settings.classList.add("cart__item__content__settings");

  addQuantityToSettings(settings, item);
  addDeleteToSettings(settings, item);
  return settings;
}

// Insertion de la desription
function makeDescription(item) {
  const description = document.createElement("div");
  description.classList.add("cart__item__content__description");

  const h2 = document.createElement("h2");
  h2.textContent = item.name;
  const p = document.createElement("p");
  p.textContent = item.color;
  const p2 = document.createElement("p");
  p2.textContent = item.price + " €";

  description.appendChild(h2);
  description.appendChild(p);
  description.appendChild(p2);
  return description;
}

// Insertion de l'image
function makeImageDiv(item) {
  const div = document.createElement("div");
  div.classList.add("cart__item__img");

  const image = document.createElement("img");
  image.src = item.imageUrl;
  image.alt = item.altTxt;
  div.appendChild(image);
  return div;
}

// Insertion de Qté
function addQuantityToSettings(settings, item) {
  const quantity = document.createElement("div");
  quantity.classList.add("cart__item__content__settings__quantity");
  const p = document.createElement("p");
  p.textContent = "Qté : ";
  quantity.appendChild(p);
  const input = document.createElement("input");
  input.type = "number";
  input.classList.add("itemQuantity");
  input.name = "itemQuantity";
  input.min = "1";
  input.max = "100";
  input.value = item.quantity;
  input.addEventListener("input", () =>
    updatePriceAndQuantity(item.id, input.value, item)
  );

  quantity.appendChild(input);
  settings.appendChild(quantity);
}

//On calcule la quantité total du panier

function displayTotalQuantity(item) {
  let total = 0;
  const totalQuantity = document.querySelector("#totalQuantity");
  cart.forEach((item) => {
    const totalUnitQuantity = item.quantity + 0;
    total += totalUnitQuantity;
  });
  totalQuantity.textContent = total;
}

// On calcule le prix total du panier

function displayTotalPrice() {
  let total = 0;
  const totalPrice = document.querySelector("#totalPrice");
  cart.forEach((item) => {
    const totalUnitPrice = item.price * item.quantity;
    total += totalUnitPrice;
  });
  totalPrice.textContent = total;
}

//On update le panier si on change la quantité d'un voir plusieurs articles

function updatePriceAndQuantity(id, newValue, item) {
  const itemToUpdate = cart.find((item) => item.id === id);
  // itemToUpdate.quantity = Number(newValue);
  // item.quantity = itemToUpdate.quantity;
  item.quantity = Number(newValue);
  displayTotalQuantity();
  displayTotalPrice();
  saveNewDataToCache(item);
}

// On update le localStorage avec les nouvelles valeurs

function saveNewDataToCache(item) {
  const dataToSave = JSON.stringify(item);
  const key = `${item.id}-${item.color}`;
  localStorage.setItem(key, dataToSave);
}

// On supprime l'article du panier

function addDeleteToSettings(settings, item) {
  const div = document.createElement("div");
  div.classList.add("cart__item__content__settings__delete");
  div.addEventListener("click", () => deleteItem(item));

  const p = document.createElement("p");
  p.textContent = "Supprimer";
  div.appendChild(p);
  settings.appendChild(div);
}

function deleteItem(item) {
  const itemToDelete = cart.findIndex(
    (product) => product.id === item.id && product.color === item.color
  );
  cart.splice(itemToDelete, 1);
  displayTotalPrice();
  displayTotalQuantity();
  deleteDataFromCache(item);
  deleteArticleFromPage(item);
}

function deleteDataFromCache(item) {
  const key = `${item.id}-${item.color}`;
  localStorage.removeItem(key);
}

function deleteArticleFromPage(item) {
  const articleToDelete = document.querySelector(
    `article[data-id="${item.id}"][data-color="${item.color}"]`
  );
  articleToDelete.remove();
}

//-------------------------------- Formulaire --------------------------------------------

const orderButton = document.querySelector("#order");
orderButton.addEventListener("click", (e) => submitForm(e));

function submitForm(e) {
  e.preventDefault();
  if (cart.length === 0) {
    alert("Veuillez choisir un article !");
    return;
  }

  if (isFormInvalid()) return;
  if (isEmailInvalid()) return;

  const body = makeRequestBody();
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    body: JSON.stringify(body),
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
    erreurDeSaisi.innerHTML = "Le champ Email est requis";
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

  // Variables Regex pour imposer des conditions de saisi
  let regexNameLastNameCity = /^([a-zA-Z-\s]{1,50})+$/;
  let regexAdress = /^([A-Za-z0-9\s]{3,50})+$/;

  // Condition de validation pour le champ PRENOM -----------------
  // Si il est vide
  if (inputFirstName.value == "") {
    let erreurDeSaisi = document.getElementById("firstNameErrorMsg");
    erreurDeSaisi.innerHTML = "Le champ Prénom est requis";

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
    erreurDeSaisi.innerHTML = "Le champ Nom est requis";

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
    erreurDeSaisi.innerHTML = "Le champ Adresse est requis";

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
    erreurDeSaisi.innerHTML = "Le champ Ville est requis";

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
}

function makeRequestBody() {
  const form = document.querySelector(".cart__order__form");
  const firstName = form.elements.firstName.value;
  const lastName = form.elements.lastName.value;
  const address = form.elements.address.value;
  const city = form.elements.city.value;
  const email = form.elements.email.value;
  const body = {
    contact: {
      firstName: firstName,
      lastName: lastName,
      address: address,
      city: city,
      email: email,
    },
    products: getIdsFromCache(),
  };
  return body;
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
