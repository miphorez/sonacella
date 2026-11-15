const releases = document.querySelector("#releases");

if (releases) {
  const slides = Array.from(releases.querySelectorAll(".release-entry"));
  const controls = releases.querySelector("[data-release-controls]");
  const status = releases.querySelector("[data-release-status]");
  const newer = releases.querySelector('[data-release-step="-1"]');
  const older = releases.querySelector('[data-release-step="1"]');
  let current = 0;
  let touchStart = null;

  function showRelease(index, updateHash = false) {
    if (index < 0 || index >= slides.length) return;
    const focusWasInside = slides[current].contains(document.activeElement);
    slides.forEach((slide, position) => {
      const hidden = position !== index;
      if (hidden) {
        for (const frame of slide.querySelectorAll("[data-video]")) {
          frame.dispatchEvent(new Event("stop-video"));
        }
      }
      slide.hidden = hidden;
      slide.inert = hidden;
    });
    current = index;
    newer.disabled = current === 0;
    older.disabled = current === slides.length - 1;
    const title = slides[current].querySelector(".eyebrow").textContent;
    status.textContent = `${current + 1} of ${slides.length} · ${title}`;
    if (focusWasInside && slides[current].hidden === false && !slides[current].contains(document.activeElement)) {
      (older.disabled ? newer : older).focus({ preventScroll: true });
    }
    if (updateHash) history.replaceState(null, "", `#${slides[current].id}`);
  }

  function showHashRelease() {
    const index = slides.findIndex((slide) => `#${slide.id}` === location.hash);
    if (index >= 0 || location.hash === "#releases") {
      showRelease(Math.max(0, index));
      requestAnimationFrame(() => releases.scrollIntoView({ block: "start" }));
    }
  }

  if (slides.length && controls && status && newer && older) {
    releases.classList.add("release-carousel");
    releases.setAttribute("aria-roledescription", "carousel");
    controls.hidden = slides.length < 2;
    newer.addEventListener("click", () => showRelease(current - 1, true));
    older.addEventListener("click", () => showRelease(current + 1, true));
    controls.addEventListener("keydown", (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const index = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: slides.length - 1 }[event.key];
      if (index === undefined) return;
      event.preventDefault();
      showRelease(index, true);
      if (document.activeElement.disabled) (older.disabled ? newer : older).focus();
    });
    releases.addEventListener("touchstart", (event) => {
      touchStart = null;
      if (event.touches.length !== 1 || !event.target.closest(".release-entry")) return;
      if (event.target.closest("a, button, iframe, input, textarea, select")) return;
      const touch = event.touches[0];
      touchStart = { x: touch.clientX, y: touch.clientY };
    }, { passive: true });
    releases.addEventListener("touchend", (event) => {
      if (!touchStart) return;
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchStart.x;
      const deltaY = touch.clientY - touchStart.y;
      touchStart = null;
      if (Math.abs(deltaX) >= 60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
        showRelease(current + (deltaX < 0 ? 1 : -1), true);
      }
    }, { passive: true });
    releases.addEventListener("touchcancel", () => { touchStart = null; }, { passive: true });
    window.addEventListener("hashchange", showHashRelease);
    showRelease(0);
    showHashRelease();
  }
}
