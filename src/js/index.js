import $ from "jquery";

import "select2";

$(document).ready(function () {
  const initSelect = () => {
    const customSelects = document.querySelectorAll(".custom-select__control");

    customSelects.forEach((customSelect) => {
      $(customSelect).select2({
        minimumResultsForSearch: -1,
      });

      const arrowElement = customSelect.nextElementSibling.querySelector(
        ".select2-selection__arrow"
      );
      arrowElement.innerHTML = `<svg class="select2-selection__arrow-icon" xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
        <path d="M14.9337 8.51079C14.9337 8.43936 14.898 8.359 14.8445 8.30543L14.398 7.859C14.3445 7.80543 14.2641 7.76971 14.1927 7.76971C14.1212 7.76971 14.0409 7.80543 13.9873 7.859L10.4784 11.3679L6.96946 7.859C6.91589 7.80543 6.83553 7.76971 6.7641 7.76971C6.68375 7.76971 6.61232 7.80543 6.55875 7.859L6.11232 8.30543C6.05875 8.359 6.02303 8.43936 6.02303 8.51079C6.02303 8.58221 6.05875 8.66257 6.11232 8.71614L10.273 12.8769C10.3266 12.9304 10.407 12.9661 10.4784 12.9661C10.5498 12.9661 10.6302 12.9304 10.6837 12.8769L14.8445 8.71614C14.898 8.66257 14.9337 8.58221 14.9337 8.51079Z" fill="currentColor"/>
      </svg>`;
    });
  };

  const initRangeCounter = () => {
    const customRanges = document.querySelectorAll(".custom-range");

    customRanges.forEach((customRange) => {
      const rangeInput = customRange.querySelector(".custom-range__control");
      const rangeValue = customRange.querySelector(".custom-range__value");

      rangeInput.addEventListener("input", function () {
        const value = rangeInput.value;
        rangeValue.textContent = `${value}%`;
      });
    });
  };

  const initBurger = () => {
    const burgers = document.querySelectorAll(".burger");

    burgers.forEach((burger) => {
      const burgerButton = burger.querySelector(".burger__button");

      const toggleMenu = () => {
        burger.classList.toggle("active");
      };

      burgerButton.addEventListener("click", toggleMenu);
    });
  };

  initBurger();
  initRangeCounter();
  initSelect();
});
