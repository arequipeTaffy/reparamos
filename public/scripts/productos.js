const productos = document.querySelectorAll(".producto");
const botones = document.querySelectorAll(".boton");
const enviar = document.querySelector(".whatsapp");

let precio_final = 0;
let cantidad_productos = []; 
productos.forEach((element,N) => {
    element.classList.add("id-"+N);
    cantidad_productos.push(0);
});

let lista_productos = [];
const cards = document.querySelectorAll('.sys');
cards.forEach((product, N) => {
    const price = product.getAttribute("data-precio");
    const name = product.getAttribute("data-name");
    
    const producto = {
        name: name,
        price: Number(price),
        amount: 0,
        id: N
    };
    lista_productos.push(producto);
});

function cantidad(id, aumentar){
    if(aumentar){
        cantidad_productos[id] +=  1;    
    } else {
        if (cantidad_productos[id] > 0) {
            cantidad_productos[id] -= 1;
        }
    }
    document.querySelector((`.id-${id}`)).innerHTML = cantidad_productos[id];

    precio_final = 0;
    for (let i = 0; i < cantidad_productos.length; i++) {
        if (cantidad_productos[i]) {
            precio_final = precio_final + (lista_productos[i].price * cantidad_productos[i]);
        }
    }
    document.querySelector(".precio").classList.remove("text-green-600");
    if (precio_final) {
        document.querySelector(".precio").classList.add("text-green-600");
    }
    document.querySelector(".precio").innerHTML = precio_final;

}

botones.forEach(element =>{
    element.addEventListener("click",()=>{
        const id = element.parentNode.firstElementChild.nextElementSibling.className.match(/id-(\d+)/);
        if (element.innerHTML == "+") {
            cantidad(id[1], 1);
        }else{
            cantidad(id[1], 0);
        }
    });
});

enviar.addEventListener("click", ()=>{
    precio_final = 0;
    var nda = true;
    const Nombre = document.querySelector(".nombre").value;
    const direccion =  document.querySelector(".direccion").value;
    if (!Nombre || !direccion) {
        alert("Rellene los campos");
        return 0;
    }
    var url= "https://api.whatsapp.com/send?phone=+573016055851&text=Hola%20mi%20nombre%20es%20"+encodeURIComponent(Nombre)+"%20y%20me%20ubico%20en%20"+encodeURIComponent(direccion)+".%20Quisiera%20comprar%20los%20siguientes%20productos%20[%20";


    for (let i = 0; i < cantidad_productos.length; i++) {

        if (cantidad_productos[i]) {
            url += "%20"+cantidad_productos[i]+"%20"+lista_productos[i].name;
            precio_final = precio_final + (lista_productos[i].price*cantidad_productos[i]);
            nda = false;
        }
        
    }
    if (nda) {
        alert("No selecciono ningun producto");
        return 0;
    }
    url +="%20]%20teniendo%20un%20precio%20final%20de%20$"+precio_final+"%20gracias";
    window.location.href=url;
});