// Récupération de l'url de la page produit
let queryStringUrl = window.location.search;

// Extraction de l'id
let urlSearchParams = new URLSearchParams(queryStringUrl);
let productId = urlSearchParams.get("id");

// Récupération des articles de l'API
fetch("http://localhost:3000/api/products/" + productId)
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

// Insertion de la description
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
// AJOUT DE PRODUITS AU PANIER
function addItem(id) {
  //mise en place un écouteur de l'évènement click
  let bouton = document.getElementById("addToCart");
  bouton.addEventListener("click", function () {
    //selection de la couleur
    let color = document.getElementById("colors");
    color = color.options[color.selectedIndex].value;
    //selection de la qté
    const qty = document.getElementById("quantity").value;
    //définit un nouvel objet Panier :
    const newItem = {
      id: productId,
      qty: qty,
      color: color,
      price: itemPrice,
      imageUrl: imgUrl,
      altTxt: altText,
      name: articleName,
    };
    if (color === "") {
      window.alert("Il est nécessaire de choisir une couleur");
    }

    // si le panier est déjà sauvegardé récupère les données du localStorage
    else if (
      localStorage.getItem("cart") &&
      localStorage.getItem("cart").length > 0
    ) {
      const cart = JSON.parse(localStorage.getItem("cart"));
      // teste les données du panier
      const productPosition = cart.findIndex(
        (item) => item.id === newItem.id && item.color === newItem.color
      );
      // ajoute le nouvel objet Panier au localStorage
      if (productPosition === -1) {
        cart.push(newItem);
        localStorage.setItem("cart", JSON.stringify(cart));
      } else {
        // si le produit est déjà dans le panier on met à jour la qté
        cart[productPosition].qty =
          parseInt(cart[productPosition].qty) + parseInt(newItem.qty);
        localStorage.setItem("cart", JSON.stringify(cart));
      }
      window.alert("Ce canapé à bien été ajouté");
      //alert
    } else {
      // si le panier n'existait pas on en crée un nouveau dans le localStorage
      let newCart = new Array();
      newCart.push(newItem);
      localStorage.setItem("cart", JSON.stringify(newCart));
      window.alert("Ce canapé à bien été ajouté");
    }
  });
}
addItem();
// // Insertion du bouton "ajouter au panier"
// const button = document.querySelector("#addToCart");

// // On écoute l'évenement au click
// button.addEventListener("click", handleClick);

// // Insertion du choix de couleur
// function handleClick() {
//   const productColor = document.querySelector("#colors").value;
//   const productQuantity = document.querySelector("#quantity").value;

//   if (isOrderInvalid(productColor, productQuantity)) return;
//   saveOrder(productColor, productQuantity);
//   alert("Produit ajouté au panier");
//   // window.location.href = "cart.html";
// }

// // On sauvegarde les articles dans le localStorage
// function saveOrder(productColor, productQuantity) {
//   //pour éditer l'id de l'article en fonction de la couleur
//   const key = `${productId}-${productColor}`;

//   // Création d'un objet JSON regroupant les informations du produit à ajouter au panier
//   const productJson = {
//     id: productId,
//     color: productColor,
//     quantity: Number(productQuantity),
//     price: itemPrice,
//     imageUrl: imgUrl,
//     altTxt: altText,
//     name: articleName,
//   };
//   console.log(productJson);
//   localStorage.setItem(key, JSON.stringify(productJson));
// }

// // Empêche le changement de page si un ou plusieurs éléments est null avec fenêtre pop-up
// function isOrderInvalid(productColor, productQuantity) {
//   if (productColor == null || productColor === "" || productColor == 0) {
//     alert(" Merci de choisir une couleur");
//     return true;
//   } else if (
//     productQuantity === "" ||
//     productQuantity == null ||
//     productQuantity == 0
//   ) {
//     alert(" Merci de choisir une quantitée");
//     return true;
//   }
// }
