let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let id = urlParams.get("id");

// Récupération des articles de l'API

fetch("http://localhost:3000/api/products/" + id)
  .then((response) => response.json())
  .then((res) => handleData(res));

function handleData(kanap) {
  const { altTxt, colors, description, imageUrl, name, price } = kanap;
  itemPrice = price;
  imgUrl = imageUrl;
  altText = altTxt;
  articleName = name;
  makeImage(imageUrl, altTxt);
  makeTitle(name);
  makeDescription(description);
  makePrice(price);
  makeOptions(colors);
}

// Insertion de l'image
function makeImage(imageUrl, altTxt) {
  const image = document.createElement("img");
  image.src = imageUrl;
  image.alt = altTxt;
  const parent = document.querySelector(".item__img");
  if (parent != null) parent.appendChild(image);
}

// Insertion du titre
function makeTitle(name) {
  const h1 = document.querySelector("#title");
  if (h1 != null) h1.textContent = name;
}

// Insertion de lq description
function makeDescription(description) {
  const p = document.querySelector("#description");
  if (p != null) p.textContent = description;
}

// Insertion du prix
function makePrice(price) {
  const span = document.querySelector("#price");
  if (span != null) span.textContent = price;
}

// Insertion de la couleur
function makeOptions(colors) {
  const select = document.querySelector("#colors");
  if (select != null) {
    colors.forEach((color) => {
      const option = document.createElement("option");
      option.value = color;
      option.textContent = color;
      select.appendChild(option);
    });
  }
}

// Insertion du bouton "ajouter au panier"
const button = document.querySelector("#addToCart");

// On écoute l'évenement au click
button.addEventListener("click", handleClick);

// Insertion du choix de couleur
function handleClick() {
  const color = document.querySelector("#colors").value;
  const quantity = document.querySelector("#quantity").value;

  if (isOrderInvalid(color, quantity)) return;
  saveOrder(color, quantity);
  alert("Produit ajouté au panier");
  window.location.href = "cart.html";
}

// On sauvegarde les articles dans le localStorage
function saveOrder(color, quantity) {
  //pour éditer l'id de l'article en fonction de la couleur
  const key = `${id}-${color}`;

  const data = {
    id: id,
    color: color,
    quantity: Number(quantity),
    price: itemPrice,
    imageUrl: imgUrl,
    altTxt: altText,
    name: articleName,
  };
  localStorage.setItem(key, JSON.stringify(data));
}

// Empêche le changement de page si un ou plusieurs éléments est null avec fenêtre pop-up
function isOrderInvalid(color, quantity) {
  if (color == null || color === "" || color == 0) {
    alert(" Merci de choisir une couleur");
    return true;
  } else if (quantity === "" || quantity == null || quantity == 0) {
    alert(" Merci de choisir une quantitée");
    return true;
  }
}
