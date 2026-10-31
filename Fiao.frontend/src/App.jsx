import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Check,
  CreditCard,
  LoaderCircle,
  Pencil,
  Plus,
  RotateCw,
  Search,
  ShieldCheck,
  Trash2,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { clientsApi } from "./api.js";

const emptyForm = {
  nombre: "",
  apellido: "",
  cedula: "",
  telefono: "",
  direccion: "",
  limiteCredito: "",
  activo: true,
};
const money = new Intl.NumberFormat("es-DO", {
  style: "currency",
  currency: "DOP",
  maximumFractionDigits: 2,
});

function App() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const data = await clientsApi.list();
      setClients(Array.isArray(data) ? data : []);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  const shown = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("es");
    return clients.filter(
      (client) =>
        !term ||
        [
          client.nombre,
          client.apellido,
          client.cedula,
          client.telefono,
          client.direccion,
          String(client.id),
        ].some((value) =>
          String(value ?? "")
            .toLocaleLowerCase("es")
            .includes(term),
        ),
    );
  }, [clients, query]);

  const totals = useMemo(
    () => ({
      credit: clients.reduce(
        (sum, client) => sum + Number(client.limiteCredito || 0),
        0,
      ),
      balance: clients.reduce(
        (sum, client) => sum + Number(client.saldoActual || 0),
        0,
      ),
      active: clients.filter((client) => client.activo !== false).length,
    }),
    [clients],
  );

  const create = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setModal(true);
  };

  const edit = async (client) => {
    setError("");
    try {
      const current = await clientsApi.get(client.id);
      setEditing(current);
      setForm({
        nombre: current.nombre ?? "",
        apellido: current.apellido ?? "",
        cedula: current.cedula ?? "",
        telefono: current.telefono ?? "",
        direccion: current.direccion ?? "",
        limiteCredito: current.limiteCredito ?? "",
        activo: current.activo !== false,
      });
      setModal(true);
    } catch {
      setError(
        "No se pudieron cargar los datos del cliente. Inténtalo de nuevo.",
      );
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      cedula: form.cedula.trim(),
      telefono: form.telefono.trim() || null,
      direccion: form.direccion.trim() || null,
      limiteCredito: Number(form.limiteCredito),
    };
    try {
      if (editing)
        await clientsApi.update(editing.id, {
          ...payload,
          activo: form.activo,
        });
      else await clientsApi.create(payload);
      setModal(false);
      setNotice(
        editing
          ? "Cliente actualizado correctamente."
          : "Cliente registrado correctamente.",
      );
      await load();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (client) => {
    if (
      !window.confirm(
        `¿Eliminar definitivamente a ${client.nombre} ${client.apellido}? Esta acción no se puede deshacer.`,
      )
    )
      return;
    setDeleting(client.id);
    try {
      await clientsApi.remove(client.id);
      setNotice("Cliente eliminado correctamente.");
      await load();
    } catch {
      setLoadError(true);
    } finally {
      setDeleting(null);
    }
  };

  const updateField = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-800">
      <header className="flex h-[76px] items-center border-b border-slate-200 bg-white px-5 sm:px-9">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#17233c] text-lg font-black text-white">
            F
          </span>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Fiao
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-5 py-8 sm:px-9 sm:py-10">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Clientes
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Administra la información de tus clientes.
            </p>
          </div>
          <button
            onClick={create}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800"
          >
            <Plus size={18} />
            Nuevo cliente
          </button>
        </div>

        {loadError && (
          <div
            role="status"
            className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
          >
            <span>
              No se pudieron cargar los clientes. Comprueba que el servicio esté
              disponible.
            </span>
            <button
              onClick={load}
              className="shrink-0 font-semibold underline underline-offset-2"
            >
              Reintentar
            </button>
          </div>
        )}

        <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric
            icon={Users}
            label="Clientes registrados"
            value={loading ? "…" : loadError ? "—" : clients.length}
            foot="Registros en la cartera"
            tone="indigo"
          />
          <Metric
            icon={ShieldCheck}
            label="Clientes activos"
            value={loading ? "…" : loadError ? "—" : totals.active}
            foot="Estado de los clientes"
            tone="green"
          />
          <Metric
            icon={CreditCard}
            label="Límite de crédito"
            value={
              loading ? "…" : loadError ? "—" : money.format(totals.credit)
            }
            foot="Límites asignados"
            tone="blue"
          />
          <Metric
            icon={Wallet}
            label="Saldo actual"
            value={
              loading ? "…" : loadError ? "—" : money.format(totals.balance)
            }
            foot="Saldos registrados"
            tone="amber"
          />
        </section>

        <section
          id="clientes"
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/[.04]"
        >
          <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <h2 className="font-bold text-slate-900">Todos los clientes</h2>
            <div className="flex gap-2">
              <label className="relative flex min-w-0 flex-1 items-center sm:w-[270px]">
                <Search className="absolute left-3 text-slate-400" size={17} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar cliente..."
                  className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                />
              </label>
              <button
                onClick={load}
                title="Actualizar lista"
                className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-700"
              >
                <RotateCw size={17} />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  {[
                    "Cliente",
                    "Cédula",
                    "Teléfono",
                    "Límite crédito",
                    "Saldo actual",
                    "Estado",
                    "Acciones",
                  ].map((label) => (
                    <th
                      key={label}
                      className="px-4 py-3.5 first:pl-6 last:text-right"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="py-16 text-center text-slate-500"
                    >
                      <LoaderCircle
                        className="mx-auto mb-2 animate-spin text-indigo-500"
                        size={22}
                      />
                      Cargando clientes…
                    </td>
                  </tr>
                ) : loadError ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="py-12 text-center text-sm text-slate-500"
                    >
                      La lista aparecerá cuando se restablezca la conexión.
                    </td>
                  </tr>
                ) : shown.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-16 text-center">
                      <div className="mb-3 text-slate-400">
                        <Users className="mx-auto" />
                      </div>
                      <b>
                        {query
                          ? "No encontramos coincidencias"
                          : "Aún no hay clientes"}
                      </b>
                      <p className="mt-1 text-xs text-slate-400">
                        {query
                          ? "Prueba con otro nombre, cédula o teléfono."
                          : "Registra el primero para comenzar."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  shown.map((client) => (
                    <tr key={client.id} className="hover:bg-slate-50/70">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-xs font-bold text-indigo-700">
                            {`${client.nombre?.[0] || ""}${client.apellido?.[0] || ""}`.toUpperCase()}
                          </span>
                          <span>
                            <b className="block">
                              {client.nombre} {client.apellido}
                            </b>
                            <small className="text-slate-400">
                              Cliente #{client.id}
                            </small>
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {client.cedula || "—"}
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {client.telefono || "—"}
                      </td>
                      <td className="px-4 py-4 font-medium">
                        {money.format(Number(client.limiteCredito || 0))}
                      </td>
                      <td className="px-4 py-4 font-medium">
                        {money.format(Number(client.saldoActual || 0))}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${client.activo === false ? "bg-slate-100 text-slate-500" : "bg-emerald-50 text-emerald-700"}`}
                        >
                          {client.activo === false ? "Inactivo" : "Activo"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => edit(client)}
                            title="Editar"
                            className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-indigo-50 hover:text-indigo-700"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => remove(client)}
                            disabled={deleting === client.id}
                            title="Eliminar"
                            className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"
                          >
                            {deleting === client.id ? (
                              <LoaderCircle
                                size={16}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-100 px-6 py-3.5 text-xs text-slate-500">
            Mostrando{" "}
            <b className="text-slate-700">{loadError ? "—" : shown.length}</b>{" "}
            de{" "}
            <b className="text-slate-700">{loadError ? "—" : clients.length}</b>{" "}
            clientes
          </div>
        </section>
      </main>

      {notice && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl"
        >
          <Check size={17} className="text-emerald-400" />
          {notice}
        </div>
      )}
      {modal && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving)
              setModal(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="form-title"
            className="my-auto w-full max-w-[560px] rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
                  Clientes
                </p>
                <h2 id="form-title" className="mt-1 text-xl font-bold">
                  {editing ? "Editar cliente" : "Nuevo cliente"}
                </h2>
              </div>
              <button
                onClick={() => !saving && setModal(false)}
                className="h-9 w-9 rounded-lg text-slate-400 hover:bg-slate-100"
                aria-label="Cerrar"
              >
                <X size={19} />
              </button>
            </div>
            <form onSubmit={submit} className="px-6 py-5">
              {error && (
                <p
                  role="alert"
                  className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700"
                >
                  {error}
                </p>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Nombre"
                  required
                  maxLength={100}
                  value={form.nombre}
                  change={(value) => updateField("nombre", value)}
                />
                <Field
                  label="Apellido"
                  required
                  maxLength={100}
                  value={form.apellido}
                  change={(value) => updateField("apellido", value)}
                />
                <Field
                  label="Cédula"
                  required
                  minLength={13}
                  maxLength={13}
                  value={form.cedula}
                  change={(value) => updateField("cedula", value)}
                  placeholder="000-0000000-0"
                />
                <Field
                  label="Teléfono"
                  maxLength={20}
                  value={form.telefono}
                  change={(value) => updateField("telefono", value)}
                  placeholder="809-000-0000"
                />
                <div className="sm:col-span-2">
                  <Field
                    label="Dirección"
                    maxLength={200}
                    value={form.direccion}
                    change={(value) => updateField("direccion", value)}
                  />
                </div>
                <Field
                  label="Límite de crédito (DOP)"
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.limiteCredito}
                  change={(value) => updateField("limiteCredito", value)}
                  placeholder="0.00"
                />
                {editing && (
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                      Estado
                    </span>
                    <select
                      value={form.activo ? "true" : "false"}
                      onChange={(event) =>
                        updateField("activo", event.target.value === "true")
                      }
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                    >
                      <option value="true">Activo</option>
                      <option value="false">Inactivo</option>
                    </select>
                  </label>
                )}
              </div>
              <div className="mt-6 flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  disabled={saving}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  disabled={saving}
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  {saving ? (
                    <LoaderCircle className="animate-spin" size={16} />
                  ) : (
                    <Check size={16} />
                  )}
                  {saving
                    ? "Guardando…"
                    : editing
                      ? "Guardar cambios"
                      : "Crear cliente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Metric({ icon: Icon, label, value, foot, tone }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    green: "bg-emerald-50 text-emerald-600",
    blue: "bg-sky-50 text-sky-600",
    amber: "bg-amber-50 text-amber-600",
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/[.04]">
      <div className="flex justify-between text-xs font-semibold text-slate-500">
        {label}
        <span
          className={`grid h-9 w-9 place-items-center rounded-xl ${colors[tone]}`}
        >
          <Icon size={18} />
        </span>
      </div>
      <p className="mt-4 text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{foot}</p>
    </div>
  );
}

function Field({ label, value, change, required = false, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </span>
      <input
        required={required}
        value={value}
        onChange={(event) => change(event.target.value)}
        className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
        {...props}
      />
    </label>
  );
}

export default App;
