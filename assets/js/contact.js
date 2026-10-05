document.addEventListener("DOMContentLoaded", () => {

  const form = document.querySelector(".vg-contact__form");

  if (!form) return;

  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwZyeCMRbmzOGdXj67HSKBdGx1pZJI3LvzLk2T9KMMS3FfhPQkOjnGfO-kdhMvRiQ1rRw/exec";

  const nameInput = document.getElementById("vg-name");
  const phoneInput = document.getElementById("vg-phone");
  const emailInput = document.getElementById("vg-email");
  const serviceInput = document.getElementById("vg-service");
  const messageInput = document.getElementById("vg-message");

  const submitButton =
    form.querySelector(".vg-contact__submit");


  function showError(input, message) {

    clearError(input);

    input.classList.add("vg-input-error");

    const error = document.createElement("span");

    error.className = "vg-field-error";

    error.textContent = message;

    input.parentElement.appendChild(error);
  }


  function clearError(input) {

    input.classList.remove("vg-input-error");

    const existingError =
      input.parentElement.querySelector(".vg-field-error");

    if (existingError) {
      existingError.remove();
    }
  }


  function clearAllErrors() {

    [
      nameInput,
      phoneInput,
      emailInput,
      serviceInput,
      messageInput
    ].forEach(input => {

      if (input) {
        clearError(input);
      }

    });
  }


  function isValidName(name) {

    return /^[A-Za-z]+(?:\s[A-Za-z]+)*$/.test(name);

  }


  function isValidEmail(email) {

    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(email);

  }


  function isValidPhone(phone) {

    return /^[6-9][0-9]{9}$/.test(phone);

  }


  function getFormData() {

    return {
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      email: emailInput.value.trim(),
      service: serviceInput.value.trim(),
      message: messageInput.value.trim()
    };

  }


  function validateForm(data) {

    let valid = true;


    if (!data.name) {

      showError(
        nameInput,
        "Please enter your name."
      );

      valid = false;

    } else if (data.name.length < 3) {

      showError(
        nameInput,
        "Name must contain at least 3 characters."
      );

      valid = false;

    } else if (data.name.length > 50) {

      showError(
        nameInput,
        "Name cannot exceed 50 characters."
      );

      valid = false;

    } else if (!isValidName(data.name)) {

      showError(
        nameInput,
        "Name can contain alphabets and spaces only."
      );

      valid = false;

    }


    if (!data.phone) {

      showError(
        phoneInput,
        "Please enter your phone number."
      );

      valid = false;

    } else if (!isValidPhone(data.phone)) {

      showError(
        phoneInput,
        "Enter a valid 10-digit mobile number."
      );

      valid = false;

    }


    if (!data.email) {

      showError(
        emailInput,
        "Please enter your email address."
      );

      valid = false;

    } else if (!isValidEmail(data.email)) {

      showError(
        emailInput,
        "Please enter a valid email address."
      );

      valid = false;

    }


    if (!data.service) {

      showError(
        serviceInput,
        "Please select a service."
      );

      valid = false;

    }


    if (data.message.length > 2000) {

      showError(
        messageInput,
        "Project details cannot exceed 2000 characters."
      );

      valid = false;

    }


    return valid;

  }


  function setLoading(isLoading) {

    if (isLoading) {

      submitButton.disabled = true;

      submitButton.dataset.originalText =
        submitButton.querySelector("span").textContent;

      submitButton.querySelector("span").textContent =
        "SUBMITTING...";

      submitButton.style.opacity = "0.7";

      submitButton.style.pointerEvents = "none";

    } else {

      submitButton.disabled = false;

      submitButton.querySelector("span").textContent =
        submitButton.dataset.originalText ||
        "SUBMIT ENQUIRY";

      submitButton.style.opacity = "";

      submitButton.style.pointerEvents = "";

    }

  }


  function showSuccess() {

    removeNotification();

    const notification =
      document.createElement("div");

    notification.className =
      "vg-form-notification vg-form-success";

    notification.innerHTML = `
      <strong>Thank you!</strong>
      <span>Your enquiry has been submitted successfully.</span>
    `;

    form.insertBefore(
      notification,
      form.firstChild
    );

    setTimeout(() => {

      notification.remove();

    }, 6000);

  }


  function showFormError(message) {

    removeNotification();

    const notification =
      document.createElement("div");

    notification.className =
      "vg-form-notification vg-form-error";

    notification.innerHTML = `
      <strong>Something went wrong.</strong>
      <span>${message}</span>
    `;

    form.insertBefore(
      notification,
      form.firstChild
    );

  }


  function removeNotification() {

    const existing =
      form.querySelector(".vg-form-notification");

    if (existing) {
      existing.remove();
    }

  }


  form.addEventListener("submit", async (event) => {

    event.preventDefault();

    clearAllErrors();

    removeNotification();

    const data = getFormData();

    if (!validateForm(data)) {

      const firstError =
        form.querySelector(".vg-input-error");

      if (firstError) {
        firstError.focus();
      }

      return;

    }

    setLoading(true);

    try {

      const response = await fetch(
        SCRIPT_URL,
        {
          method: "POST",
          body: JSON.stringify(data)
        }
      );

      let result;

      try {

        result = await response.json();

      } catch (jsonError) {

        result = {
          success: true
        };

      }

      if (
        result &&
        result.success === false
      ) {

        throw new Error(
          result.message ||
          "Unable to submit the form."
        );

      }

      form.reset();

      showSuccess();

    } catch (error) {

      console.error(
        "VG Contact Form Error:",
        error
      );

      showFormError(
        "Unable to submit your enquiry right now. Please try again or contact us directly."
      );

    } finally {

      setLoading(false);

    }

  });


  nameInput.addEventListener("input", () => {

    nameInput.value =
      nameInput.value
        .replace(/[^A-Za-z\s]/g, "")
        .replace(/\s{2,}/g, " ");

    clearError(nameInput);

  });


  phoneInput.addEventListener("input", () => {

    phoneInput.value =
      phoneInput.value
        .replace(/\D/g, "")
        .slice(0, 10);

    clearError(phoneInput);

  });


  emailInput.addEventListener("input", () => {

    clearError(emailInput);

  });


  serviceInput.addEventListener("change", () => {

    clearError(serviceInput);

  });


  messageInput.addEventListener("input", () => {

    if (messageInput.value.length > 2000) {

      messageInput.value =
        messageInput.value.slice(0, 2000);

    }

    clearError(messageInput);

  });

});
