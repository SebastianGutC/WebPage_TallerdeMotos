// src/pages/Admin/tabs/ProductosTab.jsx
import React, { useEffect, useState } from "react";
import { getAllProductos, createProducto, updateProducto, deleteProducto } from "../../../services/AdminService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faPenToSquare, faCartArrowDown, faAngleDown, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";

const INITIAL = { nombre: "", descripcion: "", precio: "", stock: "", marca: "", categoria: "", img64: "" };

const ProductosTab = () => {
  const [productos, setProductos]   = useState([]);
  const [loading, setLoading]       = useState(false);
  const [search, setSearch]         = useState("");
  const [form, setForm]             = useState(INITIAL);
  const [editingId, setEditingId]   = useState(null);   // null = crear, id = editar
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm]     = useState(false);
  const [showList, setShowList]     = useState(true);

  const fetchProductos = async () => {
    setLoading(true);
    try { const res = await getAllProductos(); setProductos(res.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProductos(); }, []);

  const filtered = productos.filter(p =>
    `${p.nombre} ${p.marca || ""} ${p.categoria || ""}`
      .toLowerCase().includes(search.toLowerCase())
  );

  // ── Cambios en el formulario ───────────────────────────────────────────────
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm(prev => ({ ...prev, img64: reader.result }));
    reader.readAsDataURL(file);
  };

  // ── Guardar (crear o editar) ───────────────────────────────────────────────
  const handleSubmit = async () => {
    const { nombre, descripcion, precio, stock, marca, categoria } = form;
    if (!nombre || !descripcion || !precio || stock === "" || !marca || !categoria) {
      setError("Todos los campos marcados con * son obligatorios."); return;
    }
    try {
      setSubmitting(true);
      const data = { ...form, precio: Number(form.precio), stock: Number(form.stock) };

      if (editingId) {
        await updateProducto(editingId, data);
        setSuccess("Producto actualizado correctamente.");
      } else {
        await createProducto(data);
        setSuccess("Producto creado correctamente.");
      }

      setForm(INITIAL);
      setEditingId(null);
      fetchProductos();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar producto.");
    } finally { setSubmitting(false); }
  };

  // ── Abrir formulario en modo edición ──────────────────────────────────────
  // Igual que ServiciosTab: rellena el form y abre el acordeón
  const handleEdit = (p) => {
    setForm({
      nombre:      p.nombre      || "",
      descripcion: p.descripcion || "",
      precio:      p.precio      || "",
      stock:       p.stock       || "",
      marca:       p.marca       || "",
      categoria:   p.categoria   || "",
      img64:       p.img64       || "",   // ← imagen actual precargada
    });
    setEditingId(p._id);
    setShowForm(true);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Cancelar edición ───────────────────────────────────────────────────────
  const handleCancel = () => {
    setForm(INITIAL);
    setEditingId(null);
    setError("");
  };

  // ── Eliminar ───────────────────────────────────────────────────────────────
  const handleDelete = async (id, nombre) => {
    if (!window.confirm(`¿Eliminar el producto "${nombre}"?`)) return;
    try {
      await deleteProducto(id);
      setProductos(prev => prev.filter(p => p._id !== id));
    } catch { alert("Error al eliminar producto."); }
  };

  return (
    <div className="tab-content">

      {/* ══ ACORDEÓN: Crear / Editar producto ════════════════════════════════ */}
      <div className="accordion-card">
        <button className="accordion-header" onClick={() => setShowForm(v => !v)}>
          <span className="section-left">
            <span className="section-icon">
              <FontAwesomeIcon icon={editingId ? faPenToSquare : faCartPlus} />
            </span>
            <span className="section-title-text">
              {editingId ? "Editar producto" : "Nuevo producto"}
            </span>
          </span>
          <span className="accordion-arrow">
            <FontAwesomeIcon icon={faAngleDown} className={showForm ? "rotate" : ""} />
          </span>
        </button>

        {showForm && (
          <div className="accordion-body">
            {error   && <p className="form-error">{error}</p>}
            {success && <p className="form-success">{success}</p>}

            <div className="form-grid">
              <div className="form-group">
                <label>Nombre *</label>
                <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ej: Filtro de aire" />
              </div>
              <div className="form-group">
                <label>Marca *</label>
                <input name="marca" value={form.marca} onChange={handleChange} placeholder="Ej: Honda" />
              </div>
              <div className="form-group">
                <label>Categoría *</label>
                <input name="categoria" value={form.categoria} onChange={handleChange} placeholder="Ej: Filtros" />
              </div>
              <div className="form-group">
                <label>Precio *</label>
                <input name="precio" type="number" min="0" value={form.precio} onChange={handleChange} placeholder="0" />
              </div>
              <div className="form-group">
                <label>Stock *</label>
                <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} placeholder="0" />
              </div>
              <div className="form-group form-full">
                <label>Descripción *</label>
                <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3} placeholder="Describe el producto..." />
              </div>

              {/* ── Campo de imagen: muestra vista previa si ya tiene imagen ── */}
              <div className="form-group form-full">
                <label>Imagen del producto</label>
                <div className="image-upload-area">
                  {form.img64 && (
                    <div className="img-preview-wrapper">
                      <img src={form.img64} alt="Vista previa" className="img-preview-large" />
                      <button
                        type="button"
                        className="btn-remove-img"
                        onClick={() => setForm(prev => ({ ...prev, img64: "" }))}
                        title="Quitar imagen"
                      >
                        Quitar imagen
                      </button>
                    </div>
                  )}
                  <label className="file-upload-label">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="file-input-hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Guardando..." : editingId ? "Guardar cambios" : "Crear producto"}
              </button>
              {editingId && (
                <button className="btn-secondary" onClick={handleCancel}>
                  Cancelar edición
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ══ ACORDEÓN: Inventario ══════════════════════════════════════════════ */}
      <div className="accordion-card">
        <button className="accordion-header" onClick={() => setShowList(v => !v)}>
          <span className="section-left">
            <span className="section-icon">
              <FontAwesomeIcon icon={faCartArrowDown} />
            </span>
            <span className="section-title-text">Inventario</span>
            <span className="count-badge-inline">{productos.length}</span>
          </span>
          <span className="accordion-arrow">
            <FontAwesomeIcon icon={faAngleDown} className={showList ? "rotate" : ""} />
          </span>
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
                      <tr
                        key={p._id}
                        className={[
                          p.stock === 0 ? "row-disabled" : "",
                          editingId === p._id ? "row-selected" : "",
                        ].join(" ")}
                      >
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
                          <div className="actions-wrapper">  
                            <button
                              className={`btn-edit ${editingId === p._id ? "btn-edit-active" : ""}`}
                              onClick={() => handleEdit(p)}
                            >
                              <FontAwesomeIcon icon={faPencil} className="btn-icon-mobile" />
                              <span className="btn-text">
                                {editingId === p._id ? "Editando..." : "Editar"}
                              </span>
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => handleDelete(p._id, p.nombre)}
                              disabled={editingId === p._id}
                            >
                              <FontAwesomeIcon icon={faTrash} className="btn-icon-mobile" />
                              <span className="btn-text">Eliminar</span>
                            </button>
                          </div>
                        </td>
                      </tr>
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