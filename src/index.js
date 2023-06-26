window.addEventListener('DOMContentLoaded', e => {
   fetch('http://localhost:3000/quotes?_embed=likes')
   .then(response => response.json())
   .then(data => data.forEach(e => createCards(e)))

   document.getElementById('new-quote-form').addEventListener('submit', e => newQuote(e))
   
})

function createCards(data) {
    const card = document.createElement('li')
    const block = document.createElement('blockquote')
    const quote = document.createElement('p')
    const author = document.createElement('footer')
    const spacer = document.createElement('br')
    const likeButton = document.createElement('button')
    const deleteButton = document.createElement('button')

    card.classList.add('quote-card')
    block.classList.add('blockquote')
    quote.classList.add('mb-0')
    author.classList.add('blockquote-footer')
    likeButton.id = data.id
    likeButton.classList.add('btn-success')
    deleteButton.classList.add('btn-danger')

    quote.textContent = data.quote
    author.textContent = data.author
    likeButton.innerHTML = 'Likes: <span>0</span>'
    deleteButton.textContent = 'Delete'

    likeButton.addEventListener('click', handleLike)
    deleteButton.addEventListener('click', handleDelete)

    block.append(quote, author, spacer, likeButton, deleteButton)
    card.append(block)
    document.getElementById('quote-list').append(card)

}

function newQuote(e) {
    e.preventDefault()
    const newQuote = document.getElementById('new-quote').value
    const newAuthor = document.getElementById('author').value
    const quoteObj = {
        quote: newQuote,
        author: newAuthor
    }

    fetch('http://localhost:3000/quotes',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body:JSON.stringify(quoteObj)
    })
    .then(response => response.json())
    .then(data => createCards(data))
    .catch(data => alert(`Didn't Post!`))
}

function handleLike(e) {
    const quoteId = parseInt(e.target.id)
    const likes = parseInt(e.target.childNodes[1].textContent)
    const newLikes = likes + 1
    const postObj = {
        'quoteId': quoteId
    }

    fetch('http://localhost:3000/likes',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(postObj)
    })
    .then(e.target.childNodes[1].textContent = newLikes)
}

function handleDelete(e) {
    const quoteId = e.target.previousSibling.id

    fetch(`http://localhost:3000/quotes/${quoteId}`,{
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        e.target.parentNode.parentNode.remove()
    })
    .catch(data => alert('Not deleted!'))
    
}

