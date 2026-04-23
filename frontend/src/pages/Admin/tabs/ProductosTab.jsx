// src/pages/Admin/tabs/ProductosTab.jsx
import React, { useEffect, useState } from "react";
import { getAllProductos, createProducto, updateProducto, deleteProducto } from "../../../services/AdminService";

const INITIAL = { nombre: "", descripcion: "", precio: "", stock: "", marca: "", categoria: "", img64: "" };

const ProductosTab = () => {
  const [productos, setProductos]     = useState([]);
  const [loading, setLoading]         = useState(false);
  const [search, setSearch]           = useState("");
  const [form, setForm]               = useState(INITIAL);
  const [editingId, setEditingId]     = useState(null);  
  const [editForm, setEditForm]       = useState({});
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState("");
  const [submitting, setSubmitting]   = useState(false);
  const [showForm, setShowForm]       = useState(false);
  const [showList, setShowList]       = useState(true);

  const fetchProductos = async () => {
    setLoading(true);
    try { const res = await getAllProductos(); setProductos(res.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProductos(); }, []);

  const filtered = productos.filter(p =>
    `${p.nombre} ${p.marca || ""} ${p.categoria || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  /* ── Formulario crear ── */
  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(""); };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm(prev => ({ ...prev, img64: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    const { nombre, descripcion, precio, stock, marca, categoria } = form;
    if (!nombre || !descripcion || !precio || stock === "" || !marca || !categoria) {
      setError("Todos los campos marcados con * son obligatorios."); return;
    }
    try {
      setSubmitting(true);
      const data = { ...form, precio: Number(form.precio), stock: Number(form.stock) };
      await createProducto(data);
      setSuccess("Producto creado correctamente.");
      setForm(INITIAL);
      fetchProductos();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear producto.");
    } finally { setSubmitting(false); }
  };

  /* ── Edición inline en tabla ── */
  const handleStartEdit = (p) => {
    setEditingId(p._id);
    setEditForm({
      nombre:      p.nombre,
      descripcion: p.descripcion,
      precio:      p.precio,
      stock:       p.stock,
      marca:       p.marca,
      categoria:   p.categoria,
      img64:       p.img64 || "",
    });
  };

  const handleCancelEdit = () => { setEditingId(null); setEditForm({}); };

  const handleSaveEdit = async (id) => {
    const { nombre, descripcion, precio, stock, marca, categoria } = editForm;
    if (!nombre || !descripcion || precio === "" || stock === "" || !marca || !categoria) {
      alert("Todos los campos son obligatorios."); return;
    }
    setSaving(true);
    try {
      const data = { ...editForm, precio: Number(editForm.precio), stock: Number(editForm.stock) };
      await updateProducto(id, data);
      setProductos(prev => prev.map(p => p._id === id ? { ...p, ...data } : p));
      setEditingId(null);
      setEditForm({});
    } catch { alert("Error al guardar cambios."); }
    finally { setSaving(false); }
  };

  /* ── Eliminar ── */
  const handleDelete = async (id, nombre) => {
    if (!window.confirm(`¿Eliminar el producto "${nombre}"?`)) return;
    try {
      await deleteProducto(id);
      setProductos(prev => prev.filter(p => p._id !== id));
    } catch { alert("Error al eliminar producto."); }
  };

  return (
    <div className="tab-content">

      {/* ══ ACORDEÓN: Crear producto ══ */}
      <div className="accordion-card">
        <button className="accordion-header" onClick={() => setShowForm(v => !v)}>
          <span>➕ Nuevo producto</span>
          <span className="accordion-arrow">{showForm ? "▲" : "▼"}</span>
        </button>

        {showForm && (
          <div className="accordion-body">
            {error   && <p className="form-error">{error}</p>}
            {success && <p className="form-success">{success}</p>}
            <div className="form-grid">
              <div className="form-group">
                <label>Nombre *</label>
                <input name="nombre" value={form.nombre} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Marca *</label>
                <input name="marca" value={form.marca} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Categoría *</label>
                <input name="categoria" value={form.categoria} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Precio *</label>
                <input name="precio" type="number" min="0" value={form.precio} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Stock *</label>
                <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} />
              </div>
              <div className="form-group form-full">
                <label>Descripción *</label>
                <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3} />
              </div>
              <div className="form-group">
                <label>Imagen del producto</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="file-input" />
                {form.img64 && <img src={form.img64} alt="Vista previa" className="img-preview" />}
              </div>
            </div>
            <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Guardando..." : "Crear producto"}
            </button>
          </div>
        )}
      </div>

      {/* ══ ACORDEÓN: Inventario ══ */}
      <div className="accordion-card">
        <button className="accordion-header" onClick={() => setShowList(v => !v)}>
          <span>📦 Inventario <span className="count-badge-inline">{productos.length}</span></span>
          <span className="accordion-arrow">{showList ? "▲" : "▼"}</span>
        </button>

        {showList && (
          <div className="accordion-body">
            <input
              className="search-input"
              placeholder="Buscar por nombre, marca o categoría..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {loading ? (
              <p className="loading-text">Cargando productos...</p>
            ) : filtered.length === 0 ? (
              <p className="empty-text">No hay productos que coincidan.</p>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Imagen</th>
                      <th>Nombre</th>
                      <th>Marca</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(p => (
                      <React.Fragment key={p._id}>
                        {editingId === p._id ? (
                          /* ── Fila de edición ── */
                          <tr className="row-editing">
                            <td>
                              {editForm.img64
                                ? <img src={editForm.img64} alt="preview" className="table-img" />
                                : <span className="no-img">—</span>}
                            </td>
                            <td><input className="inline-input" value={editForm.nombre}      onChange={e => setEditForm({...editForm, nombre: e.target.value})} /></td>
                            <td><input className="inline-input" value={editForm.marca}       onChange={e => setEditForm({...editForm, marca: e.target.value})} /></td>
                            <td><input className="inline-input" value={editForm.categoria}   onChange={e => setEditForm({...editForm, categoria: e.target.value})} /></td>
                            <td><input className="inline-input" type="number" value={editForm.precio}    onChange={e => setEditForm({...editForm, precio: e.target.value})} /></td>
                            <td><input className="inline-input" type="number" value={editForm.stock}     onChange={e => setEditForm({...editForm, stock: e.target.value})} /></td>
                            <td className="actions-cell">
                              <button className="btn-save" onClick={() => handleSaveEdit(p._id)} disabled={saving}>
                                {saving ? "..." : "✓ Guardar"}
                              </button>
                              <button className="btn-secondary-sm" onClick={handleCancelEdit}>✕</button>
                            </td>
                          </tr>
                        ) : (
                          /* ── Fila de lectura ── */
                          <tr className={p.stock === 0 ? "row-disabled" : ""}>
                            <td>
                              {p.img64
                                ? <img src={p.img64} alt={p.nombre} className="table-img" />
                                : <span className="no-img">—</span>}
                            </td>
                            <td><strong>{p.nombre}</strong></td>
                            <td>{p.marca}</td>
                            <td>{p.categoria}</td>
                            <td>${Number(p.precio).toLocaleString()}</td>
                            <td>
                              <span className={`stock-badge ${
                                p.stock === 0 ? "stock-empty" : p.stock < 5 ? "stock-low" : "stock-ok"
                              }`}>
                                {p.stock}
                              </span>
                            </td>
                            <td className="actions-cell">
                              <button className="btn-edit" onClick={() => handleStartEdit(p)}>Editar</button>
                              <button className="btn-delete" onClick={() => handleDelete(p._id, p.nombre)}>Eliminar</button>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductosTab;