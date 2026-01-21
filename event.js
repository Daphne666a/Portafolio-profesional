document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById("contactForm");
  
  if (!contactForm) {
    console.error("Formulario de contacto no encontrado");
    return;
  }

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      nombre: e.target.nombre.value,
      email: e.target.email.value,
      mensaje: e.target.mensaje.value
    };

    try {
      // Usa la URL de producción en Vercel o localhost en desarrollo
      const apiUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:3000/api/contact'
        : '/api/contact';
      
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        alert("Mensaje enviado ✨");
        e.target.reset();
      } else {
        alert("Error al enviar");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor");
    }
  });
});
