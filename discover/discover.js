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

for (const card of document.querySelectorAll(".discovery-card")) {
  const copy = card.querySelector("[data-copy-card]");
  const qr = card.querySelector("[data-toggle-qr]");
  const text = card.querySelector("textarea");
  const status = card.querySelector(".station-copy-status");
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
