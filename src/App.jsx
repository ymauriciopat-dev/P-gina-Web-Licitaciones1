import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  AlertCircle,
  CheckCircle,
  FileText,
  Search,
  Menu,
  X,
  Download,
  RefreshCw,
} from "lucide-react";

export default function PortafolioEstrategico() {
  const [tab, setTab] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState({
    minValor: 0,
    maxValor: 999999999,
    diasMin: 0,
    modalidad: "todas",
  });

  // Datos de ejemplo para el dashboard
  const dashboardData = {
    capacidad: {
      total: 2500000000,
      disponible: 1200000000,
      vigente: 1300000000,
      porcentaje: 48,
    },
    experiencia: [
      { categoria: "Edificios", valor: 5, color: "#3b82f6" },
      { categoria: "Vías", valor: 3, color: "#10b981" },
      { categoria: "Acueducto", valor: 2, color: "#f59e0b" },
    ],
    historico: [
      { mes: "Ene", ejecutado: 150, presupuesto: 200 },
      { mes: "Feb", ejecutado: 180, presupuesto: 200 },
      { mes: "Mar", ejecutado: 220, presupuesto: 250 },
      { mes: "Abr", ejecutado: 210, presupuesto: 200 },
      { mes: "May", ejecutado: 250, presupuesto: 300 },
    ],
    riesgos: [
      {
        id: 1,
        titulo: "Liquidez crítica Q2",
        nivel: "alto",
        dias: 45,
      },
      {
        id: 2,
        titulo: "Capacidad residual < 20%",
        nivel: "medio",
        dias: 60,
      },
      {
        id: 3,
        titulo: "Experiencia UNSPSC 72 débil",
        nivel: "medio",
        dias: 90,
      },
    ],
  };

  // Función para obtener oportunidades de SECOP II
  const fetchOportunidades = async () => {
    setLoading(true);
    try {
      // Llamada a la API Socrata de SECOP II
      const dataset = "p6dx-8zbt";
      const baseUrl = `https://www.datos.gov.co/resource/${dataset}.json`;

      const ahora = new Date().toISOString();
      const where = encodeURIComponent(
        `fase='Presentación de oferta' AND estado_de_apertura_del_proceso='Abierto' AND fecha_de_recepcion_de_respuestas > '${ahora}' AND tipo_de_contrato in('Obra','Consultoría')`
      );

      const url = `${baseUrl}?$where=${where}&$limit=100&$order=fecha_de_recepcion_de_respuestas%20ASC`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("No se pudo conectar con SECOP II");

      const data = await response.json();

      const procesados = data.map((op) => ({
        id: op.id_del_proceso,
        referencia: op.referencia_del_proceso,
        entidad: op.entidad,
        departamento: op.departamento_entidad,
        ciudad: op.ciudad_entidad,
        objeto: op.nombre_del_procedimiento,
        modalidad: op.modalidad_de_contratacion,
        tipo: op.tipo_de_contrato,
        unspsc: op.codigo_principal_de_categoria,
        valor: parseFloat(op.precio_base) || 0,
        cierre: op.fecha_de_recepcion_de_respuestas,
        url: op.urlproceso,
      }));

      setOpportunities(procesados);
    } catch (error) {
      console.error("Error al traer oportunidades:", error);
      setOpportunities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // No traer automáticamente en mount; esperar a que el usuario lo solicite
  }, []);

  const oportFiltradas = opportunities.filter(
    (op) =>
      op.valor >= filtros.minValor &&
      op.valor <= filtros.maxValor &&
      (filtros.modalidad === "todas" || op.modalidad === filtros.modalidad)
  );

  const NavBar = () => (
    <nav className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-4 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-blue-400" />
          <h1 className="text-2xl font-bold">Portafolio Estratégico</h1>
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 hover:bg-slate-700 rounded"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
        <div
          className={`${
            menuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row gap-2 absolute md:relative top-16 md:top-0 left-0 right-0 md:left-auto md:right-auto bg-slate-900 md:bg-transparent p-4 md:p-0`}
        >
          <button
            onClick={() => {
              setTab("dashboard");
              setMenuOpen(false);
            }}
            className={`px-4 py-2 rounded font-medium transition ${
              tab === "dashboard"
                ? "bg-blue-600 text-white"
                : "hover:bg-slate-700"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => {
              setTab("oportunidades");
              setMenuOpen(false);
            }}
            className={`px-4 py-2 rounded font-medium transition ${
              tab === "oportunidades"
                ? "bg-blue-600 text-white"
                : "hover:bg-slate-700"
            }`}
          >
            Oportunidades
          </button>
          <button
            onClick={() => {
              setTab("analisis");
              setMenuOpen(false);
            }}
            className={`px-4 py-2 rounded font-medium transition ${
              tab === "analisis"
                ? "bg-blue-600 text-white"
                : "hover:bg-slate-700"
            }`}
          >
            Análisis
          </button>
        </div>
      </div>
    </nav>
  );

  const Dashboard = () => (
    <div className="space-y-6">
      {/* Capacidad Contractual */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Capacidad Total</p>
          <p className="text-3xl font-bold text-slate-900">
            ${(dashboardData.capacidad.total / 1e9).toFixed(2)}B
          </p>
          <p className="text-xs text-gray-500 mt-1">COP</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Disponible</p>
          <p className="text-3xl font-bold text-slate-900">
            ${(dashboardData.capacidad.disponible / 1e9).toFixed(2)}B
          </p>
          <p className="text-xs text-green-600 font-medium">48% libre</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <p className="text-gray-600 text-sm">En Vigencia</p>
          <p className="text-3xl font-bold text-slate-900">
            ${(dashboardData.capacidad.vigente / 1e9).toFixed(2)}B
          </p>
          <p className="text-xs text-orange-600">52% comprometido</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <p className="text-gray-600 text-sm">Liquidez Ratio</p>
          <p className="text-3xl font-bold text-slate-900">2.4x</p>
          <p className="text-xs text-purple-600">Estable</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-4">Ejecución Mensual (COP)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData.historico}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={(val) => `$${(val / 1e6).toFixed(0)}M`} />
              <Legend />
              <Bar dataKey="ejecutado" fill="#3b82f6" name="Ejecutado" />
              <Bar dataKey="presupuesto" fill="#e5e7eb" name="Presupuesto" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-4">Experiencia por Categoría</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dashboardData.experiencia}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ categoria, valor }) => `${categoria}: ${valor}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="valor"
              >
                {dashboardData.experiencia.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alertas de Riesgo */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          Alertas Críticas
        </h3>
        <div className="space-y-3">
          {dashboardData.riesgos.map((riesgo) => (
            <div
              key={riesgo.id}
              className={`p-4 rounded-lg border-l-4 ${
                riesgo.nivel === "alto"
                  ? "bg-red-50 border-red-500"
                  : "bg-yellow-50 border-yellow-500"
              }`}
            >
              <p className="font-medium text-slate-900">{riesgo.titulo}</p>
              <p className="text-sm text-gray-600">
                Gestión requerida en {riesgo.dias} días
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const Oportunidades = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="number"
            placeholder="Valor mín (COP)"
            value={filtros.minValor}
            onChange={(e) =>
              setFiltros({ ...filtros, minValor: Number(e.target.value) })
            }
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Valor máx (COP)"
            value={filtros.maxValor}
            onChange={(e) =>
              setFiltros({ ...filtros, maxValor: Number(e.target.value) })
            }
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filtros.modalidad}
            onChange={(e) =>
              setFiltros({ ...filtros, modalidad: e.target.value })
            }
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todas">Todas las modalidades</option>
            <option value="Licitación Pública">Licitación Pública</option>
            <option value="Selección Abreviada">Selección Abreviada</option>
          </select>
          <button
            onClick={fetchOportunidades}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Cargando..." : "Buscar"}
          </button>
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Consultando SECOP II...</p>
          </div>
        )}

        {!loading && oportFiltradas.length === 0 && opportunities.length > 0 && (
          <div className="text-center py-12 text-gray-500">
            No hay oportunidades que coincidan con los filtros
          </div>
        )}

        {!loading && opportunities.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            <Search className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>Haz clic en "Buscar" para traer oportunidades de SECOP II</p>
          </div>
        )}

        {oportFiltradas.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left p-3 font-bold">Entidad</th>
                  <th className="text-left p-3 font-bold">Objeto</th>
                  <th className="text-right p-3 font-bold">Valor (COP)</th>
                  <th className="text-left p-3 font-bold">Modalidad</th>
                  <th className="text-center p-3 font-bold">Acción</th>
                </tr>
              </thead>
              <tbody>
                {oportFiltradas.map((op) => (
                  <tr key={op.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-gray-900 font-medium">{op.entidad}</td>
                    <td className="p-3 text-gray-700">{op.objeto}</td>
                    <td className="p-3 text-right font-bold text-slate-900">
                      ${(op.valor / 1e6).toFixed(0)}M
                    </td>
                    <td className="p-3 text-gray-600">{op.modalidad}</td>
                    <td className="p-3 text-center">
                      <a
                        href={op.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Ver
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const Analisis = () => (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-bold">Análisis de Viabilidad</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Documentos Requeridos
          </h3>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>✓ RUP actualizado</li>
            <li>✓ Estados financieros últimos 3 años</li>
            <li>✓ Certificados de experiencia</li>
            <li>✓ Antecedentes disciplinarios</li>
          </ul>
        </div>

        <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
          <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Indicadores Financieros
          </h3>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>Liquidez Corriente: 2.4x ✓</li>
            <li>ROA: 8.2% ✓</li>
            <li>Deuda/Patrimonio: 0.65x ✓</li>
          </ul>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-bold text-slate-900 mb-3">Próximos Pasos</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Revisar ofertas nuevas en SECOP II cada semana</li>
          <li>Validar compatibilidad UNSPSC con tu capacidad instalada</li>
          <li>Contactar entidades coordinadoras 15 días antes del cierre</li>
          <li>Preparar pliegos de interrogantes según antecedentes</li>
        </ol>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {tab === "dashboard" && <Dashboard />}
        {tab === "oportunidades" && <Oportunidades />}
        {tab === "analisis" && <Analisis />}
      </main>
    </div>
  );
}
