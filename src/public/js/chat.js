let socket = io()
let user = ""
let chatBox = document.getElementById("chatbox")
let getUser = fetch('https://proyectofinal-production-a15f.up.railway.app//api/users/current'). //OBTENEMOS EL USER MEDIANTE UN FETCH AL CURRENT , QUE LEE LA COOKIE Y NOS DEVUELVE LA INFO DEL USER
                then(data=>data.json()).
                then(response=>{
                    user = response.email
                    document.getElementById('username').innerHTML = user
                    socket.emit('session',user)
                })
/* let token = document.cookie.split('; ')[1].slice(5) */ //TAMBIEN PODRIAMOS OBTENER EL TOKEN DE LA COOKIE DE ESTA AMNERA Y CONVERTIRLO MEDIANTE libreria https://github.com/auth0/jwt-decode
/*Swal.fire({
    title: 'Authentication',
    input: 'text',
    text: 'Set username for the chat',
    inputValidator: value => {
        return !value.trim() && 'Please. Write a username!'
    },
    allowOutsideClick: false
}).then( result => {
    user = result.value
    document.getElementById('username').innerHTML = user
    socket = io()
})*/

//Enviamos mensajes
chatBox.addEventListener("keyup", event => {
    if(event.key === "Enter"){
        if(chatBox.value.trim().length > 0){
            socket.emit("message", {
                user,
                message: chatBox.value
            })
            chatBox.value = ""
        }
    }
})

//Recibir Men.
socket.on('first',data=>{
    const divLog = document.getElementById('messageLogs')
    let messages = ''
    data.forEach(message => {
        messages += `<p><i>${message.user}</i>: ${message.message}</p>`
    });
    divLog.innerHTML = messages
    divLog.scrollTo({ left: 0, top: divLog.scrollHeight, behavior: "smooth" });
})
socket.on("logs", data => {
    const divLog = document.getElementById("messageLogs")
    let messages = ""
    data.reverse().forEach(message => {
        messages += `<p><i>${message.user}</i>: ${message.message}</p>`
    });
    divLog.innerHTML = messages
    divLog.scrollTo({ left: 0, top: divLog.scrollHeight, behavior: "smooth" });
})