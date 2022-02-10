// On récupère les infos de l'API

fetch("http://localhost:3000/api/products")
  .then((res) => res.json())
  .then((data) => {
    console.log(data)
    return getArticles(data)
  })

  // On répartit les données de l'API dans le DOM

function getArticles(products) {
  
  products.forEach((product) => {
    let { _id, imageUrl, altTxt, name, description } = product
    let link = productLink(_id)
    let article = document.createElement("article")
    let image = productImg(imageUrl, altTxt)
    let h3 = productName(name)
    let p = productInfo(description)
  
    appendElementsToArticle(article, [image, h3, p])
    appendArticleToLink(link, article)
  })
}
  
function appendElementsToArticle(article, array) {
  array.forEach((item) => {
    article.appendChild(item)
  })
}

function productLink(id) {
  let productLink = document.createElement("a")
  productLink.href = "./product.html?id=" + id
  return productLink
}


function appendArticleToLink(link, article) {
  let items = document.querySelector("#items")
  if (items != null) {
    items.appendChild(link)
    link.appendChild(article)
  }
}

function productImg(imageUrl, altTxt) {
  let image = document.createElement("img")
  image.src = imageUrl
  image.alt = altTxt
  return image
}

function productName(name) {
  let h3 = document.createElement("h3")
  h3.textContent = name
  h3.classList.add("productName")
  return h3
}

function productInfo(description) {
  let p = document.createElement("p")
  p.textContent = description
  p.classList.add("productDescription")
  return p
}