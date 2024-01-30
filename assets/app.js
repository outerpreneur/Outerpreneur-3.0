// Mobile menu
const mobileMenu = document.getElementById("mobile-menu");
const mobileMenuOpen = document.getElementById("mobile-menu-open");
const mobileMenuClose = document.getElementById("mobile-menu-close");

mobileMenuOpen.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

mobileMenuClose.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// FAQ

document.addEventListener("DOMContentLoaded", function () {
  var faqButtons = document.querySelectorAll(".faq-button");

  faqButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const answer = this.parentNode.querySelector(".faq-answer");
      const plusButton = this.querySelector(".plus-button");
      const minusButton = this.querySelector(".minus-button");
      console.log(plusButton);

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
  console.log(key, quantity);
  axios
    .post("/cart/change.js", {
      id: key,
      quantity,
    })
    .then((response) => {
      const format = document
        .querySelector("[data-money-format]")
        .getAttribute("data-money-format");
      console.log(format);
      const totalDiscount = formatMoney(response.data.total_discount, format);
      const totalPrice = formatMoney(response.data.total_price, format);
      const item = response.data.items.find((item) => item.key === key);
      const itemPrice = formatMoney(item.final_line_price, format);

      document.querySelector("#total-price").textContent = totalPrice;
      document.querySelector("#total-discount").textContent = totalDiscount;
      document.querySelector("#subtotal").textContent = itemPrice;

      console.log(totalDiscount, totalPrice, item);
    });
}

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

document.querySelectorAll(".remove-item").forEach((remove) => {
  remove.addEventListener("click", function (event) {
    event.preventDefault();
    // alert("Are you sure you want to remove this item?");
    const item = remove.closest(".cart-item");
    const key = item.getAttribute("data-key");
    axios
      .post("/cart/change.js", {
        id: key,
        quantity: 0,
      })
      .then((response) => {
        item.remove();
      });
    //     const format = document
    //       .querySelector("[data-money-format]")
    //       .getAttribute("data-money-format");
    //     console.log(format);
    //     const totalDiscount = formatMoney(response.data.total_discount, format);
    //     const totalPrice = formatMoney(response.data.total_price, format);
    //     const item = response.data.items.find((item) => item.key === key);
    //     const itemPrice = formatMoney(item.final_line_price, format);

    //     document.querySelector("#total-price").textContent = totalPrice;
    //     document.querySelector("#total-discount").textContent = totalDiscount;
    //     document.querySelector("#subtotal").textContent = itemPrice;
    //     remove.closest(".cart-item").remove();
    //   });
  });
});
