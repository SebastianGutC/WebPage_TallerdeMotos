import React, { useEffect, useState, useRef } from "react";
import {
  getAllProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../../../services/AdminService";
import { getImagenUrl } from "../../../services/ProductosService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartPlus,
  faPenToSquare,
  faCartArrowDown,
  faAngleDown,
  faPencil,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
const INITIAL = {
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "",
  marca: "",
  categoria: "",
  modelo: "",
};

const ProductosTab = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(INITIAL);
  const [imagenFile, setImagenFile] = useState(null); 
  const [imagenPreview, setImagenPreview] = useState(""); 
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showList, setShowList] = useState(true);
  const fileInputRef = useRef(null);

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const res = await getAllProductos();
      setProductos(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const filtered = productos.filter((p) =>
    `${p.nombre} ${p.marca || ""} ${p.categoria || ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagenFile(file);
    setImagenPreview(URL.createObjectURL(file));
  };

  const handleQuitarImagen = () => {
    setImagenFile(null);
    setImagenPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    const { nombre, descripcion, precio, stock, marca, categoria, modelo } =
      form;
    if (
      !nombre ||
      !descripcion ||
      !precio ||
      stock === "" ||
      !marca ||
      !categoria ||
      !modelo
    ) {
      setError("Todos los campos marcados con * son obligatorios.");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("nombre", form.nombre);
      formData.append("descripcion", form.descripcion);
      formData.append("precio", Number(form.precio));
      formData.append("stock", Number(form.stock));
      formData.append("marca", form.marca);
      formData.append("categoria", form.categoria);
      formData.append("modelo", form.modelo);

      // Solo adjunta la imagen si el usuario seleccionó una nueva
      if (imagenFile) {
        formData.append("imagen", imagenFile);
      }

      if (editingId) {
        await updateProducto(editingId, formData);
        setSuccess("Producto actualizado correctamente.");
      } else {
        await createProducto(formData);
        setSuccess("Producto creado correctamente.");
      }

      setForm(INITIAL);
      setImagenFile(null);
      setImagenPreview("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setEditingId(null);
      fetchProductos();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar producto.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (p) => {
    setForm({
      nombre: p.nombre || "",
      descripcion: p.descripcion || "",
      precio: p.precio || "",
      stock: p.stock || "",
      marca: p.marca || "",
      categoria: p.categoria || "",
      modelo: p.modelo || "",
    });
    setImagenFile(null);
    setImagenPreview(p.imagen ? getImagenUrl(p.imagen) : "");
    setEditingId(p._id);
    setShowForm(true);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setForm(INITIAL);
    setImagenFile(null);
    setImagenPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setEditingId(null);
    setError("");
  };

  const handleDelete = async (id, nombre) => {
    const result = await Swal.fire({
      title: "¿Eliminar producto?",
      text: `El producto "${nombre}" será eliminado permanentemente.`,
      icon: "warning",

      showCancelButton: true,

      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",

      customClass: {
        popup: "swal-popup",
        title: "swal-title",
        htmlContainer: "swal-text",
        confirmButton: "swal-confirm",
        cancelButton: "swal-cancel",
      },

      buttonsStyling: false,
      reverseButtons: true,
    });

    // SI CANCELA
    if (!result.isConfirmed) return;

    try {
      await deleteProducto(id);

      setProductos((prev) => prev.filter((p) => p._id !== id));

      Swal.fire({
        title: "Producto eliminado",
        text: "El producto fue eliminado correctamente.",
        icon: "success",

        customClass: {
          popup: "swal-popup",
          title: "swal-title",
          htmlContainer: "swal-text",
          confirmButton: "swal-confirm",
        },

        buttonsStyling: false,
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);

      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar el producto.",
        icon: "error",

        customClass: {
          popup: "swal-popup",
          title: "swal-title",
          htmlContainer: "swal-text",
          confirmButton: "swal-confirm",
        },

        buttonsStyling: false,
      });
    }
  };

  return (
    <div className="tab-content">
      {/* ══ ACORDEÓN: Crear / Editar ════════════════════════════════════════ */}
      <div className="accordion-card">
        <button
          className="accordion-header"
          onClick={() => setShowForm((v) => !v)}
        >
          <span className="section-left">
            <span className="section-icon">
              <FontAwesomeIcon icon={editingId ? faPenToSquare : faCartPlus} />
            </span>
            <span className="section-title-text">
              {editingId ? "Editar producto" : "Nuevo producto"}
            </span>
          </span>
          <span className="accordion-arrow">
            <FontAwesomeIcon
              icon={faAngleDown}
              className={showForm ? "rotate" : ""}
            />
          </span>
        </button>

        {showForm && (
          <div className="accordion-body">
            {error && <p className="form-error">{error}</p>}
            {success && <p className="form-success">{success}</p>}

            <div className="form-grid">
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Filtro de aire"
                />
              </div>
              <div className="form-group">
                <label>Marca *</label>
                <input
                  name="marca"
                  value={form.marca}
                  onChange={handleChange}
                  placeholder="Ej: Honda"
                />
              </div>
              <div className="form-group">
                <label>Modelo *</label>
                <input
                  name="modelo"
                  value={form.modelo}
                  onChange={handleChange}
                  placeholder="Ej: CB190R"
                />
              </div>
              <div className="form-group">
                <label>Categoría *</label>
                <input
                  name="categoria"
                  value={form.categoria}
                  onChange={handleChange}
                  placeholder="Ej: Filtros"
                />
              </div>
              <div className="form-group">
                <label>Precio *</label>
                <input
                  name="precio"
                  type="number"
                  min="0"
                  value={form.precio}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
              <div className="form-group">
                <label>Stock *</label>
                <input
                  name="stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
              <div className="form-group form-full">
                <label>Descripción *</label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Describe el producto..."
                />
              </div>

              {/* ── Imagen ── */}
              <div className="form-group form-full">
                <label>Imagen del producto</label>
                <div className="image-upload-area">
                  {imagenPreview && (
                    <div className="img-preview-wrapper">
                      <img
                        src={imagenPreview}
                        alt="Vista previa"
                        className="img-preview-large"
                      />
                      <button
                        type="button"
                        className="btn-remove-img"
                        onClick={handleQuitarImagen}
                      >
                        Quitar imagen
                      </button>
                    </div>
                  )}
                  <label className="file-upload-label">
                    {imagenPreview ? "Cambiar imagen" : "Seleccionar imagen"}
                    <input
                      ref={fileInputRef}
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
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting
                  ? "Guardando..."
                  : editingId
                    ? "Guardar cambios"
                    : "Crear producto"}
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

      {/* ══ ACORDEÓN: Inventario ════════════════════════════════════════════ */}
      <div className="accordion-card">
        <button
          className="accordion-header"
          onClick={() => setShowList((v) => !v)}
        >
          <span className="section-left">
            <span className="section-icon">
              <FontAwesomeIcon icon={faCartArrowDown} />
            </span>
            <span className="section-title-text">Inventario</span>
            <span className="count-badge-inline">{productos.length}</span>
          </span>
          <span className="accordion-arrow">
            <FontAwesomeIcon
              icon={faAngleDown}
              className={showList ? "rotate" : ""}
            />
          </span>
        </button>

        {showList && (
          <div className="accordion-body">
            <input
              className="search-input"
              placeholder="Buscar por nombre, marca o categoría..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
                    {filtered.map((p) => (
                      <tr
                        key={p._id}
                        className={[
                          p.stock === 0 ? "row-disabled" : "",
                          editingId === p._id ? "row-selected" : "",
                        ].join(" ")}
                      >
                        <td>
                          {/* ✅ getImagenUrl para servir la imagen desde el servidor */}
                          {p.imagen ? (
                            <img
                              src={getImagenUrl(p.imagen)}
                              alt={p.nombre}
                              className="table-img"
                            />
                          ) : (
                            <span className="no-img">—</span>
                          )}
                        </td>
                        <td>
                          <strong>{p.nombre}</strong>
                        </td>
                        <td>{p.marca}</td>
                        <td>{p.categoria}</td>
                        <td>${Number(p.precio).toLocaleString()}</td>
                        <td>
                          <span
                            className={`stock-badge ${
                              p.stock === 0
                                ? "stock-empty"
                                : p.stock < 5
                                  ? "stock-low"
                                  : "stock-ok"
                            }`}
                          >
                            {p.stock}
                          </span>
                        </td>
                        <td className="actions-cell">
                          <div className="actions-wrapper">
                            <button
                              className={`btn-edit ${editingId === p._id ? "btn-edit-active" : ""}`}
                              onClick={() => handleEdit(p)}
                            >
                              <FontAwesomeIcon
                                icon={faPencil}
                                className="btn-icon-mobile"
                              />
                              <span className="btn-text">
                                {editingId === p._id ? "Editando..." : "Editar"}
                              </span>
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => handleDelete(p._id, p.nombre)}
                              disabled={editingId === p._id}
                            >
                              <FontAwesomeIcon
                                icon={faTrash}
                                className="btn-icon-mobile"
                              />
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
