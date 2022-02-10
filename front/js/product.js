let queryString = window.location.search
let urlParams = new URLSearchParams(queryString)
let id = urlParams.get("id")


fetch(`http://localhost:3000/api/products/${id}`)
    .then((response) => response.json())
    .then((res) => handleData(res))

function handleData(kanap) {
    // const altTxt = kanap.altTxt
    // const colors = kanap.colors
    // const description = kanap.description
    // const imageUrl = kanap.imageUrl
    // const name = kanap.name
    // const price = kanap.price
    // const _id = kanap._id

    let { altTxt, colors, description, imageUrl, name, price, _id } = kanap;
    makeImage(imageUrl, altTxt)
    makeTitle(name)
    makeDescription(description)
    makePrice(price)
    makeOptions(colors)
}

function makeImage(imageUrl, altTxt) {
    let image = document.createElement("img");
    image.src = imageUrl;
    image.alt = altTxt;
    let parent = document.querySelector(".item__img");
    if (parent != null ) parent.appendChild (image);
}

function makeTitle(name) {
    let h1 = document.querySelector("#title")
    if (h1 != null ) h1.textContent = name;
}

function makeDescription(description) {
    let p = document.querySelector('#description')  
    if (p != null ) p.textContent = description
}

function makePrice(euro) {
    let span = document.querySelector('#price')
    if (span != null ) span.textContent = euro
}

function makeColors(colors) {
    let select = document.querySelector("#colors")
}

function makeOptions() {
    
}