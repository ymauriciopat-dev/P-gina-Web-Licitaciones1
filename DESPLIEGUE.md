# Cómo publicar el Portafolio (URL compartible)

Este proyecto YA está armado. No necesitas `npm create vite`. Solo sigue esto.

## Requisito
Tener **Node.js** instalado (descárgalo en https://nodejs.org — versión LTS).

## Pasos en la terminal (cmd / PowerShell / bash)

```bash
# 1. Entra a la carpeta del proyecto (donde está package.json)
cd portafolio

# 2. Instala las dependencias
npm install

# 3. (Opcional) Pruébalo en tu computador antes de publicar
npm run dev
#    Abre el http://localhost:5173 que aparece. Ctrl+C para salir.

# 4. Publica en Vercel
npm install -g vercel
vercel            # primera vez: te pide iniciar sesión (correo/GitHub) y confirmar
vercel --prod     # publica en producción
```

Al terminar, `vercel --prod` imprime el **URL compartible**, por ejemplo:
`https://portafolio-estrategico.vercel.app`

Ese es el enlace que envías a clientes, entidades y aliados.

## Dominio propio (opcional)
En el panel de Vercel → tu proyecto → Settings → Domains → "Add", y conectas
un dominio como `portafolio-rodriguez.com`.

## Nota sobre la pestaña "Oportunidades" (SECOP II en vivo)
Una vez publicado, la pestaña Oportunidades consulta SECOP II en tiempo real
desde el navegador. Si en algún momento prefieres el modo backend (extractor
por cmd que genera opportunities.json), usa el archivo `extractor_secop.py`
que viene aparte y avísame para conectarlo.
