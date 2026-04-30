# 1. Agrega todos los cambios realizados
git add .

# 2. Crea un commit con una descripción clara
git commit -m "Limpieza total: Eliminación de módulos de vehículos/repuestos y corrección de build en Netlify"

# 3. Sube los cambios a tu rama principal
git push origin main
# ZB Propiedades - Plataforma Inmobiliaria

Este proyecto es una aplicación de bienes raíces moderna construida con **Next.js 15**, **Firebase** y **Tailwind CSS**.

## 🚀 Despliegue (Vercel / Netlify)

Para desplegar este proyecto, sigue estos pasos:

1. Sube el código a tu repositorio de GitHub.
2. Conecta tu repositorio en el panel de control de Vercel o Netlify.
3. Configura las siguientes **Variables de Entorno** en la sección de configuración de tu plataforma de despliegue:

### Variables Requeridas

#### Firebase (Públicas - Necesitan prefijo NEXT_PUBLIC)
- `NEXT_PUBLIC_FIREBASE_API_KEY`: Tu API Key de Firebase.
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: zb-propiedades-33291448-88816.firebaseapp.com
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: zb-propiedades-33291448-88816
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: zb-propiedades-33291448-88816.firebasestorage.app
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: 177199407222
- `NEXT_PUBLIC_FIREBASE_APP_ID`: 1:177199407222:web:b9ad5646a3415351fa7f57

#### Seguridad y Notificaciones (Privadas)
- `GAS_WEBAPP_URL`: La URL de tu Google Apps Script (https://script.google.com/macros/s/.../exec).

## 🛠️ Tecnologías
- **Framework:** Next.js 15 (App Router)
- **Base de Datos & Auth:** Firebase Firestore / Authentication
- **Estilos:** Tailwind CSS + Shadcn UI
- **Carga de Imágenes:** Cloudinary
- **Notificaciones:** Google Apps Script Bridge

## 📋 Funcionalidades
- Catálogo dinámico de propiedades, lotes y alquileres.
- Panel administrativo con gestión de inventario.
- Registro automático de ventas con desglose de comisiones.
- Sistema de notificaciones por correo para auditoría.
- Diseño responsivo optimizado para móviles.
