let startMenu = {
  dotInterval: function() {},
  init: function() {
    let text = document.getElementById("mainText");
    let dots = 0;
    this.dotInterval = setInterval(() => {
      let dotText = "";
      for (let i = 0; i < dots; i ++) dotText += ".";
      text.textContent = "Loading" + dotText;
      dots ++;
      if (dots + 1 > 4) dots = 0;
    }, 500);
  },
  loaded: function() {
    clearInterval(this.dotInterval);
    setTimeout(() => document.getElementById("mainText").textContent = "Diep", 500);
  }
};
startMenu.init();
window.onload = function() {
  console.log("Loaded assets.");
  startMenu.loaded();
};