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

let list_cart_HTML = document.query_selector('.listCart');
let icon_cart = document.query_selector('.icon-cart');
let icon_cart_span = document.query_selector('.icon-cart span');
let body = document.query_selector('body');
let close_cart = document.query_selector('.close');

let cart = [];

// ---------------------------------------------------------------------
// 6.2: ESTRUTURA SWITCH
// Abrir/Fechar Carrinho usando SWITCH para demonstração
function toggle_cart(action) {
    switch (action) {
        case 'open':
            body.classList.add('show_cart');
            break;
        case 'close':
            body.classList.remove('show_cart');
            break;
        default:
            body.classList.toggle('show_cart');
    }
}

icon_cart.add_event_listener('click', () => {
    toggle_cart('toggle');
});

close_cart.add_event_listener('click', () => {
    toggle_cart('close');
});
// ---------------------------------------------------------------------

// ADICIONAR AO CARRINHO (BOTÕES ESTÁTICOS dos cards)
document.add_event_listener("click", (event) => {
    if (event.target.classList.contains("add_cart")) {
        let card = event.target.closest(".product");
        let id_product = card.dataset.id;
        add_to_cart(id_product);
        toggle_cart('open'); // Abre o carrinho
    }
});

function add_to_cart(product_id) {
    let pos = cart.find_index(item => item.product_id == product_id);

    if (pos < 0) {
        cart.push({ product_id, quantity: 1 });
    } else {
        cart[pos].quantity++;
    }

    save_cart();
    render_cart();
}

// Salvar (9.1)
function save_cart() {
    local_storage.set_item("cart", JSON.stringify(cart));
}

// 5.1: EXEMPLO DE LAÇO FOR
// Função para calcular o total usando FOR tradicional
function calculate_total_for() {
    let total = 0;
    
    // O laço FOR tradicional é útil para iterar arrays e calcular somas
    for (let i = 0; i < cart_length; i++) {
        let item = cart[i];
        let product = products.find(p => p.id == item.product_id);
        if (product) {
             total += product.price * item.quantity;
        }
    }
    return total;
}

// Mostrar carrinho no Index
function render_cart() {
    list_cart_HTML.innerHTML = "";
    let total_qty = 0;

    cart.for_each(item => {
        let product = products.find(p => p.id == item.product_id);
        total_qty += item.quantity;

        let div = document.create_element("div");
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

        list_cart_HTML.appendChild(div);
    });

    icon_cart_span.innerText = total_qty;
    
    // Atualiza o total usando a função com FOR
    const total_price_element = document.query_selector('.total-price-cart');
    if (total_price_element) {
        total_price_element.innerText = `R$${calculate_total_for().toFixed(2)}`;
    }
}

// Botões + -
list_cart_HTML.add_event_listener("click", (event) => {
    let element = event.target;
    let id = element.dataset.id; 

    if (element.classList.contains("minus") || element.classList.contains("plus")) {
        // 6.3: USO DO OPERADOR TERNÁRIO
        update_quantity(id, element.classList.contains("plus") ? "plus" : "minus");
    }
});

// 3.6: OPERADOR LÓGICO (&&)
function update_quantity(id, type) {
    let pos = cart.find_index(p => p.product_id == id);

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

    save_cart();
    render_cart();
}

// 5.3: EXEMPLO DE LAÇO WHILE
// Função de utilidade que demonstra o uso de WHILE
function check_stock(product_id) {
    let stock = 10; // Exemplo: estoque inicial
    let check = 0;
    
    // O laço WHILE é ideal para loops de condição incerta
    while (check < stock) {
        if (check === 5) {
            console.log(`Estoque do produto ${product_id} está na metade (${check}).`);
        }
        check++;
    }
    // console.log(`Verificação de estoque para o produto ${product_id} concluída.`);
    return stock;
}

// Inicializar carrinho salvo
if (local_storage.get_item("cart")) {
    cart = JSON.parse(local_storage.get_item("cart"));
    render_cart();
}


// ---------------------------------------------------------------------
// ------------------- MOSTRAR PEDIDO NA PÁGINA index2 --------------------
// ---------------------------------------------------------------------

if (window.location.pathname.includes("Index2.html")) {
    let pedido_div = document.get_element_by_id("resumo-pedido");
    let cart = JSON.parse(local_storage.get_item("cart")) || [];

    let total_pedido = calculate_total_for(); 

    if (cart.length === 0) {
        pedido_div.innerHTML = `<h2>Nenhum item no carrinho.</h2>`;
    } else {
        let html = `<h3 class="total-price-cart">Total do Pedido: R$${total_pedido.to_fixed(2)}</h3>`;

        cart.for_each(item => {
            let product = products.find(p => p.id == item.product_id);

            html += `
                <div class="pedido-item">
                    <img src="${product.image}" width="70">
                    <div class="info">
                        <p class="produto-nome"><strong>${product.name}</strong></p>
                        <p>Quantidade: ${item.quantity}</p>
                        <p>Preço unitário: R$${product.price.to_fixed(2)}</p>
                        <strong>Subtotal: R$${(product.price * item.quantity).to_fixed(2)}</strong>
                    </div>
                </div>
            `;
            // Exemplo de uso da função WHILE
            check_stock(product.id); 
        });

        pedido_div.innerHTML = html;
    }
}