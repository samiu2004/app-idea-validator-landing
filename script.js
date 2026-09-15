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

  const formFields = form.querySelector(".form-fields");
  const submitButton = form.querySelector(".form-submit");
  const status = form.querySelector(".form-status");
  let submitting = false;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitting) return;

    submitting = true;
    submitButton.disabled = true;
    status.textContent = "";
    status.className = "form-status";
    status.setAttribute("role", "status");

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Form submission failed");

      formFields.hidden = true;
      status.innerHTML = "You're in.<br>We'll contact you when early-access validation opens.";
      status.className = "form-status is-visible is-success";
    } catch {
      status.textContent = "Something went wrong. Please try again.";
      status.className = "form-status is-visible is-error";
      status.setAttribute("role", "alert");
    } finally {
      submitting = false;
      submitButton.disabled = false;
    }
  });
}
