(function () {

    const resultado = document.querySelector('#resultado');

window.onload = () => {


    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

    cargarRecetas(favoritos);
}

function cargarRecetas(recetas) {

    resultado.innerHTML = "";

    recetas.forEach(element => {
        const {id, img, titulo} = element;

        const boton = document.createElement('button');
            boton.classList.add('btn', 'btn-danger');
            boton.textContent = 'Eliminar';
            boton.onclick = () => {
                eliminar(id);

                Swal.fire(
                    'Eliminado Correctamente',
                    '',
                    'success'
                  )
            }

        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card', 'col-md-4')
        cardDiv.innerHTML += `
            <img src="${img}" class="card-img-top"/>
            <h3 class="card-title">${titulo}</h3>
        `;

        cardDiv.appendChild(boton);
        resultado.appendChild(cardDiv);
        
    });
}

function eliminar(id) {
    const favoritos = JSON.parse(localStorage.getItem('favoritos'));
    
    const nuevosFavoritos = favoritos.filter(element => element.id !== id);

    localStorage.setItem('favoritos', JSON.stringify(nuevosFavoritos));

    cargarRecetas(nuevosFavoritos);
}








})();