 //xd
 const imagenes = document.body.querySelectorAll(".slide");
 var cantidad_img = imagenes.length;
 var i = 0;
 imagenes.forEach((si,no) => {
         si.style.transform = "translatey("+(0+(100*no)-(100*i))+"%"+")";
 });

 var bucle_carusel = setInterval(()=>{
     i++;
     if(i==cantidad_img){
         i=0;
     }
     imagenes.forEach((si,no) => {
         si.style.transform = "translatey("+(0+(100*no)-(100*i))+"%"+")";
     });
     
 },5000);
