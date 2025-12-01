const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");


const Message = require("./models/Message");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const caseRoutes = require("./routes/caseRoutes");
const profileRoutes = require("./routes/profileRoutes");
const messageRoutes = require("./routes/messageRoutes"); 
const appointmentRoutes = require("./routes/appointmentRoutes");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());


io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User ${socket.id} joined room: ${data}`);
  });


  socket.on("send_message", async (data) => {
    try {

      const newMessage = new Message({
        room: data.room,
        message: data.message,
        sender: data.userId, 
      });
      await newMessage.save();

     
      const messageToSend = await Message.findById(newMessage._id).populate(
        "sender",
        "name username"
      );


      socket.to(data.room).emit("receive_message", messageToSend);
    } catch (err) {
      console.error("Socket.IO save message error:", err);
    }
  });


  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/messages", messageRoutes); 
app.use("/api/appointments", appointmentRoutes);

app.get("/", (req, res) => {
  res.send("LegalEase API is running...");
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
