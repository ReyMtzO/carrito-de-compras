const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateShoppingCart = document.getElementById('template-shopping-cart').content
const fragment = document.createDocumentFragment()
let shoppingCart = {}

// Eventos
// El evento DOMContentLoaded es disparado cuando el documento HTML ha sido completamente cargado y parseado
document.addEventListener('DOMContentLoaded', () => { 
    fetchData() 
    if(localStorage.getItem('articles_mock')) {
        shoppingCart = JSON.parse(localStorage.getItem('articles_mock'))
        showCart()
    }
})

cards.addEventListener('click', e => {
     addToCart(e) 
})

items.addEventListener('click', e => {
     btnAddOrReduce(e) 
})

// Traer productos
const fetchData = async () => {
    const res = await fetch('articles_mock.json');
    const data = await res.json()
    // console.log(data)
    showCards(data)
}

// Pintar productos
const showCards = data => {
	data.forEach(product => {
		templateCard.querySelector('h5').textContent = product.title 
		templateCard.querySelector('p').textContent = product.price
		templateCard.querySelector('img').setAttribute("src", product.thumbnailUrl)
		templateCard.querySelector('.btn-dark').dataset.id = product.id

		const clone = templateCard.cloneNode(true)
		fragment.appendChild(clone)
	})
	cards.appendChild(fragment) 
}

// Agregar al carrito
const addToCart = e => {
    if (e.target.classList.contains('btn-dark')) {
        // console.log(e.target.dataset.id)
        // console.log(e.target.parentElement)
        setShoppingCart(e.target.parentElement)
    }
    e.stopPropagation()
}

const setShoppingCart = item => {
    // console.log(item)
    const product = {
        title: item.querySelector('h5').textContent,
        price: item.querySelector('p').textContent,
        id: item.querySelector('button').dataset.id,
        amount: 1
    }
    // console.log(producto)
    if (shoppingCart.hasOwnProperty(product.id)) {
        product.amount = shoppingCart[product.id].amount + 1
    }

    shoppingCart[product.id] = { ...product }
    
    showCart()
}

const showCart = () => {
    items.innerHTML = ''

    Object.values(shoppingCart).forEach(product => {
        templateShoppingCart.querySelector('th').textContent = product.id
        templateShoppingCart.querySelectorAll('td')[0].textContent = product.title
        templateShoppingCart.querySelectorAll('td')[1].textContent = product.amount
        templateShoppingCart.querySelector('span').textContent = product.price * product.amount
        
        //botones
        templateShoppingCart.querySelector('.btn-info').dataset.id = product.id
        templateShoppingCart.querySelector('.btn-danger').dataset.id = product.id

        const clone = templateShoppingCart.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    showFooter()

    localStorage.setItem('articles_mock', JSON.stringify(shoppingCart))
}

const showFooter = () => {
    footer.innerHTML = ''
    if (Object.keys(shoppingCart).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return
    }
    const numberOfItems = Object.values(shoppingCart).reduce((acc, { amount }) => acc + amount, 0)
    const totalPrice = Object.values(shoppingCart).reduce((acc, {amount, price}) => acc + amount * price, 0)
    
    templateFooter.querySelectorAll('td')[0].textContent = numberOfItems
    templateFooter.querySelector('span').textContent = totalPrice

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('empty-cart')
    btnVaciar.addEventListener('click', () => {
        shoppingCart = {}
        showCart()
    })
}

const btnAddOrReduce = e => {
    //console.log(e.target)
    //Acción de aumentar
    if(e.target.classList.contains('btn-info')) {
        //console.log(shoppingCart[e.target.dataset.id])
       // shoppingCart[e.target.dataset.id]
       const product = shoppingCart[e.target.dataset.id]
       product.amount = shoppingCart[e.target.dataset.id].amount + 1 
       // también funciona usar "producto.amount++"
       shoppingCart[e.target.dataset.id] = {...product}
       showCart()
    }

    if(e.target.classList.contains('btn-danger')) {
       const product = shoppingCart[e.target.dataset.id]
       product.amount--
       if (product.amount === 0) {
            delete shoppingCart[e.target.dataset.id]
       }  
       showCart()
    }
    
    e.stopPropagation()
}

