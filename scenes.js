/* Measure stationary chapter wrappers, never the moving image itself. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let scenes = [], frame = 0;
  function collect() {
    scenes = [...document.querySelectorAll('.cityhead, .hero .stage')];
    for (const scene of scenes) {
      const img = scene.querySelector('img');
      if (img && scene.classList.contains('cityhead')) {
        scene.style.setProperty('--scene-image', `url("${img.getAttribute('src')}")`);
        scene.querySelector('.dio')?.removeAttribute('data-p');
      }
    }
    schedule();
  }
  function paint() {
    frame = 0;
    const height = innerHeight;
    const positions = scenes.map(scene => ({scene, rect:scene.getBoundingClientRect()}));
    for (const {scene, rect} of positions) {
      if (rect.bottom < -200 || rect.top > height + 200) continue;
      const distance = height / 2 - (rect.top + rect.height / 2);
      const offset = reduced.matches ? 0 : Math.max(-95, Math.min(95, distance * .2));
      scene.style.setProperty('--scene-y', `${offset.toFixed(2)}px`);
      scene.style.setProperty('--haze-y', `${(offset * .35).toFixed(2)}px`);
    }
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(paint); }
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', schedule);
  reduced.addEventListener('change', schedule);
  new MutationObserver(collect).observe(document.getElementById('dayList'), {childList:true});
  collect();
})();
