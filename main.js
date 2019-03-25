console.log("hello world");
window.addEventListener("load", () => {
  fetch("http://localhost:3000/api")
    .then(r => r.json())
    .then(data => {
      document.getElementById("");
    });
});
