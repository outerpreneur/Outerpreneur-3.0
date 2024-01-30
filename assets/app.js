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
