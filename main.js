console.log("hello world");
window.addEventListener("load", () => {
  fetch("http://localhost:3000/api")
    .then(r => r.json())
    .then(data => {
      // document.getElementById("main").innerHTML += `
      //   <div>${data[0].name}</div>
      //   <img src="${data[0].pic}"/>
      // `
      displayImages(data);
      console.log(data)
    });
});
displayImages = (data) =>{
  data.forEach(image =>{
    document.getElementById("main").innerHTML += `
        <div>${image.name}</div>
        <img src="${image.pic}"/>
      `  
  })
}