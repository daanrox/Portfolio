function toggleMode() {
    const html = document.documentElement;
  
    //   if (html.classList.contains("light")) {
    //     html.classList.remove("light");
    //   } else {
    //     html.classList.add("light");
    //   }
  
    const img = document.querySelector("#profile__image");
  
    html.classList.toggle("light");
  
    if (html.classList.contains("light")) {
      img.setAttribute("src", "./assets/Daanrox.jpg");
      img.setAttribute(
        "alt",
        "Foto colorida de Daanrox sorrindo"
      );
    } else {
      img.setAttribute("src", "./assets/Daanrox.jpg");
      img.setAttribute(
        "alt",
        "Foto colorida de Daanrox sorrindo"
      );
    }
  }
  