const urlBase='https://jsonplaceholder.typicode.com/posts' //URL de la API
let posts = [] //Arreglo para almacenar los posts

function getData() {
    fetch(urlBase)
        .then(response => response.json())
        .then(data => {
            posts = data
            renderPostList() //Llamar a la función para mostrar los posts
        })
        .catch(error => console.error('Error al llamar a la API:', error))
}

getData()

function renderPostList() {
    const postList = document.getElementById('postList')
    postList.innerHTML = ''
    posts.forEach(post => {
        const listItem = document.createElement('li')
        listItem.classList.add('postItem')
        listItem.innerHTML = `
        <strong>${post.title}</strong>
        <p>${post.body}</p>
        <button onclick="editPost(${post.id})">Editar</button>
        <button onclick="deletePost(${post.id})">Borrar</button>
        
        <div id="editForm-${post.id}" class="editForm" style="display:none;">
            <label for="editTitle">Título: </label>
            <input type="text" id="editTitle-${post.id}" value="${post.title}" required>
            <label for="editBody">Comentario: </label>
            <textarea id="editBody-${post.id}" required>${post.body}</textarea>
            <button onclick="updatePost(${post.id})">Actualizar</button>
        </div>
        `
        postList.appendChild(listItem)
    })
}

function postData() {
    const postTitleInput = document.getElementById('postTitle');
    const postBodyInput = document.getElementById('postBody');
    const postTitle = postTitleInput.value;
    const postBody = postBodyInput.value;

    if(postTitle.trim() == '' || postBody.trim() == '') {
        alert('Los campos son obligatorios');
        return;
    }

    fetch(urlBase, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
            title: postTitle,
            body: postBody,
            userId: 1
        })
    })
    .then(response => response.json())
    .then(data => {
        posts.unshift(data)
        renderPostList()
        postTitleInput.value = ''
        postBodyInput.value = ''
    })
    .catch(error => console.error('Error al querer crear el post', error))
}

function editPost(id) {
    const editForm = document.getElementById(`editForm-${id}`)
    editForm.style.display = (editForm.style.display == 'none') ? 'block' : 'none'
}

function updatePost(id) {
    const editTitle = document.getElementById(`editTitle-${id}`).value
    const editBody = document.getElementById(`editBody-${id}`).value

    fetch(`${urlBase}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
            id: id,
            title: editTitle,
            body: editBody,
            userId: 1
        })
    })
    .then(response => response.json())
    .then(data => {
        const index = posts.findIndex(post => post.id === data.id)
        if(index != -1) {
            posts[index] = data
        } else {
            alert('Error al querer actualizar el post')
        }
        renderPostList()
    })
    .catch(error => console.error('Error al querer actualizar el post', error))
}

function deletePost(id) {
    fetch(`${urlBase}/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if(response.ok) {
            posts = posts.filter(post => post.id != id)
            renderPostList()
        } else {
            alert('Error al querer borrar el post')
        }
    })
    .catch(error => console.error('Error al querer borrar el post', error))
}
