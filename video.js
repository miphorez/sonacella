for (const frame of document.querySelectorAll("[data-video]")) {
  const launch = frame.querySelector(".video-launch");
  launch.addEventListener("click", (event) => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const player = document.createElement("iframe");
    player.src = `https://www.youtube.com/embed/${encodeURIComponent(frame.dataset.video)}?autoplay=1&playsinline=1&rel=0`;
    player.title = frame.dataset.videoTitle;
    player.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    player.allowFullscreen = true;
    player.referrerPolicy = "strict-origin-when-cross-origin";
    frame.replaceChildren(player);
    player.focus();
  });
}
