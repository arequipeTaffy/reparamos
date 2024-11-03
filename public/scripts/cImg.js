var sliding = document.getElementById('sliding');
var cPos = 0;
var images = ['sliding1.jpg', 'sliding2.jpg', 'sliding3.jpg'];

function changeImage(){
    if (++cPos >= images.length){
        cPos = 0;
    }
    sliding.style.backgroundImage = `url(public/${images[cPos]})`;
}

setInterval(changeImage, 5000);