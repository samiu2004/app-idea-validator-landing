const attributionFields = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
];

const form = document.querySelector("#early-access-form");

if (form) {
  const query = new URLSearchParams(window.location.search);

  for (const fieldName of attributionFields) {
    const field = form.elements.namedItem(fieldName);
    if (field) {
      field.value = query.get(fieldName) ?? "";
    }
  }

  const landingUrlField = form.elements.namedItem("landing_url");
  const referrerField = form.elements.namedItem("referrer");

  if (landingUrlField) {
    landingUrlField.value = window.location.href;
  }

  if (referrerField) {
    referrerField.value = document.referrer;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const status = form.querySelector(".form-status");
    const fields = form.querySelector(".form-fields");
    const submitButton = form.querySelector("button[type='submit']");
    const action = form.getAttribute("action") ?? "";

    if (!status || !submitButton) {
      return;
    }

    status.className = "form-status";
    status.textContent = "";

    if (action.includes("YOUR_FORM_ID")) {
      status.textContent = "Early-access signup is not connected yet. Replace YOUR_FORM_ID before launch.";
      status.classList.add("is-visible", "is-error");
      return;
    }

    submitButton.disabled = true;
    submitButton.setAttribute("aria-disabled", "true");
    form.setAttribute("aria-busy", "true");

    try {
      const response = await fetch(action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error("The signup could not be completed.");
      }

      form.reset();
      if (fields) {
        fields.hidden = true;
      }
      status.textContent = "You're in. We'll contact you when early-access validation opens.";
      status.classList.add("is-visible", "is-success");
    } catch {
      status.textContent = "We couldn't add you right now. Please check your connection and try again.";
      status.classList.add("is-visible", "is-error");
      submitButton.disabled = false;
      submitButton.removeAttribute("aria-disabled");
    } finally {
      form.removeAttribute("aria-busy");
    }
  });
}
