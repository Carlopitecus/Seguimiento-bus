// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBZzyezldPHnoOc1c2R8_1ThaahGa5kWOg",
    authDomain: "crud1-ba366.firebaseapp.com",
    projectId: "crud1-ba366",
    storageBucket: "crud1-ba366.appspot.com",
    messagingSenderId: "85031699056",
    appId: "1:85031699056:web:cf0f41e2fbd7f17866eab5"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
const elementRef = firebase.database().ref('elementos')
const elementosTabla = document.getElementById('elementos-tabla')
const registerForm = document.getElementById("Register_Form")

// js del modal sacado de Bootstrap
let uid = ""
const myModal = document.getElementById('modalRegistro')
const myInput = document.getElementById('modalRegistro')
myModal.addEventListener('shown.bs.modal', function () {
    myInput.focus()
})

const myModal2 = document.getElementById('modalEdicion')
const myInput2 = document.getElementById('modalEdicion')
myModal2.addEventListener('shown.bs.modal', function () {
    myInput2.focus()
})

// Se identifica al elemento por su Uid y se elimina
const deleteElemento = (uid) => {
    firebase.database().ref(`elementos/${uid}`).remove()
}

// Esto hace que no se puedan elegir fechas anteriores a la actual
let date = new Date();
let output = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' +   String(date.getDate()).padStart(2, '0');
const stringFecha = String(output)
const fecha123 = document.getElementById("InputFecha");
fecha123.setAttribute("min", stringFecha);



// Despliegue de los datos que estan en firebase
window.addEventListener('DOMContentLoaded', async (e) => {
    await elementRef.on('value', (elementos) => {
        elementosTabla.innerHTML = ''
        elementos.forEach(elemento => {
            const elementoData = elemento.val()
            elementosTabla.innerHTML += `
        <tr>
        <td>${elementoData.Vehiculo}</td>
        <td>${elementoData.Destino}</td>
        <td>${elementoData.Fecha}</td>
        <td>${elementoData.Salida}</td>
        <td>${elementoData.Llegada}</td>
        <td>${elementoData.Descripcion}</td>
        <td>
          <button type="button" class="btn btn-warning" data-id="${elementoData.Uid}" data-bs-toggle="modal" data-bs-target="#modalEdicion" >Editar</button>
          <button type="button" class="btn btn-danger" data-id="${elementoData.Uid}" >Eliminar</button>
        </td>
      </tr>
      `

            // Edicion de los elementos
            const updateButtons = document.querySelectorAll('.btn-warning')
            updateButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    firebase.database().ref(`elementos/${e.target.dataset.id}`).once('value').then((elemento) => {
                        const data = elemento.val()


                        // muestra el formulario con los datos del elemento elegido
                        update_Form['updateInputVehiculo'].value = data.Vehiculo
                        update_Form['updateInputDestino'].value = data.Destino
                        update_Form['updateInputFecha'].value = data.Fecha
                        update_Form['updateInputSalida'].value = data.Salida
                        update_Form['updateInputLlegada'].value = data.Llegada
                        update_Form['updateInputDescripcion'].value = data.Descripcion
                    })
                    uid = e.target.dataset.id
                })
                update_Form.addEventListener('submit', (e) => {
                    e.preventDefault()

                    // Se captura el contenido de los campos del modal para la edicion
                    const vehiculo = update_Form['updateInputVehiculo'].value
                    const destino = update_Form['updateInputDestino'].value
                    const fecha = update_Form['updateInputFecha'].value
                    const salida = update_Form['updateInputSalida'].value
                    const llegada = update_Form['updateInputLlegada'].value
                    const descripcion = update_Form['updateInputDescripcion'].value
                    firebase.database().ref(`elementos/${uid}`).update({
                        Vehiculo: vehiculo,
                        Destino: destino,
                        Fecha: fecha,
                        Salida: salida,
                        Llegada: llegada,
                        Descripcion: descripcion
                    })
                })
            })

            // Se identifica al boton con la clase danger
            const deleteButtons = document.querySelectorAll('.btn-danger')
            console.log(deleteButtons)



            // por cada boton Danger, al hacer click, busca el id del elemento
            deleteButtons.forEach((button) => {
                button.addEventListener('click', (e) => {
                    console.log(e)
                    deleteElemento(e.target.dataset.id)
                })
            })
            // deleteButtons.forEach((button) => {
            //     button.addEventListener('click', (e) => {
            //         console.log(e.target.dataset.id)
            //         deleteElemento(e.target.dataset.id)

            //     })
            // })
        })
    })
})


// Accion con el boton de registrar
Register_Form.addEventListener('submit', (e) => {
    e.preventDefault()

    // Se captura el contenido de los campos del modal

    const vehiculo = Register_Form['InputVehiculo'].value
    const destino = Register_Form['InputDestino'].value
    const fecha = Register_Form['InputFecha'].value
    const salida = Register_Form['InputSalida'].value
    const llegada = Register_Form['InputLlegada'].value
    const descripcion = Register_Form['InputDescripcion'].value
   
    // Se guarda el contenido de los campos dento de Firebase
    const registerStudent = elementRef.push()
    registerStudent.set({
        Uid: registerStudent.path.pieces_[1],
        Vehiculo: vehiculo,
        Destino: destino,
        Fecha: fecha,
        Salida: salida,
        Llegada: llegada,
        Descripcion: descripcion
    })

    // Borrado de los campos del Formulario del Modal
    document.getElementById('InputVehiculo').value = ''
    document.getElementById('InputDestino').value = ''
    document.getElementById('InputFecha').value = ''
    document.getElementById('InputSalida').value = ''
    document.getElementById('InputLlegada').value = ''
    document.getElementById('InputDescripcion').value = ''

})