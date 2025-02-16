const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static("public"));

let videoState = {
    isPlaying: false,
    currentTime: 0
};

io.on("connection", (socket) => {
    console.log("Nuevo usuario conectado");

    // Enviar estado actual del video al nuevo usuario
    socket.emit("syncVideo", videoState);

    socket.on("play", (time) => {
        videoState.isPlaying = true;
        videoState.currentTime = time;
        io.emit("play", time);
    });

    socket.on("pause", (time) => {
        videoState.isPlaying = false;
        videoState.currentTime = time;
        io.emit("pause", time);
    });

    socket.on("seek", (time) => {
        videoState.currentTime = time;
        io.emit("seek", time);
    });
});

server.listen(PORT, () => {
    console.log(`Servidor Kimi2Gether corriendo en el puerto ${PORT}`);
});
