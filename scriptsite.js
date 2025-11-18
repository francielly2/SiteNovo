// ======================================================================
// 7.1: CLASSES (Classe ÚNICA - PRODUTO)
class Produto {
    constructor(id, name, price, image) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
    }
}

// 7.3: HERANÇA REMOVIDA
// 7.4: INSTANCIAÇÃO DE OBJETOS - Preços originais sem desconto
let products = [
    // Preço original: 1000
    new Produto(1, "Airpods Pro", 1000, "fone2.png"), 
    
    // Preço original: 1200 (Promoção removida)
    new Produto(2, "Airpods 2ª Geração", 1200, "fone2geração.png"),
    
    // Preço original: 2500
    new Produto(3, "Airpods Max", 2500, "airpodsmax.png")
];
// ======================================================================

let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');

let cart = [];

// ---------------------------------------------------------------------
// 6.2: ESTRUTURA SWITCH
// Abrir/Fechar Carrinho usando SWITCH para demonstração
function toggleCart(action) {
    switch (action) {
        case 'open':
            body.classList.add('showCart');
            break;
        case 'close':
            body.classList.remove('showCart');
            break;
        default:
            body.classList.toggle('showCart');
    }
}

iconCart.addEventListener('click', () => {
    toggleCart('toggle');
});

closeCart.addEventListener('click', () => {
    toggleCart('close');
});
// ---------------------------------------------------------------------

// ADICIONAR AO CARRINHO (BOTÕES ESTÁTICOS dos cards)
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("addCart")) {
        let card = event.target.closest(".product");
        let id_product = card.dataset.id;
        addToCart(id_product);
        toggleCart('open'); // Abre o carrinho
    }
});

function addToCart(product_id) {
    let pos = cart.findIndex(item => item.product_id == product_id);

    if (pos < 0) {
        cart.push({ product_id, quantity: 1 });
    } else {
        cart[pos].quantity++;
    }

    saveCart();
    renderCart();
}

// Salvar (9.1)
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// 5.1: EXEMPLO DE LAÇO FOR
// Função para calcular o total usando FOR tradicional
function calculateTotalFor() {
    let total = 0;
    
    // O laço FOR tradicional é útil para iterar arrays e calcular somas
    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];
        let product = products.find(p => p.id == item.product_id);
        if (product) {
             total += product.price * item.quantity;
        }
    }
    return total;
}

// Mostrar carrinho no Index
function renderCart() {
    listCartHTML.innerHTML = "";
    let totalQty = 0;

    cart.forEach(item => {
        let product = products.find(p => p.id == item.product_id);
        totalQty += item.quantity;

        let div = document.createElement("div");
        div.classList.add("item");

        // 3.2: Uso de Template Literals e toFixed(2)
        div.innerHTML = `
            <div class="image"><img src="${product.image}"></div>
            <div class="name">${product.name}</div>
            <div class="totalPrice">R$${(product.price * item.quantity).toFixed(2)}</div>
            <div class="quantity">
                <span class="minus" data-id="${product.id}"><</span>
                <span>${item.quantity}</span>
                <span class="plus" data-id="${product.id}">></span>
            </div>
        `;

        listCartHTML.appendChild(div);
    });

    iconCartSpan.innerText = totalQty;
    
    // Atualiza o total usando a função com FOR
    const totalPriceElement = document.querySelector('.total-price-cart');
    if (totalPriceElement) {
        totalPriceElement.innerText = `R$${calculateTotalFor().toFixed(2)}`;
    }
}

// Botões + -
listCartHTML.addEventListener("click", (event) => {
    let element = event.target;
    let id = element.dataset.id; 

    if (element.classList.contains("minus") || element.classList.contains("plus")) {
        // 6.3: USO DO OPERADOR TERNÁRIO
        updateQuantity(id, element.classList.contains("plus") ? "plus" : "minus");
    }
});

// 3.6: OPERADOR LÓGICO (&&)
function updateQuantity(id, type) {
    let pos = cart.findIndex(p => p.product_id == id);

    if (type === "plus") {
        // 3.5: INCREMENTO
        cart[pos].quantity++;
    } else {
        // 3.6: LÓGICO (&&) - Usado para garantir que a posição é válida E a quantidade é maior que zero
        if (pos >= 0 && cart[pos].quantity > 0) {
            // 3.5: DECREMENTO
            cart[pos].quantity--;
            if (cart[pos].quantity <= 0) cart.splice(pos, 1);
        }
    }

    saveCart();
    renderCart();
}

// 5.3: EXEMPLO DE LAÇO WHILE
// Função de utilidade que demonstra o uso de WHILE
function checkStock(productId) {
    let stock = 10; // Exemplo: estoque inicial
    let check = 0;
    
    // O laço WHILE é ideal para loops de condição incerta
    while (check < stock) {
        if (check === 5) {
            console.log(`Estoque do produto ${productId} está na metade (${check}).`);
        }
        check++;
    }
    // console.log(`Verificação de estoque para o produto ${productId} concluída.`);
    return stock;
}

// Inicializar carrinho salvo
if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"));
    renderCart();
}


// ---------------------------------------------------------------------
// ------------------- MOSTRAR PEDIDO NA PÁGINA index2 --------------------
// ---------------------------------------------------------------------

if (window.location.pathname.includes("Index2.html")) {
    let pedidoDiv = document.getElementById("resumo-pedido");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let totalPedido = calculateTotalFor(); 

    if (cart.length === 0) {
        pedidoDiv.innerHTML = `<h2>Nenhum item no carrinho.</h2>`;
    } else {
        let html = `<h3 class="total-price-cart">Total do Pedido: R$${totalPedido.toFixed(2)}</h3>`;

        cart.forEach(item => {
            let product = products.find(p => p.id == item.product_id);

            html += `
                <div class="pedido-item">
                    <img src="${product.image}" width="70">
                    <div class="info">
                        <p class="produto-nome"><strong>${product.name}</strong></p>
                        <p>Quantidade: ${item.quantity}</p>
                        <p>Preço unitário: R$${product.price.toFixed(2)}</p>
                        <strong>Subtotal: R$${(product.price * item.quantity).toFixed(2)}</strong>
                    </div>
                </div>
            `;
            // Exemplo de uso da função WHILE
            checkStock(product.id); 
        });

        pedidoDiv.innerHTML = html;
    }
}