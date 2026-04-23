# miCapital 📊

Dashboard personal de inversiones con radar de acciones impulsado por IA.

## 🚀 Cómo subir a Vercel (5 pasos)

### Opción A — Sin terminal (recomendado)

1. Ve a **[vercel.com](https://vercel.com)** y crea una cuenta gratis
2. Ve a **[github.com](https://github.com)** y crea una cuenta gratis
3. Crea un repositorio nuevo en GitHub llamado `micapital`
4. Sube todos estos archivos al repositorio
5. En Vercel → "Add New Project" → conecta tu GitHub → selecciona `micapital` → Deploy

¡Listo! Vercel te da un link tipo `micapital.vercel.app`

---

### Opción B — Con terminal (si tienes Node instalado)

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Entrar a la carpeta del proyecto
cd micapital

# 3. Instalar dependencias
npm install

# 4. Desplegar
vercel

# Para actualizaciones futuras:
vercel --prod
```

---

## 📱 Instalar en el celular como app

**iPhone (Safari):**
1. Abre el link de tu app en Safari
2. Toca el botón compartir (cuadrado con flecha)
3. "Añadir a pantalla de inicio"
4. ¡Aparece como app nativa!

**Android (Chrome):**
1. Abre el link en Chrome
2. Menú (tres puntos) → "Añadir a pantalla de inicio"

---

## 🛠️ Cómo actualizar la app

1. Modifica los archivos (o pídele a Claude que lo haga)
2. Sube los cambios a GitHub
3. Vercel se actualiza automáticamente en segundos

---

## 📁 Estructura del proyecto

```
micapital/
├── public/
│   ├── index.html      ← HTML base + meta PWA
│   └── manifest.json   ← Config para instalar como app
├── src/
│   ├── index.js        ← Entrada React
│   └── App.jsx         ← Todo el dashboard (edita aquí)
├── package.json        ← Dependencias
└── vercel.json         ← Config Vercel
```

## ✏️ Modificar saldos

En `src/App.jsx`, busca `DEFAULT_PLATFORMS` al inicio del archivo y edita los valores de `amount` y `returnPct` de cada plataforma.
