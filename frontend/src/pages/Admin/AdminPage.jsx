// src/pages/Admin/AdminPage.jsx
import React, { useState } from "react";
import UsuariosTab  from "./tabs/UsuariosTab";
import TecnicosTab  from "./tabs/TecnicosTab";
import CitasTab     from "./tabs/CitasTab";
import ServiciosTab from "./tabs/ServiciosTab";
import ProductosTab from "./tabs/ProductosTab";
import "./AdminPage.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup, faWrench, faCalendar, faGear, faBasketShopping } from "@fortawesome/free-solid-svg-icons";

const TABS = [
  { id: "usuarios",  label: "Usuarios",  icon: <FontAwesomeIcon icon={faUserGroup} /> },
  { id: "tecnicos",  label: "Técnicos",  icon: <FontAwesomeIcon icon={faWrench} /> },
  { id: "citas",     label: "Citas",     icon: <FontAwesomeIcon icon={faCalendar} /> },
  { id: "servicios", label: "Servicios", icon: <FontAwesomeIcon icon={faGear} /> },
  { id: "productos", label: "Productos", icon: <FontAwesomeIcon icon={faBasketShopping} /> },
];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("usuarios");

  const renderTab = () => {
    switch (activeTab) {
      case "usuarios":  return <UsuariosTab />;
      case "tecnicos":  return <TecnicosTab />;
      case "citas":     return <CitasTab />;
      case "servicios": return <ServiciosTab />;
      case "productos": return <ProductosTab />;
      default:          return null;
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-title">Panel de Administración</h1>
        <p className="admin-subtitle">Gestiona todos los aspectos del taller desde aquí</p>
      </div>

      <nav className="admin-tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      <div className="admin-content">
        {renderTab()}
      </div>
    </div>
  );
};

export default AdminPage;