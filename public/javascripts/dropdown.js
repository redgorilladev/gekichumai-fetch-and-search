document.addEventListener("DOMContentLoaded", () => {
  const drowpdownBtn = document.getElementById("dropdown-nav");
  const gameNav = document.getElementById("game-nav");

  drowpdownBtn.addEventListener("click", () => {
    if (gameNav.style.display === "block") {
      gameNav.style.display = "none";
    } else {
      gameNav.style.display = "block";
    }
  });

  document.onclick = function (e) {
    if (
      !drowpdownBtn.contains(e.target) &&
      gameNav.style.display === "block" &&
      !gameNav.contains(e.target)
    ) {
      console.log("clicked outside menu");
      gameNav.style.display = "none";
    }
  };
});
