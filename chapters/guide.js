const map = document.getElementById("map");
const lines = map.querySelector(".lines");
const fields = [...map.querySelectorAll("[data-field]")];
const fieldNotes = {
  title: "The text after the timestamp becomes the title at the top of the card.",
  time: "Each timestamp is the chapter’s start in the original recording. For all but the last chapter, the next timestamp marks the end.",
  metadata: "The optional YouTube metadata line can supply the recording title, artwork, channel, and description. The basic template above only needs the timing rows.",
  source: "The optional Source line holds the original YouTube video URL. The card can open that video at this chapter’s timestamp."
};

function drawArrows() {
  for (const line of lines.querySelectorAll("[data-connection]")) line.remove();
  if (getComputedStyle(lines).display === "none") return;
  const frame = map.getBoundingClientRect();
  const row = document.querySelector("#mapping-row div").getBoundingClientRect();
  for (const field of fields) {
    const key = field.dataset.field;
    const source = field.getBoundingClientRect();
    const target = map.querySelector('[data-mark="' + key + '"]').getBoundingClientRect();
    const fromRow = key === "title" || key === "time";
    const x1 = (fromRow ? row.right + 24 : source.right) - frame.left;
    const y1 = (fromRow ? row.top + row.height / 2 + (key === "title" ? -4 : 4) : source.top + source.height / 2) - frame.top;
    const x2 = target.left - frame.left - 3;
    const y2 = target.top + target.height / 2 - frame.top;
    const bend = (x1 + x2) / 2;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M " + x1 + " " + y1 + " C " + bend + " " + y1 + " " + bend + " " + y2 + " " + x2 + " " + y2);
    path.setAttribute("marker-end", "url(#arrow)");
    path.dataset.connection = key;
    path.classList.toggle("active", field.getAttribute("aria-pressed") === "true");
    lines.append(path);
  }
}

for (const button of fields) {
  button.addEventListener("click", () => {
    const field = button.dataset.field;
    for (const candidate of fields) candidate.setAttribute("aria-pressed", String(candidate === button));
    for (const mark of map.querySelectorAll("[data-mark]")) mark.classList.toggle("active", mark.dataset.mark === field);
    document.getElementById("field-note").textContent = fieldNotes[field];
    drawArrows();
  });
}

async function copyTemplate(template, status) {
  const text = template.children.length
    ? [...template.children].map(row => row.textContent).join("\n")
    : template.textContent;
  try {
    await navigator.clipboard.writeText(text + "\n");
    status.textContent = "Copied.";
  } catch {
    const range = document.createRange();
    range.selectNodeContents(template);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    status.textContent = "Text selected. Copy it or download the TXT.";
  }
}

document.getElementById("copy").addEventListener("click", () =>
  copyTemplate(document.getElementById("timing-template"), document.getElementById("copy-status")));
document.getElementById("copy-worked").addEventListener("click", () =>
  copyTemplate(document.getElementById("worked-template"), document.getElementById("worked-copy-status")));

new ResizeObserver(drawArrows).observe(map);
