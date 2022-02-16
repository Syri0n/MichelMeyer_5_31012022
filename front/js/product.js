let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let id = urlParams.get("id");

if (id != null) {
  let itemPrice = 0;
  let imgUrl, altText, articleName;
}

// On répupère l'id du produit depuis l'API

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

function makeImage(imageUrl, altTxt) {
  const image = document.createElement("img");
  image.src = imageUrl;
  image.alt = altTxt;
  const parent = document.querySelector(".item__img");
  if (parent != null) parent.appendChild(image);
}

function makeTitle(name) {
  const h1 = document.querySelector("#title");
  if (h1 != null) h1.textContent = name;
}

function makeDescription(description) {
  const p = document.querySelector("#description");
  if (p != null) p.textContent = description;
}

function makePrice(price) {
  const span = document.querySelector("#price");
  if (span != null) span.textContent = price;
}

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

const button = document.querySelector("#addToCart");
button.addEventListener("click", handleClick);

function handleClick() {
  const color = document.querySelector("#colors").value;
  const quantity = document.querySelector("#quantity").value;

  if (isOrderInvalid(color, quantity)) return;
  saveOrder(color, quantity);

  window.location.href = "cart.html";
}

// On sauvegarde les articles dans le localStorage

function saveOrder(color, quantity) {
  const data = {
    id: id,
    color: color,
    quantity: Number(quantity),
    price: itemPrice,
    imageUrl: imgUrl,
    altTxt: altText,
    name: articleName,
  };
  localStorage.setItem(id, JSON.stringify(data));
}

// Empêche le changement de page si un ou plusieurs éléments est null

function isOrderInvalid(color, quantity) {
  if (color == null || color === "" || quantity == null || quantity == 0) {
    alert(" Merci de choisir une couleur et une quantitée");
    return true;
  }
}
