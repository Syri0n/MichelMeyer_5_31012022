// Récupération des articles de l'API

fetch("http://localhost:3000/api/products")
.then((res) => res.json())
.then((data) => getArticles(data))

function getArticles(products) {
    const imageUrl = products[0].imageUrl
    
    const items = document.querySelector("#items")
  
    const anchor = document.createElement("a")
    anchor.href = imageUrl
  
    if (items != null) {
      items.appendChild(anchor)
    }
  }