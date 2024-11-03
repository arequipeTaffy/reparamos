const estrellas = document.querySelectorAll(".stars");
estrellas.forEach(element => {
    element.addEventListener("mouseover",()=>{
        if(!event.target.classList.contains("stars-p")){
            event.target.classList.replace("fa-star-o","fa-star");
        }
    })
    element.addEventListener("mouseleave",()=>{
        if(!event.target.classList.contains("stars-p")){

            event.target.classList.replace("fa-star","fa-star-o");
        }
    })
    element.addEventListener("click",()=>{
        if (event.target.classList.contains("stars-p")) {
            event.target.classList.replace("fa-star-o","fa-star");
            event.target.classList.remove("stars-p");
            console.log("true");
        } else {
            event.target.classList.replace("fa-star-o","fa-star");
            event.target.classList.add("stars-p");
        }
    })
});