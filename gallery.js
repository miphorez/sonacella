for (const gallery of document.querySelectorAll("[data-gallery]")) {
  const slides = Array.from(gallery.querySelectorAll("[data-caption]"));
  const caption = gallery.querySelector("[data-caption-live]");
  const credit = gallery.querySelector("[data-credit-live]");
  const watchLink = gallery.querySelector("[data-watch-live]");
  let current = 0;

  function showSlide(index) {
    for (const frame of slides[current].querySelectorAll("[data-video]")) {
      frame.dispatchEvent(new Event("stop-video"));
    }
    slides[current].classList.remove("is-current");
    slides[current].inert = true;
    current = (index + slides.length) % slides.length;
    slides[current].inert = false;
    slides[current].classList.add("is-current");
    caption.textContent = `${slides[current].dataset.caption} · ${current + 1}/${slides.length}`;
    if (credit) credit.hidden = !slides[current].hasAttribute("data-show-credit");
    if (watchLink) {
      watchLink.href = slides[current].dataset.watchUrl;
    }
  }

  for (const button of gallery.querySelectorAll("[data-step]")) {
    button.hidden = false;
    button.addEventListener("click", () => showSlide(current + Number(button.dataset.step)));
  }
  showSlide(current);
}
