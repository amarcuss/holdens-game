window.addEventListener('load', () => {
  const canvas = document.getElementById('game');
  const game = new Game(canvas);
  game.start();
});
