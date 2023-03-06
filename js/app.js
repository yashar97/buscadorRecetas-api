//variables
const resultado = document.querySelector('#resultado');
const selectCategorias = document.querySelector('#categorias');
const modal = new bootstrap.Modal('#modal', {});
const toast = new bootstrap.Toast('#toast');

//eventos
selectCategorias.addEventListener('change', obtenerRecetas);

//funciones
window.onload = () => {
    fetchCategorias();
}

//hacemos una peticion fetch para obtener toda las categorias
function fetchCategorias() {
    fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
        .then(respuesta => respuesta.json())
        .then(resultado => llenarSelectCategorias(resultado.categories))
}

//funcion que llena el select con todas las categorias obtenidas con el fetch
function llenarSelectCategorias(categorias) {
    categorias.forEach(categoria => {
        const { strCategory } = categoria;
        const option = document.createElement('option');
        option.value = strCategory;
        option.textContent = strCategory;
        selectCategorias.appendChild(option);
    });
}

//funcion que obtiene que se trae todas las recetas en base a lo seleccionado en el select
function obtenerRecetas(e) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${e.target.value}`)
        .then(respuesta => respuesta.json())
        .then(resultado => mostrarRecetasHTML(resultado.meals))
}

//funcion que muestra las recetas obtenidas en el html
function mostrarRecetasHTML(recetas) {

    limpiarHTML();

    const heading = document.createElement('h3');
    heading.classList.add('text-center');
    heading.textContent = `Resultado...(${recetas.length})`;
    resultado.appendChild(heading);

    recetas.forEach(receta => {
        const { idMeal, strMeal, strMealThumb } = receta;

        //scripting 
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card', 'col-md-4', 'p-2');

        const cardImg = document.createElement('img');
        cardImg.classList.add('card-img-top');
        cardImg.src = strMealThumb;

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = strMeal;

        const cardButton = document.createElement('button');
        cardButton.classList.add('btn', 'btn-danger');
        cardButton.textContent = 'Ver Receta';
        //evento click al boton
        cardButton.onclick = () => {
            //mostramos la receta en el modal
            fetchVerReceta(idMeal);
        }

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardButton);

        cardDiv.appendChild(cardImg);
        cardDiv.appendChild(cardBody);

        resultado.appendChild(cardDiv);

    });
}

//funcion que hace un fetch con el id y obtiene todos los datos de la receta
function fetchVerReceta(id) {
    fetch(`https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(respuesta => respuesta.json())
        .then(resultado => abrirModalYMostrarReceta(resultado.meals[0]))
}

//funcion que muestra la receta en el modal
function abrirModalYMostrarReceta(receta) {



    //seleccionamos el modal del html
    const modalBody = document.querySelector('#modal .modal-body');
    const ingredientesYCantidades = document.createElement('ul');
    //destructuring
    const { idMeal, strCategory, strMeal, strInstructions, strMealThumb } = receta;

    for (let i = 1; i <= 20; i++) {
        if (receta[`strIngredient${i}`]) {
            const ingrediente = receta[`strIngredient${i}`];
            const cantidad = receta[`strMeasure${i}`];
            const li = document.createElement('li');
            li.innerHTML = `${ingrediente} - ${cantidad}`;
            ingredientesYCantidades.appendChild(li);
        }
    }

    modalBody.innerHTML = `
        <img class="card-img-top" src="${strMealThumb}"/>
        <h3>${strMeal}</h3>
        <p>${strInstructions}</p>`;

    modalBody.appendChild(ingredientesYCantidades);

    //agregamos el boton de favoritos y de cerrar el modal
    const btnFavorito = document.createElement('button');
    btnFavorito.classList.add('btn', 'btn-danger');
    btnFavorito.textContent = existeStorage(idMeal) ? 'Eliminar Favorito' : 'Agregar Favorito';
    btnFavorito.onclick = () => {

        const recetaFavorita = {
            id: idMeal,
            titulo: strMeal,
            img: strMealThumb,
        }

        if (existeStorage(idMeal)) {
            eliminarFavorito(idMeal);
            mostrarToast(`Receta ${strMeal} eliminada de favoritos`);

            btnFavorito.textContent = 'Agregar Favorito';
            return;
        }
        mostrarToast(`Receta ${strMeal} agregada a favoritos`);
        agregarFavoritos(recetaFavorita);
        btnFavorito.textContent = 'Eliminar Favorito';
    }

    const btnCerrar = document.createElement('button');
    btnCerrar.classList.add('btn', 'btn-secondary');
    btnCerrar.textContent = 'Cerrar';
    btnCerrar.onclick = () => {
        modal.hide();
    }

    modalBody.appendChild(btnFavorito);
    modalBody.appendChild(btnCerrar);


    //abrir modal
    modal.show();
}

//funcion que muestra un toast
function mostrarToast(mensaje) {

    //seleccionamos el toast en el html
    const toastBody = document.querySelector('#toast .toast-body');

    toastBody.innerHTML = `<p>${mensaje}</p>`;

    //mostrar toast
    toast.show();
}

//funcion agregar favoritos al storage
function agregarFavoritos(receta) {
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

    localStorage.setItem('favoritos', JSON.stringify([...favoritos, receta]));

}

//funcion que verifica si ya existe una receta en el stroge
function existeStorage(id) {
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

    return favoritos.some(element => element.id === id);

}

//funcion que elimina una receta del storage
function eliminarFavorito(id) {
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

    const nuevosFavoritos = favoritos.filter(element => element.id !== id);

    localStorage.setItem('favoritos', JSON.stringify(nuevosFavoritos));
}

//funcion que limpia el html
function limpiarHTML() {

    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}