import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import "dotenv/config";

const app = express();

app.use(cors());
app.use(express.json());

// Transporter (una sola vez)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

app.post("/api/contact", async (req, res) => {
  const { nombre, email, mensaje } = req.body;

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  try {
    await transporter.sendMail({
      from: `"Portfolio" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_USER,
      replyTo: email,
      subject: "Nuevo mensaje del portfolio",
      text: `
Nombre: ${nombre}
Email: ${email}

Mensaje:
${mensaje}
      `
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error enviando mail:", error);
    res.status(500).json({ error: "No se pudo enviar el mensaje" });
  }
});

app.listen(3000, () => {
  console.log("Servidor activo en http://localhost:3000");
});
