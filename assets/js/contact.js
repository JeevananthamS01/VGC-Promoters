document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contact-form");
  const responseMessage = document.getElementById("contact-response");

  if (contactForm && responseMessage) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Reset response message
      responseMessage.textContent = "Sending...";
      responseMessage.className = "contact-form__response";
      responseMessage.style.display = "block";

      const formData = new FormData(contactForm);

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: formData,
        });

        const result = await response.text();

        if (response.ok) {
          responseMessage.textContent = result;
          responseMessage.className = "contact-form__response success";
          contactForm.reset();
        } else {
          responseMessage.textContent = result || "An error occurred.";
          responseMessage.className = "contact-form__response error";
        }
      } catch (error) {
        responseMessage.textContent = "Could not connect to the server.";
        responseMessage.className = "contact-form__response error";
      }

      // Hide message after 5 seconds
      setTimeout(() => {
        responseMessage.style.display = "none";
      }, 5000);
    });
  }
});
