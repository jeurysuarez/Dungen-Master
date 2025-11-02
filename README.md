# D&D - Dungeon Master IA

Esta es una aventura de Dungeons & Dragons para un solo jugador, basada en texto y potenciada por la API de Google Gemini. La IA actúa como Dungeon Master, creando una historia dinámica e interactiva basada en tus acciones.

Este proyecto ha sido estructurado usando Vite + React + TypeScript para facilitar el desarrollo y el despliegue.

## Requisitos Previos

- [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
- [npm](https://www.npmjs.com/) (normalmente se instala con Node.js)

## Configuración del Proyecto

1.  **Clona el repositorio**
    Si has subido este código a GitHub, clónalo en tu máquina local.

2.  **Instala las dependencias**
    Navega a la carpeta raíz del proyecto en tu terminal y ejecuta:
    ```bash
    npm install
    ```

3.  **Configura tu Clave de API de Gemini**
    - Renombra el archivo `.env.local.example` a `.env.local`.
    - Abre el archivo `.env.local` y reemplaza `TU_API_KEY_DE_GEMINI_AQUI` con tu clave de API de Google Gemini.
    ```
    VITE_API_KEY=TU_API_KEY_DE_GEMINI_AQUI
    ```
    > **Importante:** El archivo `.env.local` está incluido en `.gitignore` para asegurar que tu clave de API secreta nunca se suba a GitHub.

## Scripts Disponibles

### `npm run dev`

Ejecuta la aplicación en modo de desarrollo.
Abre [http://localhost:5173](http://localhost:5173) (o el puerto que indique la terminal) para verla en tu navegador.

La página se recargará automáticamente si haces cambios en el código.

### `npm run build`

Compila la aplicación para producción en la carpeta `dist`.
Este comando empaqueta React en modo de producción y optimiza la compilación para obtener el mejor rendimiento.

La carpeta `dist` contiene los archivos estáticos (HTML, CSS, JS) listos para ser desplegados.

## Despliegue en GitHub Pages

1.  **Configura la ruta base (¡Paso Crucial!)**
    - Abre el archivo `vite.config.ts`.
    - Modifica la línea `base: '/dnd-ai-dm/'` para que coincida con el nombre de tu repositorio. Por ejemplo, si la URL de tu repositorio es `https://github.com/tu-usuario/mi-juego-epico`, debes cambiarla a `base: '/mi-juego-epico/'`.
    - Guarda el archivo.

2.  **Sube tu código a un repositorio de GitHub.**
    Asegúrate de haber guardado el cambio en `vite.config.ts` antes de subirlo.

3.  **Configura GitHub Pages:**
    - Ve a la pestaña `Settings` > `Pages` de tu repositorio.
    - En la sección "Build and deployment", bajo "Source", selecciona **GitHub Actions**.
    - GitHub te sugerirá una plantilla de flujo de trabajo para "Vite". Selecciónala y confirma la creación del archivo de flujo de trabajo.

4.  **Realiza un `push`:**
    Cada vez que hagas un `push` a tu rama principal (`main`), una GitHub Action se ejecutará automáticamente. Esta acción:
    - Instalará las dependencias.
    - Ejecutará `npm run build` para compilar tu proyecto.
    - Desplegará el contenido de la carpeta `dist` a tu sitio de GitHub Pages.

Después de unos minutos, tu juego estará disponible en una URL como `https://tu-usuario.github.io/tu-repositorio/`.
