for (const gallery of document.querySelectorAll("[data-gallery]")) {
  const slides = Array.from(gallery.querySelectorAll("[data-caption]"));
  const caption = gallery.querySelector("[data-caption-live]");
  let current = 0;

  function showSlide(index) {
    slides[current].classList.remove("is-current");
    slides[current].inert = true;
    current = (index + slides.length) % slides.length;
    slides[current].inert = false;
    slides[current].classList.add("is-current");
    caption.textContent = `${slides[current].dataset.caption} · ${current + 1}/${slides.length}`;
  }

  for (const button of gallery.querySelectorAll("[data-step]")) {
    button.hidden = false;
    button.addEventListener("click", () => showSlide(current + Number(button.dataset.step)));
  }
  showSlide(current);
}
