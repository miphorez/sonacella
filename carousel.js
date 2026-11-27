for (const carousel of document.querySelectorAll("[data-carousel]")) {
  const slides = Array.from(carousel.querySelectorAll("[data-carousel-slide]"));
  const targets = slides.map((slide) => document.getElementById(slide.dataset.carouselTarget ?? ""));
  const controls = carousel.querySelector("[data-carousel-controls]");
  const status = carousel.querySelector("[data-carousel-status]");
  const previous = carousel.querySelector('[data-carousel-step="-1"]');
  const next = carousel.querySelector('[data-carousel-step="1"]');
  if (!slides.length || !controls || !status || !previous || !next) continue;

  let current = 0;
  let touchStart = null;

  function showSlide(index, updateHash = false) {
    if (index < 0 || index >= slides.length) return;
    const focused = document.activeElement;
    const focusWasInside = slides[current].contains(focused);
    slides.forEach((slide, position) => {
      const hidden = position !== index;
      if (hidden) {
        for (const frame of slide.querySelectorAll("[data-video]")) {
          frame.dispatchEvent(new Event("stop-video"));
        }
      }
      slide.hidden = hidden;
      slide.inert = hidden;
      const target = targets[position];
      if (target) {
        target.hidden = hidden;
        target.inert = hidden;
      }
    });
    current = index;
    previous.disabled = current === 0;
    next.disabled = current === slides.length - 1;
    const title = slides[current].querySelector("[data-carousel-title], .eyebrow").textContent;
    status.textContent = `${current + 1} of ${slides.length} · ${title}`;

    const focusedStepDisabled = (focused === previous || focused === next) && focused.disabled;
    if (focusedStepDisabled || (focusWasInside && !slides[current].contains(focused))) {
      (next.disabled ? previous : next).focus({ preventScroll: true });
    }
    if (updateHash) history.replaceState(null, "", `#${slides[current].id}`);
  }

  function showHashSlide() {
    const hashTarget = document.getElementById(location.hash.slice(1));
    const index = slides.findIndex((slide, position) =>
      slide === hashTarget || (hashTarget && targets[position]?.contains(hashTarget))
    );
    if (index >= 0 || location.hash === `#${carousel.id}`) {
      showSlide(Math.max(0, index));
      requestAnimationFrame(() => carousel.scrollIntoView({ block: "start" }));
    }
  }

  carousel.classList.add("carousel");
  carousel.setAttribute("aria-roledescription", "carousel");
  controls.hidden = slides.length < 2;
  previous.addEventListener("click", () => showSlide(current - 1, true));
  next.addEventListener("click", () => showSlide(current + 1, true));
  controls.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const index = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: slides.length - 1 }[event.key];
    if (index === undefined) return;
    event.preventDefault();
    showSlide(index, true);
  });
  carousel.addEventListener("touchstart", (event) => {
    touchStart = null;
    if (event.touches.length !== 1 || !event.target.closest("[data-carousel-slide]")) return;
    if (event.target.closest("a, button, iframe, input, textarea, select")) return;
    const touch = event.touches[0];
    touchStart = { x: touch.clientX, y: touch.clientY };
  }, { passive: true });
  carousel.addEventListener("touchend", (event) => {
    if (!touchStart) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(deltaX) >= 60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      showSlide(current + (deltaX < 0 ? 1 : -1), true);
    }
  }, { passive: true });
  carousel.addEventListener("touchcancel", () => { touchStart = null; }, { passive: true });
  window.addEventListener("hashchange", showHashSlide);
  showSlide(0);
  showHashSlide();
}
