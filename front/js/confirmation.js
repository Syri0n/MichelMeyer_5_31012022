const orderId = getOrderId();
displayOrderId(orderId);
removeAllCache();

function getOrderId() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get("orderId");
}

function displayOrderId(orderId) {
  const orderIdElement = document.getElementById("orderId");
  orderIdElement.textContent = orderId;
}

<<<<<<< HEAD
// // On vide le localStorage une fois la commande validé et le numéro de commande obtenu
// function removeAllCache() {
//   const cache = window.localStorage;
//   cache.clear();
// }
=======
function removeAllCache() {
  const cache = window.localStorage;
  cache.clear();
}
>>>>>>> c0ea87dc26635d46129b946131b66d9324376bdb
