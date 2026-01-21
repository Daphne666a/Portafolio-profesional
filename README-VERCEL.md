# 📧 Configuración del formulario de contacto en Vercel

## Pasos para desplegar en Vercel

### 1. Preparar Gmail para enviar correos

1. Ve a tu cuenta de Google → Configuración de seguridad
2. Activa la verificación en 2 pasos
3. Ve a "Contraseñas de aplicaciones" (https://myaccount.google.com/apppasswords)
4. Genera una contraseña para "Correo" y "Otra aplicación"
5. Guarda esa contraseña de 16 dígitos (algo como: `xxxx xxxx xxxx xxxx`)

### 2. Subir a Vercel

1. Instala Vercel CLI (opcional):
   ```bash
   npm i -g vercel
   ```

2. O ve directamente a https://vercel.com y conecta tu repositorio de GitHub

3. Importa el proyecto desde GitHub

### 3. Configurar variables de entorno en Vercel

En el dashboard de Vercel:
1. Ve a tu proyecto → Settings → Environment Variables
2. Agrega estas variables:

   ```
   MAIL_USER = tu-email@gmail.com
   MAIL_PASS = tu-contraseña-de-aplicación-de-16-digitos
   ```

   ⚠️ **Importante**: `MAIL_PASS` debe ser la contraseña de aplicación de Gmail, NO tu contraseña normal

### 4. Redeploy

Después de agregar las variables de entorno:
1. Ve a Deployments
2. Haz clic en los 3 puntos del último deployment
3. Selecciona "Redeploy"

## Estructura del proyecto para Vercel

```
portafolio/
├── api/
│   └── contact.js      ← Función serverless (backend)
├── index.html          ← Frontend
├── style.css
├── event.js            ← Lógica del formulario
├── main.js
├── vercel.json         ← Configuración de Vercel
└── package.json
```

## Desarrollo local

Para probar localmente con el servidor Express original:

```bash
npm start
```

El formulario detectará automáticamente si está en localhost y usará `http://localhost:3000`

## 🔍 Verificar que funciona

1. Abre tu sitio en Vercel
2. Completa el formulario de contacto
3. Envía un mensaje de prueba
4. Revisa tu correo (el definido en `MAIL_USER`)

## Solución de problemas

- **Error 500**: Verifica que las variables de entorno estén configuradas correctamente en Vercel
- **No llega el correo**: Asegúrate de usar la contraseña de aplicación de Gmail, no tu contraseña normal
- **CORS error**: Ya está configurado en la función serverless
