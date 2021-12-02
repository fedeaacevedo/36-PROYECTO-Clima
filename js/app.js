const container = document.querySelector(".container");
const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");

window.addEventListener("load", () => {
  formulario.addEventListener("submit", buscarClima);
});

function buscarClima(e) {
  e.preventDefault();

  //Validar
  const ciudad = document.querySelector("#ciudad").value;
  const pais = document.querySelector("#pais").value;

  if ((ciudad === "") | (pais === "")) {
    //Hubo un error, no pueden quedar campos vacios
    mostrarError("Ambos campos son obligatoios");
    return;
  }
  // console.log(pais);
  // console.log(ciudad);
  //Consulta a la API
  consultarApi(ciudad, pais);
}

function mostrarError(mensaje) {
  const alerta = document.querySelector(".bg-red-100");

  if (!alerta) {
    //Creamos una alerta
    const alerta = document.createElement("div");

    alerta.classList.add(
      "bg-red-100",
      "border-red-400",
      "text-red-700",
      "px-4",
      "py-3",
      "rounded",
      "max-w-md",
      "mx-auto",
      "mt-6",
      "text-center"
    );

    alerta.innerHTML = `
        <strong class="font-bold">Error!</strong>
        <span class="block">${mensaje}</span>
    `;

    container.appendChild(alerta);

    //Eliminar alerta despues de ser visualizada
    setTimeout(() =>{
        alerta.remove()
    }, 5000);
  }
}

function consultarApi(ciudad, pais){

    const appId = '8f547a7ffb6b3d30c8da9b73e9ad80c6'
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}, ${pais}&appid=${appId}`;

    fetch(url)
    .then(respuesta => respuesta.json())
    .then(datos => {
        console.log(datos);
        limpiarHTML(); // Limpiar HTML previo
        if(datos.cod === '404'){
            mostrarError('Ciudad no encontrada')
            return;
        }

        //Mostrar datos en el HTML
        mostrarClima(datos);
    });
}

function mostrarClima(datos){
    const { name, main: { temp, temp_max, temp_min } } = datos;
    
    const centigrados = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);

    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `Clima en: ${name}`;
    nombreCiudad.classList.add('font-bold', 'text-2xl');

    const actual = document.createElement('p');
    actual.innerHTML = `${centigrados} &#8451;`;
    actual.classList.add('font-bold', 'text-6xl');

    const tempMax = document.createElement('p');
    tempMax.innerHTML = `Max: ${ max} &#8451;`;
    tempMax.classList.add('text-xl')

    const tempMin = document.createElement('p');
    tempMin.innerHTML = `Min: ${min} &#8451;`;
    tempMin.classList.add('text-xl')


    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMax);
    resultadoDiv.appendChild(tempMin);
    resultadoDiv.appendChild(nombreCiudad);

    resultado.appendChild(resultadoDiv);
}

const kelvinACentigrados = grados => parseInt(grados - 273.15);


function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}