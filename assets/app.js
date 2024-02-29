// FAQ

document.addEventListener("DOMContentLoaded", function () {
  var faqButtons = document.querySelectorAll(".faq-button");

  faqButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const answer = this.parentNode.querySelector(".faq-answer");
      const plusButton = this.querySelector(".plus-button");
      const minusButton = this.querySelector(".minus-button");

      if (answer.classList.contains("hidden")) {
        answer.classList.remove("hidden");
        plusButton.classList.add("hidden");
        minusButton.classList.remove("hidden");
      } else {
        answer.classList.add("hidden");
        plusButton.classList.toggle("hidden");
        minusButton.classList.toggle("hidden");
      }
    });
  });
});

// ajax cart

document
  .querySelectorAll('[id^="minus-"], [id^="plus-"]')
  .forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      const input = button.parentElement.querySelector("input");
      const value = Number(input.value);
      const isPlus = button.id.startsWith("plus-");
      const key = button.closest(".cart-item").getAttribute("data-key");

      if (isPlus) {
        const newValue = value + 1;
        input.value = value + 1;
        updateItemQuantity(key, newValue);
      } else if (value > 1) {
        const newValue = value - 1;
        input.value = value - 1;
        updateItemQuantity(key, newValue);
      }
    });
  });

function updateItemQuantity(key, quantity) {
  // console.log(key, quantity);
  axios
    .post("/cart/change.js", {
      id: key,
      quantity,
    })
    .then((response) => {
      // console.log(response.data);
      const format = document
        .querySelector("[data-money-format]")
        .getAttribute("data-money-format");
      const totalDiscount = formatMoney(response.data.total_discount, format);
      const totalPrice = formatMoney(response.data.total_price, format);
      const item = response.data.items.find((item) => item.key === key);
      const itemPrice = formatMoney(item.final_line_price, format);
      const cartCount = response.data.item_count;

      document.querySelector("#total-price").textContent = totalPrice;
      document.querySelector("#subtotal").textContent = totalPrice;
      document.querySelector("#total-discount").textContent = totalDiscount;
      document.querySelector(`[data-key="${key}"] #subtotal-item`).textContent =
        itemPrice;
      document.querySelector("#cart-count").textContent = cartCount;

      // console.log(totalDiscount, totalPrice, item, itemPrice, cartCount);
    });
}

// Format money

function formatMoney(cents, format) {
  if (typeof cents == "string") {
    cents = cents.replace(".", "");
  }
  var value = "";
  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  var formatString = format || this.money_format;

  function defaultOption(opt, def) {
    return typeof opt == "undefined" ? def : opt;
  }

  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = defaultOption(precision, 2);
    thousands = defaultOption(thousands, ",");
    decimal = defaultOption(decimal, ".");

    if (isNaN(number) || number == null) {
      return 0;
    }

    number = (number / 100.0).toFixed(precision);

    var parts = number.split("."),
      dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + thousands),
      cents = parts[1] ? decimal + parts[1] : "";

    return dollars + cents;
  }

  switch (formatString.match(placeholderRegex)[1]) {
    case "amount":
      value = formatWithDelimiters(cents, 2);
      break;
    case "amount_no_decimals":
      value = formatWithDelimiters(cents, 0);
      break;
    case "amount_with_comma_separator":
      value = formatWithDelimiters(cents, 2, ".", ",");
      break;
    case "amount_no_decimals_with_comma_separator":
      value = formatWithDelimiters(cents, 0, ".", ",");
      break;
  }

  return formatString.replace(placeholderRegex, value);
}

// Remove item

document.querySelectorAll(".remove-item").forEach((remove) => {
  remove.addEventListener("click", function (event) {
    event.preventDefault();
    const item = remove.closest(".cart-item");
    const key = item.getAttribute("data-key");

    axios
      .post("/cart/change.js", {
        id: key,
        quantity: 0,
      })
      .then((response) => {
        if (response.data.item_count === 0) {
          document.querySelector(".cart-item").innerHTML =
            "<p class='text-center'>Your cart is empty</p>";
          document.querySelector("#total-price").textContent = 0;
          document.querySelector("#subtotal").textContent = 0;
          document.querySelector("#total-discount").textContent = 0;
          console.log("hello-1");
          document.querySelector("#cart-count").textContent = 0;

          document.querySelector(
            `[data-key="${key}"] #subtotal-item`
          ).textContent = itemPrice;
        } else {
          const format = document
            .querySelector("[data-money-format]")
            .getAttribute("data-money-format");

          const totalDiscount = formatMoney(
            response.data.total_discount,
            format
          );
          const totalPrice = formatMoney(response.data.total_price, format);
          const cartCount = response.data.item_count;

          document.querySelector("#total-discount").textContent = totalDiscount;
          document.querySelector("#total-price").textContent = totalPrice;
          document.querySelector("#subtotal").textContent = totalPrice;
          console.log(cartCount);
          document.querySelector("#cart-count").textContent = cartCount;

          item.remove();
        }
      });
  });
});

// add to cart

const addToCartForms = document.querySelectorAll("form[action='/cart/add']");

addToCartForms.forEach((form) => {
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const id = form.querySelector("[name='id']").value;

    axios
      .post("/cart/add.js", {
        id,
        quantity: 1,
      })
      .then(() => {
        axios.get("/cart.json").then((response) => {
          const cartCount = response.data.item_count;
          document.querySelector("#cart-count").textContent = cartCount;
        });
      });
  });
});

// dark mode

const toggle = document.getElementById("theme-switch");

toggle.addEventListener("click", function () {
  document.documentElement.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});

// On page load or when changing themes, best to add inline in `head` to avoid FOUC
if (
  localStorage.theme === "dark" ||
  (!("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

// Whenever the user explicitly chooses light mode
localStorage.theme = "light";

// Whenever the user explicitly chooses dark mode
localStorage.theme = "dark";

// Whenever the user explicitly chooses to respect the OS preference
localStorage.removeItem("theme");
