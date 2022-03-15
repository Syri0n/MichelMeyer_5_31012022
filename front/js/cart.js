// Récupération des données localStorage
const datasInStorage = JSON.parse(localStorage.getItem("cart"));

// Récupération des quantités des différents produits du panier
const listOfQuantity = document.getElementsByClassName("itemQuantity");

// Balise pour l'insertion de la quantité totale de produits
const totalQuantity = document.getElementById("totalQuantity");

// Balise pour l'insertion du prix total
const totalPrice = document.getElementById("totalPrice");

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
  contentTitlePrice.classList.add("cart__item__content__description");

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
    ".cart__item__content__description p"
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
        datasInStorage[i].qty = listOfQuantity[i].dataset.value;
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

function isCart() {
  addItemsToCart();
  totalQuantityPrices();
  changeQuantity();
  deleteItem();
}

isCart();

//-------------------------------- Formulaire --------------------------------------------

// gestion du formulaire
function checkForm() {
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
    erreurDeSaisi.innerHTML = "Veuillez compléter ce champ !";

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
    erreurDeSaisi.innerHTML = "Veuillez compléter ce champ !";

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
    erreurDeSaisi.innerHTML = "Veuillez compléter ce champ !";

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
    erreurDeSaisi.innerHTML = "Veuillez compléter ce champ !";

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
    erreurDeSaisi.innerHTML = "Veuillez compléter ce champ !";
    return true;
  }
  return false;
}

// ENVOI DES DONNÉES DU FORMULAIRE
function send() {
  //envoie les données à l'Api et redirige vers page confirmation
  if (checkForm()) return;
  //crée un nouvel objet contact et 1 tableau de produits :
  let basket = datasInStorage;
  let products = new Array();
  basket.forEach((element) => {
    products.push(element.id);
  });
  let contact = {
    contact: {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      email: document.getElementById("email").value,
    },
    products: products,
  };
  //requête POST pour transmettre objet contact à l'API en sérialisant données en JSON
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contact),
  })
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    //redirige vers page confirmation et récupére ID de commande et le supprime du localStorage
    .then(function (res) {
      document.location.href = "confirmation.html?orderId=" + res.orderId;
    });
}

//envoi du formulaire au click sur bouton Commander
document.getElementById("order").addEventListener("click", function (e) {
  e.preventDefault();
  send();
});
