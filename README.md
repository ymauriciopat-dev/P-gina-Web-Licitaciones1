# Portafolio Estratégico 📊

Sistema integral para análisis de capacidad contractual y scouting de licitaciones de obra civil en **SECOP II** (Sistema Electrónico para la Contratación Pública).

## 🚀 Características

- **Dashboard de Capacidad**: Visualización en tiempo real de capacidad total, disponible y en vigencia
- **Análisis de Experiencia**: Gráficos de experiencia por categoría UNSPSC
- **Scouting de Oportunidades**: Búsqueda automática en SECOP II con filtros por valor, modalidad y plazo
- **Alertas Críticas**: Identificación de riesgos financieros y operacionales
- **Reportes Estratégicos**: Análisis de viabilidad técnica y financiera

---

## 📋 Requisitos Previos

- **Node.js** v20 o superior ([Descargar](https://nodejs.org/))
- **npm** (incluido con Node.js)
- Acceso a internet (para consultar SECOP II en vivo)

---

## 🛠️ Instalación Local

### 1. Clonar o descomprimir el proyecto

```bash
# Si descargaste un ZIP
unzip portafolio-estrategico.zip
cd portafolio-estrategico
```

### 2. Instalar dependencias

```bash
npm install
```

Esto descargará:
- **React 18.3.1** (framework UI)
- **Vite 5.4.11** (bundler de desarrollo)
- **Recharts 2.15.4** (gráficos)
- **Lucide React 0.383.0** (iconos)

### 3. Ejecutar en desarrollo (local)

```bash
npm run dev
```

Abrirá automáticamente en `http://localhost:5173`

### 4. Crear versión para producción

```bash
npm run build
```

Genera carpeta `dist/` lista para publicar.

---

## 🌐 Publicar en Vercel (URL Compartible)

### Opción A: Desde terminal (recomendado)

```bash
# Primera vez: instalar Vercel CLI
npm install -g vercel

# Conectarse (requiere cuenta gratis en vercel.com)
vercel

# Publicar en producción
vercel --prod
```

Al terminar, Vercel imprime el **URL final**, ej:
```
https://portafolio-estrategico.vercel.app
```

### Opción B: Desde dashboard Vercel

1. Ve a [vercel.com](https://vercel.com)
2. "Add New" → "Project"
3. Conecta tu repositorio (GitHub, GitLab, Bitbucket)
4. Vercel detecta que es un proyecto Vite y publica automáticamente
5. El URL está listo en ~2 minutos

---

## 📁 Estructura del Proyecto

```
portafolio-estrategico/
├── src/
│   ├── App.jsx           ← Componente principal (Dashboard + Oportunidades + Análisis)
│   ├── main.jsx          ← Punto de entrada React
│   └── index.css         ← Estilos (Tailwind CSS)
├── index.html            ← Punto de entrada HTML
├── package.json          ← Dependencias (versiones EXACTAS)
├── vite.config.js        ← Configuración de Vite
├── vercel.json           ← Configuración de despliegue Vercel
├── .nvmrc                ← Versión de Node fijada a 20
├── .gitignore            ← Archivos a ignorar en Git
├── extractor_secop.py    ← Script Python para extraer datos (opcional)
└── DESPLIEGUE.md         ← Guía de despliegue
```

---

## 🔧 Configuración Avanzada

### Variables de Entorno

Crea un archivo `.env` en la raíz (copia `.env.example`):

```bash
VITE_API_SECOP=https://www.datos.gov.co/resource
VITE_DATASET_SECOP=p6dx-8zbt
```

### Agregar tu App Token de Socrata

Si usas el extractor Python (`extractor_secop.py`), registra un token en:
https://datos.gov.co/profile/application_tokens

```bash
python extractor_secop.py --app-token TU_TOKEN --limit 500
```

---

## 📊 Pestaña: Oportunidades (SECOP II en Vivo)

1. Abre la pestaña **Oportunidades**
2. Usa los filtros (valor, modalidad)
3. Haz clic en **"Buscar"** → Consulta SECOP II en tiempo real
4. Los procesos vigentes aparecen en una tabla
5. Haz clic en **"Ver"** para ir al pliego completo

**Nota:** La búsqueda en vivo funciona desde navegador. Si prefieres backend:
- Usa el script `extractor_secop.py` (genera `opportunities.json`)
- Avísale al desarrollador para integrarlo en la web

---

## 🐛 Solución de Errores Comunes

### Error: "npm run build exited with 1"

**Solución:**
```bash
# Limpia y reinstala dependencias
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Error: "Cannot find module 'react'"

**Solución:** El `package.json` está corrupto o npm no instaló correctamente.
```bash
npm install
```

### Error: "Port 5173 already in use"

**Solución:** Otro proceso usa el puerto. Cambia:
```bash
npm run dev -- --port 3000
```

### Vercel: "No build output generated"

Verifica que:
1. `package.json` tiene `"build": "vite build"`
2. `.nvmrc` contiene `20`
3. `vite.config.js` no tiene errores de sintaxis

---

## 📈 Usar datos de tu RUP

Para integrar tu capacidad contractual real:

1. **Descarga tu RUP** desde Cámara de Comercio
2. **Abre Dashboard → edita los valores** en `dashboardData.capacidad` (línea ~43 en App.jsx)
3. **Guarda y redeploy:**
   ```bash
   npm run build
   vercel --prod
   ```

---

## 🔗 Próximos Pasos

1. **Semanal:** Ejecuta `npm run dev` y busca nuevas oportunidades
2. **Mensual:** Actualiza estados financieros en el Dashboard
3. **Trimestral:** Ejecuta `extractor_secop.py` para un backup de procesos
4. **Anual:** Revisa tu capacidad residual y ajusta estrategia

---

## 📞 Soporte

- **Errores de SECOP II:** Contacta a datos.gov.co
- **Errores de Vercel:** Abre ticket en [vercel.com/support](https://vercel.com/support)
- **Errores del código:** Revisa los console logs del navegador (F12 → Console)

---

## 📄 Licencia

Este proyecto es privado y solo para uso interno. No redistribuir sin autorización.

---

**Última actualización:** Mayo 2026  
**Versiones:** Node 20, Vite 5.4.11, React 18.3.1, Recharts 2.15.4
