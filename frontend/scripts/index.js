//Login elements
const login = document.querySelector(".login")
const loginForm = login.querySelector(".login_form")
const loginInput = loginForm.querySelector(".login_input")
//Chat elements 
const chat = document.querySelector(".chat")
const chatForm = chat.querySelector(".chat_form")
const chat_input = chat.querySelector(".chat_input")
const chat_messages = document.querySelector(".chat_messages")

const colors = [
    "#8BE9FD",
    "#50FA7B",
    "#FFB86C",
    "#BD93F9",
    "#FF5555",
    "#F1FA8C"
]

const user = {id: "", name: "", color: ""};

let websocket

const createMessage = (content, sender, senderColor) => {
    const div = document.createElement("div")
    const span = document.createElement("span")

    span.classList.add("message_sender")
    div.classList.add("message_other")
    span.style.color = senderColor

    div.appendChild(span)

    span.innerHTML = sender
    div.innerHTML += content

    return div
}

const createMyMessage = (content) => {
    const div = document.createElement("div")

    div.classList.add("message_self")

    div.innerHTML += content

    return div
}

const getRandomColors = () => {
    const randonIdex = Math.floor(Math.random() * colors.length)
    return colors[randonIdex]
}

const processMessage = ({ data }) => {
    const { userId, userName, userColor, content  } = JSON.parse(data)


    const message = userId == user.id ? createMyMessage(content) : createMessage(content, userName, userColor)

    chat_messages.appendChild(message)

    scrollScreen()


}

const handleLogin = (e) => {
    e.preventDefault()
    user.name = loginInput.value
    user.id = crypto.randomUUID()
    user.color = getRandomColors()
    login.style.display = "none"
    chat.style.display = "flex"
    chat_messages.style.display = "block"

    websocket = new WebSocket("wss://chat-drakula.onrender.com")
    websocket.onmessage = processMessage
}

const sendMessage = (e) => {
    e.preventDefault()

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chat_input.value
    }

    websocket.send(JSON.stringify(message))

    chat_input.value = ""

}

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}

loginForm.addEventListener("submit", handleLogin)
chatForm.addEventListener("submit", sendMessage)