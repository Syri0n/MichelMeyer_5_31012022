const orderId = getOrderId();
displayOrderId(orderId);
// removeAllCache();

function getOrderId() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get("orderId");
}

function displayOrderId(orderId) {
  const orderIdElement = document.getElementById("orderId");
  orderIdElement.textContent = orderId;
}

// On vide le localStorage une fois la commande validé et le numéro de commande obtenu
function removeAllCache() {
  const cache = window.localStorage;
  cache.clear();
}
