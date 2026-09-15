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
}
