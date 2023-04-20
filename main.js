import { products } from "./data.js";

const container = document.querySelector(".container");

const productsInCart = [];
const cart = [];

const totalPrice = document.querySelector("span.total");
const allProducts = document.querySelector("ul");

const payment = document.querySelector(".payment-btn");
const numberOfProducts = document.querySelector(".open-cart span");
const numberOfProductsInCart = document.querySelector(".cart span");

let promoCode = "WAKACJE";

const holidays = document.querySelector(".holidays");
holidays.textContent = promoCode;

let priceWithPromo;
let discount = 0.2;

products.forEach((product, id) => {
  const productBox = document.createElement("div");
  productBox.classList = "product";

  const prodName = document.createElement("h1");
  prodName.classList = "prod-name";
  prodName.textContent = product.name;

  const prodImg = document.createElement("img");
  prodImg.src = product.img;

  const prodDesc = document.createElement("h4");
  prodDesc.classList = "prod-desc";
  prodDesc.innerHTML = `Cena za kilogram: <b>${product.price}zł</b>`;

  const priceBox = document.createElement("div");
  priceBox.classList = "price";

  const country = document.createElement("h4");
  country.classList = "prod-desc";
  country.innerHTML = `Kraj pochodzenia: <b>${product.country}</b>`;

  const input = document.createElement("input");
  input.type = "number";
  input.placeholder = "Podaj wagę...";

  const calcBtn = document.createElement("button");
  calcBtn.classList = "calc-price";
  calcBtn.innerHTML = '<i class="material-icons">redo</i>';

  const span = document.createElement("span");
  span.setAttribute("id", "price");
  span.textContent = "0.00zł";

  const calcPrice = () => {
    if (input.value > 100) {
      input.style.borderColor = "rgb(144, 219, 68)";
      return (input.value = 100);
    } else if (input.value <= 0) {
      return (input.style.borderColor = "rgb(240, 51, 51)");
    }
    const calculatedPrice = input.value * product.price;

    if (calculatedPrice === 0 || isNaN(calculatedPrice)) {
      return (input.style.borderColor = "rgb(240, 51, 51)");
    } else {
      input.style.borderColor = "rgb(190, 190, 190)";
    }

    input.disabled = true;
    calcBtn.disabled = true;

    span.textContent = calculatedPrice.toFixed(2) + "zł";
    cart.push(calculatedPrice);

    const prod = document.createElement("li");
    prod.classList = "prd";
    prod.innerHTML = `<div class="sm-img"><img src="${product.img}"> ${
      product.name
    } <b>(${(input.value = parseFloat(input.value).toFixed(
      2
    ))}kg)</b> </div><span>${
      span.textContent
    }</span> <button class="remove">-</button>`;

    input.value = "";

    const removeFromCart = (e) => {
      const index = e.target.parentNode.dataset.key;
      productsInCart.splice(index, 1);
      cart.splice(index, 1);
      renderArray();
      if (productsInCart.length <= 0) {
        const li = document.createElement("li");
        li.classList = "none";
        li.textContent = "Brak produktów";
        payment.classList = "payment-btn";
        payment.disabled = true;
        allProducts.appendChild(li);
        renderArray();
        console.log(allProducts);
      }

      numberOfProducts.textContent = productsInCart.length;
      numberOfProductsInCart.textContent = productsInCart.length;
    };

    prod.querySelector("button").addEventListener("click", removeFromCart);

    const addButton = document.createElement("button");

    const addToCart = () => {
      productsInCart.push(prod);
      input.value = "";
      span.textContent = "0.00zł";
      addButton.style.display = "none";
      removeButton.style.display = "none";
      input.disabled = false;
      payment.classList = "payment-btn active";
      calcBtn.disabled = false;
      renderArray();
      numberOfProducts.textContent = productsInCart.length;
      numberOfProductsInCart.textContent = productsInCart.length;
    };

    addButton.classList = "add";
    addButton.innerHTML = `<i class="material-icons">add_shopping_cart
    </i>`;
    addButton.addEventListener("click", addToCart);

    const removeButton = document.createElement("button");

    const clearPrice = () => {
      cart.pop(calculatedPrice);
      addButton.style.display = "none";
      removeButton.style.display = "none";
      input.value = "";
      span.textContent = "0.00zł";
      input.disabled = false;
      calcBtn.disabled = false;
    };

    removeButton.classList = "remove";
    removeButton.innerHTML = `<i class="small material-icons">remove_shopping_cart</i>`;
    removeButton.addEventListener("click", clearPrice);

    priceBox.appendChild(addButton);
    priceBox.appendChild(removeButton);
  };

  const p = document.createElement("p");
  p.textContent = "(Max 100kg)";

  calcBtn.addEventListener("click", calcPrice);

  productBox.appendChild(prodName);
  productBox.appendChild(prodImg);
  productBox.appendChild(country);
  productBox.appendChild(prodDesc);
  productBox.appendChild(priceBox);
  priceBox.appendChild(input);
  priceBox.appendChild(calcBtn);
  priceBox.appendChild(span);
  productBox.appendChild(p);

  container.appendChild(productBox);
});

const renderArray = () => {
  allProducts.textContent = "";
  productsInCart.forEach((element, id) => {
    element.dataset.key = id;
    allProducts.appendChild(element);
  });

  let sum = 0;
  for (let i = 0; i < cart.length; i++) {
    sum += cart[i];
  }
  totalPrice.textContent = sum.toFixed(2) + "zł";
  priceWithPromo = sum - sum * discount;
  const promo = document.querySelector("#promo");

  const getPromoPrice = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      if (promo.value.toUpperCase() == promoCode) {
        totalPrice.innerHTML = `<span class="line-through">${sum.toFixed(
          2
        )}zł</span> ${priceWithPromo.toFixed(2)}zł (-${discount * 100}%)`;
        promo.disabled = true;
        promo.classList = "promo-code promo-active";
        const activePromo = document.querySelector(".active-promo");
        activePromo.innerHTML = "Aktywowano kod <span>WAKACJE</span>";
        activePromo.style.display = "block";
      }
    }
  };

  if (promo.disabled === true) {
    totalPrice.innerHTML = `<span class="line-through">${sum.toFixed(
      2
    )}zł</span> ${priceWithPromo.toFixed(2)}zł (-${discount * 100}%)`;
  }

  promo.addEventListener("keypress", getPromoPrice);
};

const cartBtn = document.querySelector(".open-cart");

const openCart = () => {
  const aside = document.querySelector("aside");
  aside.classList.toggle("translate-x");
  cartBtn.classList.toggle("move-left");
};

cartBtn.addEventListener("click", openCart);

let vh = window.innerHeight * 0.01;

document.documentElement.style.setProperty("--vh", `${vh}px`);
