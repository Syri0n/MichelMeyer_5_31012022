// Récupération des articles de l'API

fetch("http://localhost:3000/api/products")
.then((res) => res.json())
.then((data) => getArticles(data))

