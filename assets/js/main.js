document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("vg-menu-toggle");
  const mobileMenu = document.getElementById("vg-mobile-menu");
  const mobileClose = document.getElementById("vg-mobile-close");
  const menuOverlay = document.getElementById("vg-menu-overlay");
  const mobileLinks = document.querySelectorAll(".vg-mobile-nav__link");
  const mobileContact = document.querySelector(".vg-mobile-contact");

  function openVGMenu() {
    if (!mobileMenu || !menuOverlay) return;

    mobileMenu.classList.add("is-open");
    menuOverlay.classList.add("is-visible");
    document.body.classList.add("vg-menu-active");

    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "true");
    }
  }

  function closeVGMenu() {
    if (!mobileMenu || !menuOverlay) return;

    mobileMenu.classList.remove("is-open");
    menuOverlay.classList.remove("is-visible");
    document.body.classList.remove("vg-menu-active");

    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", openVGMenu);
  }

  if (mobileClose) {
    mobileClose.addEventListener("click", closeVGMenu);
  }

  if (menuOverlay) {
    menuOverlay.addEventListener("click", closeVGMenu);
  }

  mobileLinks.forEach(function (link) {
    link.addEventListener("click", closeVGMenu);
  });

  if (mobileContact) {
    mobileContact.addEventListener("click", closeVGMenu);
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeVGMenu();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 1100) {
      closeVGMenu();
    }
  });


  const serviceCards = document.querySelectorAll(".vg-service-card");

  if (serviceCards.length) {
    const touchDevice = window.matchMedia(
      "(hover: none), (pointer: coarse), (max-width: 768px)"
    );

    function closeCards() {
      serviceCards.forEach(function (card) {
        card.classList.remove("is-active");
      });
    }

    function openCard(card) {
      serviceCards.forEach(function (item) {
        if (item !== card) {
          item.classList.remove("is-active");
        }
      });

      card.classList.add("is-active");
    }

    serviceCards.forEach(function (card) {
      card.addEventListener("click", function (event) {
        const button = event.target.closest(
          ".vg-service-card__button"
        );

        if (button) {
          return;
        }

        if (!touchDevice.matches) {
          return;
        }

        if (card.classList.contains("is-active")) {
          card.classList.remove("is-active");
        } else {
          openCard(card);
        }
      });
    });

    window.addEventListener("resize", function () {
      if (!touchDevice.matches) {
        closeCards();
      }
    });
  }


  const carousels = document.querySelectorAll(
    ".vg-gallery__carousel"
  );

  const galleryItems = document.querySelectorAll(
    ".vg-gallery__item"
  );

  const lightbox = document.getElementById(
    "vgGalleryLightbox"
  );

  const lightboxImage = document.getElementById(
    "vgGalleryLightboxImage"
  );

  const closeButton = document.getElementById(
    "vgGalleryLightboxClose"
  );

  let isLightboxOpen = false;

  carousels.forEach(function (carousel) {
    carousel.addEventListener(
      "touchstart",
      function () {
        if (!isLightboxOpen) {
          carousel.classList.add(
            "vg-gallery-touch-pause"
          );
        }
      },
      {
        passive: true
      }
    );

    carousel.addEventListener(
      "touchend",
      function () {
        if (!isLightboxOpen) {
          setTimeout(function () {
            carousel.classList.remove(
              "vg-gallery-touch-pause"
            );
          }, 300);
        }
      },
      {
        passive: true
      }
    );

    carousel.addEventListener(
      "touchcancel",
      function () {
        if (!isLightboxOpen) {
          carousel.classList.remove(
            "vg-gallery-touch-pause"
          );
        }
      },
      {
        passive: true
      }
    );
  });


  if (
    galleryItems.length &&
    lightbox &&
    lightboxImage &&
    closeButton
  ) {
    galleryItems.forEach(function (item) {
      const image = item.querySelector("img");

      if (!image) return;

      item.addEventListener("click", function (event) {
        event.preventDefault();

        lightboxImage.src =
          image.currentSrc || image.src;

        lightboxImage.alt =
          image.alt || "VG Construction Project";

        lightbox.classList.add("is-open");

        lightbox.setAttribute(
          "aria-hidden",
          "false"
        );

        document.body.classList.add(
          "vg-gallery-lightbox-open"
        );

        carousels.forEach(function (carousel) {
          carousel.classList.add(
            "vg-gallery-touch-pause"
          );
        });

        isLightboxOpen = true;
      });
    });


    function closeLightbox() {
      if (!isLightboxOpen) return;

      lightbox.classList.remove("is-open");

      lightbox.setAttribute(
        "aria-hidden",
        "true"
      );

      document.body.classList.remove(
        "vg-gallery-lightbox-open"
      );

      carousels.forEach(function (carousel) {
        carousel.classList.remove(
          "vg-gallery-touch-pause"
        );
      });

      setTimeout(function () {
        lightboxImage.src = "";
        lightboxImage.alt = "";
      }, 350);

      isLightboxOpen = false;
    }


    closeButton.addEventListener(
      "click",
      function (event) {
        event.preventDefault();
        event.stopPropagation();

        closeLightbox();
      }
    );


    lightbox.addEventListener(
      "click",
      function (event) {
        if (event.target === lightbox) {
          closeLightbox();
        }
      }
    );


    document.addEventListener(
      "keydown",
      function (event) {
        if (
          event.key === "Escape" &&
          isLightboxOpen
        ) {
          closeLightbox();
        }
      }
    );
  }


  const slider = document.querySelector(
    ".vg-testimonials__slider"
  );

  const prevButton = document.querySelector(
    ".vg-testimonials__slider-btn--prev"
  );

  const nextButton = document.querySelector(
    ".vg-testimonials__slider-btn--next"
  );


  if (
    slider &&
    prevButton &&
    nextButton
  ) {
    function getScrollAmount() {
      const card = slider.querySelector(
        ".vg-testimonial-card"
      );

      if (!card) return 0;

      const gap =
        parseFloat(
          getComputedStyle(slider).gap
        ) || 30;

      return card.offsetWidth + gap;
    }


    nextButton.addEventListener(
      "click",
      function () {
        slider.scrollBy({
          left: getScrollAmount(),
          behavior: "smooth"
        });
      }
    );


    prevButton.addEventListener(
      "click",
      function () {
        slider.scrollBy({
          left: -getScrollAmount(),
          behavior: "smooth"
        });
      }
    );
  }
});