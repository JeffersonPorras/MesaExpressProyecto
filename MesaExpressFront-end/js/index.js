const initialMessage = "Promocion del Dia";
const reversation = "Agenda";

const establishments = [
    {name:"KFC", logo: "landing/IMAGES/KFC/KFC_Logo.svg.png", description:"Disfruta del inconfundible sabor del pollo frito más famoso del mundo. KFC te ofrece recetas irresistibles con ese toque secreto que hace que cada bocado sea puro placer. ¡Crujiente por fuera, jugoso por dentro!"},
    {name:"BurgerKing", logo: "landing/IMAGES/BurgerKing/burger copy.svg", description:"Con sus icónicas hamburguesas, papas doradas y sabores que todos aman, McDonald’s es la parada obligada para quienes buscan rapidez, sabor y tradición. Perfecto para cualquier momento del día."},
    {name:"BurgerKing", logo: "landing/IMAGES/McDonalds/McDonald's-Logo.wine copy.png", description:"Si lo tuyo es el sabor ahumado y auténtico, Burger King te espera con sus hamburguesas a la parrilla hechas al momento. Grandes porciones, gran sabor y una experiencia digna de un verdadero fan del buen comer."},
];
const cardEstablishments = document.getElementById("card_gastronomicEstablishments");

establishments.forEach(establishments => {
    const section = document.createElement("div");
    section.classList.add("about_icons");
    section.innerHTML = `
        <img src="${establishments.logo}" alt="${establishments.name} Logo" class = "about_icon">
        <div class = "paragraph">
            <p class="discounts">${establishments.description}</p>
        </div>
    `;
    cardEstablishments.appendChild(section);
});


const promotions = [
    
    {name:"KFC", logo: "landing/IMAGES/KFC/kfc.jpg", description:"KFC – Promoción Exclusiva MesaExpress <br> Combo Duo Crunchy: <br> 2 piezas de pollo + papas medianas + bebida por solo $4.99. <br> ¡Crujiente, jugoso y al mejor precio! Solo por tiempo limitado."},
    {name:"BurgerKing", logo: "landing/IMAGES/BurgerKing/burger copy.svg", description:"McDonald’s – Sabor que te recompensa <br>McPack Familiar: <br>2 McCombo + 1 Cajita Feliz + 2 postres por $10.99. <br> Ideal para compartir y disfrutar en casa. ¡Solo en MesaExpress!"},
    {name:"McDonalds", logo: "landing/IMAGES/McDonalds/McDonald's-Logo.wine copy.png", description:"Burger King – El Rey del Ahorro <br> King Combo 2x1: <br> Pide un Whopper Combo y recibe otro completamente gratis. <br> Más sabor, más fuego, más para ti. Válido de lunes a viernes."},
];

const cardPromotions = document.getElementById("card_promotions");

promotions.forEach(promotions => {
    const section = document.createElement("div");
    section.classList.add("card_promotions");
    section.innerHTML = `
        <img src= "${promotions.logo}" class = "about_icon">
        <h3 class="price_price">${initialMessage} </h3>
        
        <div class="price_items">
            <p class="paragraph">${promotions.description} </p>
        </div>

            <a href="#" class="button">${reversation} </a>
    `;
    cardPromotions.appendChild(section);
});

