let expandedQr;

function setQrExpanded(button, expanded) {
  button.setAttribute("aria-expanded", String(expanded));
  button.querySelector("[data-qr-label]").textContent = expanded ? "Hide QR" : "Show QR";
  document.getElementById(button.getAttribute("aria-controls")).hidden = !expanded;
}

async function copyStationCard(text, button, status) {
  status.textContent = "";
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text.value);
    } else {
      text.focus();
      text.select();
      if (!document.execCommand("copy")) throw new Error("Clipboard unavailable");
      button.focus();
    }
    status.textContent = "Copied. In Sonacella, choose Add stations → From clipboard.";
  } catch {
    text.focus();
    text.select();
    status.textContent = "Copy the selected card text using your browser’s copy command.";
  }
}

function httpsAddress(value) {
  try {
    const address = new URL(value);
    return address.protocol === "https:" && !address.username && !address.password ? address : null;
  } catch {
    return null;
  }
}

function renderStationPreview(card, text) {
  const { stations } = JSON.parse(text);
  const [station] = stations;
  const body = card.querySelector(".station-preview-body");
  card.querySelector("[data-carousel-title]").textContent = station.name;
  body.querySelector(".station-description").textContent = station.description || "Description unavailable";

  const artwork = document.createElement("div");
  artwork.className = "station-artwork";
  const fallback = document.createElement("span");
  fallback.textContent = "Artwork unavailable";
  artwork.append(fallback);
  const imageAddress = httpsAddress(station.imageUrl);
  if (imageAddress) {
    fallback.textContent = "Loading artwork…";
    const image = new Image();
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    image.referrerPolicy = "no-referrer";
    // Lazy images must have a rendered box before they can load.
    image.className = "station-artwork-loading";
    image.addEventListener("load", () => {
      image.classList.remove("station-artwork-loading");
      fallback.hidden = true;
    }, { once: true });
    image.addEventListener("error", () => {
      image.remove();
      fallback.textContent = "Artwork unavailable";
    }, { once: true });
    artwork.append(image);
    image.src = imageAddress.href;
  }
  body.prepend(artwork);

  const website = httpsAddress(station.website);
  const provider = body.querySelector(".station-provider");
  provider.hidden = !website;
  if (website) {
    const link = provider.querySelector("a");
    link.href = website.href;
    link.textContent = website.hostname.replace(/^www\./, "");
    link.referrerPolicy = "no-referrer";
  }
  body.querySelector(".station-provider-note")?.remove();
  if (station.terms) {
    const note = document.createElement("p");
    note.className = "station-provider-note";
    const label = document.createElement("strong");
    label.textContent = "Listening conditions";
    note.append(label, station.terms);
    const terms = httpsAddress(station.termsUrl);
    if (terms) {
      const link = document.createElement("a");
      link.href = terms.href;
      link.textContent = "Provider terms";
      link.referrerPolicy = "no-referrer";
      note.append(" ", link);
    }
    body.append(note);
  }
}


for (const card of document.querySelectorAll(".discovery-card")) {
  const copy = card.querySelector("[data-copy-card]");
  const qr = card.querySelector("[data-toggle-qr]");
  const text = card.querySelector("textarea");
  const status = card.querySelector(".station-copy-status");
  renderStationPreview(card, text.value);
  copy.addEventListener("click", () => copyStationCard(text, copy, status));
  qr.addEventListener("click", () => {
    const expand = expandedQr !== qr;
    if (expandedQr) setQrExpanded(expandedQr, false);
    expandedQr = expand ? qr : undefined;
    if (expand) setQrExpanded(qr, true);
  });
  copy.hidden = false;
  qr.hidden = false;
}
