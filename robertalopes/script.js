const database = [
  {id: 1,
  img: "./assets/lashes1.jpg"},

  {id: 2,
    img: "./assets/lashes1.jpg"},

    {id: 3,
      img: "./assets/lashes1.jpg"},

      {id: 4,
        img: "./assets/lashes1.jpg"}
]

const database2 = [
  {id: 1,
  img: "./assets/micro1.jpg"},

  {id: 2,
    img: "./assets/micro1.jpg"},

    {id: 3,
      img: "./assets/micro1.jpg"},

      {id: 4,
        img: "./assets/micro1.jpg"}
]


function toggleExtensionImages() {
  var extensionImages = document.getElementById("extension-images");
  var microImages = document.getElementById("micro-images");
  microImages.style.display = "none"; // oculta as micro imagens
  if (extensionImages.style.display === "none") {
    extensionImages.style.display = "block";
  } else {
    extensionImages.style.display = "none";
  }
}


function toggleMicroImages() {
  var microImages = document.getElementById("micro-images");
  var extensionImages = document.getElementById("extension-images");
  extensionImages.style.display = "none"; // oculta as imagens de extensão
  if (microImages.style.display === "none") {
    microImages.style.display = "block";
  } else {
    microImages.style.display = "none";
  }
}

// function toggleExtensionImages() {
//     var extensionImages = document.getElementById("extension-images");
//     if (extensionImages.style.display === "none") {
//       extensionImages.style.display = "block";
//     } else {
//       extensionImages.style.display = "none";
//     }
//   }


//   function toggleMicroImages() {
//     var microImages = document.getElementById("micro-images");
//     if (microImages.style.display === "none") {
//       microImages.style.display = "block";
//     } else {
//       microImages.style.display = "none";
//     }
//   }

  const container = document.getElementById("carousel-container");

  database.forEach(function(item) {
    const img = document.createElement("img");
    img.setAttribute("src", item.img);
    container.appendChild(img);
  });


  let startX;
  let scrollLeft;
  
  container.addEventListener("touchstart", function(event) {
    startX = event.touches[0].pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });
  
  container.addEventListener("touchmove", function(event) {
    event.preventDefault();
    const x = event.touches[0].pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    container.scrollLeft = scrollLeft - walk;
  });


//   const prevButton = document.createElement("button");
// prevButton.innerHTML = "&#8249;";
// prevButton.addEventListener("click", function() {
//   container.scrollLeft -= container.offsetWidth;
// });

// const nextButton = document.createElement("button");
// nextButton.innerHTML = "&#8250;";
// nextButton.addEventListener("click", function() {
//   container.scrollLeft += container.offsetWidth;
// });

// const divExtension = document.getElementById("extension-images")
// divExtension.appendChild(prevButton);
// divExtension.appendChild(nextButton);



const container2 = document.getElementById("carousel-container2");

database2.forEach(function(item) {
  const img = document.createElement("img");
  img.setAttribute("src", item.img);
  container2.appendChild(img);
});


let start2X;
let scroll2Left;

container2.addEventListener("touchstart", function(event) {
  start2X = event.touches[0].pageX - container2.offsetLeft;
  scroll2Left = container2.scroll2Left;
});

container2.addEventListener("touchmove", function(event) {
  event.preventDefault();
  const x = event.touches[0].pageX - container2.offsetLeft;
  const walk = (x - start2X) * 2;
  container2.scroll2Left = scroll2Left - walk;
});
