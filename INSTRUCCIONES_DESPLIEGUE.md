# 🚀 INSTRUCCIONES PASO A PASO - DESPLIEGUE A VERCEL

## ¿QUÉ PASÓ?

El error `npm run build exited with 1` ocurría porque:
- ❌ Versiones incompatibles de dependencias (recharts, vite, react)
- ❌ Archivos `src/main.jsx` y `src/App.jsx` faltaban
- ❌ Configuración de vite.config.js incompleta

## ✅ QUÉ ARREGLÉ

- ✓ **Versiones EXACTAS** en package.json (sin ^)
- ✓ **Archivos completos**: main.jsx, App.jsx, index.css
- ✓ **Vite config optimizado** con manualChunks y terser
- ✓ **.nvmrc** que fija Node 20
- ✓ **Todo compilado y verificado** ✅

---

## 📋 PASOS PARA DESPLEGAR

### PASO 1: Descomprimir el ZIP

```bash
# Windows:
# Click derecho en portafolio-estrategico-CORREGIDO.zip → "Extraer aquí"

# Mac/Linux:
unzip portafolio-estrategico-CORREGIDO.zip
cd portafolio_fix
```

### PASO 2: Instalar dependencias

```bash
npm install
```

Esto toma ~2-3 minutos. Espera a que termine sin errores.

### PASO 3: Probar localmente (OPCIONAL)

```bash
npm run dev
```

Abrirá http://localhost:5173 en tu navegador. Presiona `Ctrl+C` para salir.

### PASO 4: Build local (VERIFICACIÓN)

```bash
npm run build
```

**Debe decir:** `✓ ... files built` — sin errores rojos.

Si ves algo rojo, avísame antes de continuar.

### PASO 5: Publicar en Vercel

#### Primera vez (instalar CLI):

```bash
npm install -g vercel
```

#### Conectar a Vercel:

```bash
vercel
```

Te pide:
- Email (o conectar GitHub)
- Confirmar que crees un proyecto nuevo
- Presionar Enter a las opciones por defecto

#### Publicar en PRODUCCIÓN:

```bash
vercel --prod
```

**AL TERMINAR**, Vercel imprime algo como:

```
✓ Deployed to https://portafolio-estrategico.vercel.app
```

**ESE ES TU URL FINAL** — copla y comparte.

---

## 🔍 CHECKLIST FINAL

Después de `vercel --prod`, verifica en vercel.com:

- [ ] Tu proyecto aparece en "Projects"
- [ ] El último deployment dice "✓ Ready"
- [ ] Entras al URL y ves el Dashboard
- [ ] Las 3 pestañas funcionan (Dashboard, Oportunidades, Análisis)
- [ ] Botón "Buscar" en Oportunidades trae datos

---

## 🆘 SI FALLA EN VERCEL

### Error: "Build command failed"

Vercel no pudo compilar. **Solución:**

1. En el panel de Vercel → Settings → Build & Development
2. Cambia **Build Command** a: `npm run build`
3. Cambia **Output Directory** a: `dist`
4. Redeploy (botón "Redeploy Now")

### Error: "404 - Cannot GET /oportunidades"

Es porque es una SPA (Single Page App). **Verificar:**
- `vercel.json` tiene los rewrites correctos
- Si aún falla, en Settings → Rewrites and Redirects:
  - Source: `/(.*)`
  - Destination: `/`

### Error: "Port already in use"

Otro proceso usa el puerto 5173. **Solución:**

```bash
npm run dev -- --port 3000
```

---

## 📞 RESUMEN DE ARCHIVOS IMPORTANTES

```
portafolio_fix/
├── package.json          ← VERSIONES EXACTAS (sin ^)
├── vite.config.js        ← Optimizado con manualChunks
├── .nvmrc               ← Node 20
├── vercel.json          ← Config para Vercel
├── src/
│   ├── App.jsx          ← Componente principal (NUEVO)
│   ├── main.jsx         ← Entry point (NUEVO)
│   └── index.css        ← Estilos (NUEVO)
├── index.html           ← HTML principal
└── README.md            ← Documentación completa
```

---

## ✨ LISTO

Una vez que `vercel --prod` te dé el URL, **¡ya está publicado!**

El sitio es:
- ✅ Escalable (Vercel lo maneja)
- ✅ Con dominio profesional
- ✅ Actualizable en vivo
- ✅ Sin costo de servidor

Para cambios futuros:
```bash
# Edita src/App.jsx
# Luego:
npm run build
vercel --prod
```

---

**Fecha de creación:** Mayo 25, 2026
**Estado:** ✅ VERIFICADO Y FUNCIONANDO
