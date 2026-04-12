# Quiz JCyL — Técnico Superior de Informática

Web estática tipo **quiz/flashcard** para practicar los exámenes de oposición de la Junta de Castilla y León. Sin dependencias externas, funciona en cualquier servidor estático.

---

## 🚀 Arrancar en local

Necesitas un servidor HTTP local (los módulos ES no funcionan abriendo el HTML directamente con `file://`).

### Opción 1 — Python (sin instalar nada extra)
```bash
cd /ruta/a/test-jcyl
python3 -m http.server 8080
# Abre → http://localhost:8080
```

### Opción 2 — Node.js `serve`
```bash
npx serve .
```

### Opción 3 — VS Code / Cursor / JetBrains
Usa el plugin **Live Server** o el servidor de desarrollo integrado de tu IDE.

---

## 📁 Estructura del proyecto

```
test-jcyl/
├── index.html                 ← SPA principal
├── README.md
├── tests/
│   ├── index.json             ← Manifiesto de tests disponibles
│   └── test-2024.json         ← Examen JCyL octubre 2024
└── assets/
    ├── css/
    │   └── styles.css
    └── js/
        ├── app.js             ← Punto de entrada, navegación entre pantallas
        ├── manifest.js        ← Carga del manifiesto y banner de sesión en curso
        ├── quiz.js            ← Motor del quiz, aleatoriedad, persistencia
        └── stats.js           ← Pantalla de estadísticas históricas
```

---

## ➕ Añadir un nuevo test

1. Coloca el fichero `.json` en la carpeta `tests/`. Debe tener esta estructura:

```json
{
  "examen": "Nombre del examen",
  "ejercicio": "Primer Ejercicio",
  "fecha": "dd de mes de yyyy",
  "preguntas": [
    {
      "numero": 1,
      "tema": "Bloque - Tema N: Nombre del tema",
      "enunciado": "Texto de la pregunta...",
      "opciones": {
        "a": "Opción A",
        "b": "Opción B",
        "c": "Opción C",
        "d": "Opción D"
      },
      "respuesta_correcta": "b",
      "explicación": "Justificación de la respuesta correcta."
    }
  ]
}
```

2. Registra el nuevo test en `tests/index.json`:

```json
[
  {
    "id": "test-2024",
    "nombre": "Técnico Superior de Informática — JCyL",
    "ejercicio": "Primer Ejercicio",
    "fecha": "26 de octubre de 2024",
    "fichero": "tests/test-2024.json"
  },
  {
    "id": "test-2025",
    "nombre": "Técnico Superior de Informática — JCyL",
    "ejercicio": "Primer Ejercicio",
    "fecha": "15 de mayo de 2025",
    "fichero": "tests/test-2025.json"
  }
]
```

¡Listo! El selector de la página de inicio lo mostrará automáticamente.

---

## ✨ Características

| Característica | Descripción |
|---|---|
| **Aleatoriedad total** | Las preguntas y sus opciones se barajan con Fisher-Yates en cada sesión |
| **Filtro por temas** | Practica solo los bloques temáticos que te interesen |
| **Retroalimentación inmediata** | Al responder se resalta la opción correcta/incorrecta y aparece la explicación |
| **Sesión en curso** | Si recargas la página, puedes retomar el test donde lo dejaste |
| **Historial de estadísticas** | KPIs globales + desglose de todas las sesiones anteriores por test |
| **Modo oscuro** | Se activa automáticamente según la preferencia del sistema |
| **Sin dependencias** | HTML + CSS + JavaScript puro. Funciona en cualquier servidor estático |

---

## 🐳 Despliegue con Docker (VPS)

### Construir y ejecutar localmente

```bash
# Construir la imagen
docker build -t quiz-jcyl:latest .

# Arrancar el contenedor (puerto 80 del host)
docker run -d --name quiz-jcyl -p 80:80 --restart unless-stopped quiz-jcyl:latest

# Ver logs
docker logs -f quiz-jcyl
```

### Publicar en un registry y desplegar en el VPS

```bash
# 1. Etiquetar y subir al registry (sustituye 'usuario' por tu usuario de Docker Hub / ghcr.io)
docker build -t usuario/quiz-jcyl:latest .
docker push usuario/quiz-jcyl:latest

# 2. En el VPS
ssh usuario@ip-del-vps
docker pull usuario/quiz-jcyl:latest
docker stop quiz-jcyl && docker rm quiz-jcyl   # si ya existía
docker run -d --name quiz-jcyl -p 80:80 --restart unless-stopped usuario/quiz-jcyl:latest
```

### Con dominio + HTTPS (Nginx Proxy Manager o Caddy en el VPS)

Si usas un proxy inverso delante (recomendado), expón el contenedor solo en localhost:

```bash
docker run -d --name quiz-jcyl -p 127.0.0.1:8080:80 --restart unless-stopped quiz-jcyl:latest
```

Luego configura el proxy para que reenvíe `https://tudominio.com` → `http://127.0.0.1:8080`.

---

## 🌐 Despliegue en producción

Al ser una web estática basta con copiar todos los ficheros a cualquier hosting:

- **GitHub Pages**: sube el repositorio y activa Pages desde `Settings → Pages`.
- **Netlify / Vercel**: arrastra la carpeta o conecta el repositorio. Build command: *(vacío)*, publish directory: `.`
- **Servidor propio**: copia los ficheros en la raíz del `DocumentRoot` de Apache/Nginx.

