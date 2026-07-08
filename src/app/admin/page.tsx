"use client";

import React, { useState, useEffect } from "react";
import { 
  getStoredSpecialties, saveSpecialties, Specialty,
  getStoredDestinations, saveDestinations, Destination,
  getStoredBlogPosts, saveBlogPosts, BlogPost
} from "@/lib/db";
import { useLanguage } from "@/context/LanguageContext";

type AdminTab = "specialties" | "destinations" | "blog" | "leads";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  message: string;
  date: string;
  status: "nuevo" | "contactado" | "archivado";
  adminNotes?: string;
}

export default function AdminPanel() {
  const { language, t } = useLanguage();
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState<AdminTab>("specialties");
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);

  // Leads search & filters
  const [searchLeadQuery, setSearchLeadQuery] = useState("");
  const [filterLeadStatus, setFilterLeadStatus] = useState("all");
  const [filterLeadSpec, setFilterLeadSpec] = useState("all");
  const [activeLeadNotes, setActiveLeadNotes] = useState<Record<string, string>>({});

  const [mounted, setMounted] = useState(false);

  // Form States
  const [editingId, setEditingId] = useState<string | null>(null);

  // Specialty Form Fields
  const [specForm, setSpecForm] = useState({
    name: "",
    nameEn: "",
    description: "",
    descriptionEn: "",
    fullDescription: "",
    fullDescriptionEn: "",
    procedures: "",
    proceduresEn: "",
    avgCostColombia: "",
    avgCostUS: "",
    recoveryDays: "",
    recoveryDaysEn: "",
    clinics: "",
    image: ""
  });

  // Destination Form Fields
  const [destForm, setDestForm] = useState({
    name: "",
    description: "",
    descriptionEn: "",
    clinics: "",
    climate: "",
    climateEn: "",
    tourism: "",
    tourismEn: "",
    costOfLiving: "",
    costOfLivingEn: "",
    airConnectivity: "",
    airConnectivityEn: "",
    image: ""
  });

  // Blog Form Fields
  const [blogForm, setBlogForm] = useState({
    title: "",
    titleEn: "",
    excerpt: "",
    excerptEn: "",
    content: "",
    contentEn: "",
    author: "",
    category: "",
    categoryEn: ""
  });

  useEffect(() => {
    setMounted(true);
    
    // Check URL query parameters or localStorage for existing authentication
    const searchParams = new URLSearchParams(window.location.search);
    const hasKey = searchParams.get("key") === "admin";
    const isLocalAuth = localStorage.getItem("bc_admin_auth") === "true";

    if (hasKey || isLocalAuth) {
      setIsAuthenticated(true);
      if (hasKey) {
        localStorage.setItem("bc_admin_auth", "true");
      }
    }

    setSpecialties(getStoredSpecialties());
    setDestinations(getStoredDestinations());
    setBlogPosts(getStoredBlogPosts());

    const loadLeads = () => {
      const storedLeads = localStorage.getItem("bc_leads");
      if (storedLeads) {
        try {
          const parsed = JSON.parse(storedLeads);
          setLeads(parsed);
          
          const notesMap: Record<string, string> = {};
          parsed.forEach((l: Lead) => {
            notesMap[l.id] = l.adminNotes || "";
          });
          setActiveLeadNotes(notesMap);
        } catch (e) {
          console.error("Error reading stored leads:", e);
        }
      }
    };
    loadLeads();

    const handleUpdate = () => {
      loadLeads();
      setSpecialties(getStoredSpecialties());
      setDestinations(getStoredDestinations());
      setBlogPosts(getStoredBlogPosts());
    };
    window.addEventListener("bc_db_update", handleUpdate);
    return () => window.removeEventListener("bc_db_update", handleUpdate);
  }, []);

  const updateLeadStatus = (leadId: string, status: "nuevo" | "contactado" | "archivado") => {
    const list = [...leads];
    const idx = list.findIndex(l => l.id === leadId);
    if (idx > -1) {
      list[idx] = { ...list[idx], status };
      setLeads(list);
      localStorage.setItem("bc_leads", JSON.stringify(list));
      window.dispatchEvent(new Event("bc_db_update"));
    }
  };

  const updateLeadNotes = (leadId: string, notes: string) => {
    const list = [...leads];
    const idx = list.findIndex(l => l.id === leadId);
    if (idx > -1) {
      list[idx] = { ...list[idx], adminNotes: notes };
      setLeads(list);
      localStorage.setItem("bc_leads", JSON.stringify(list));
      window.dispatchEvent(new Event("bc_db_update"));
      alert("Nota de seguimiento guardada correctamente.");
    }
  };

  const deleteLead = (leadId: string) => {
    if (confirm("¿Estás seguro de eliminar permanentemente este registro de contacto?")) {
      const updated = leads.filter(l => l.id !== leadId);
      setLeads(updated);
      localStorage.setItem("bc_leads", JSON.stringify(updated));
      window.dispatchEvent(new Event("bc_db_update"));
    }
  };

  const exportLeadsToCSV = () => {
    if (leads.length === 0) {
      alert("No hay leads registrados para exportar.");
      return;
    }
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Fecha,Nombre,Email,WhatsApp,Especialidad,Estado,Mensaje,Notas del Administrador\n";
    
    leads.forEach((lead) => {
      const specName = specialties.find(s => s.id === lead.specialty)?.name || lead.specialty;
      const row = [
        lead.id,
        lead.date,
        `"${lead.name.replace(/"/g, '""')}"`,
        `"${lead.email.replace(/"/g, '""')}"`,
        `"${lead.phone.replace(/"/g, '""')}"`,
        `"${specName.replace(/"/g, '""')}"`,
        lead.status,
        `"${lead.message.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
        `"${(lead.adminNotes || "").replace(/"/g, '""').replace(/\n/g, ' ')}"`
      ].join(",");
      csvContent += row + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leads_bridge_care_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "BridgeAdmin2026") {
      setIsAuthenticated(true);
      setAuthError("");
      localStorage.setItem("bc_admin_auth", "true");
    } else {
      setAuthError(t("lock.error"));
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("bc_admin_auth");
  };

  // Helper to convert text to URL slug
  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove accents
      .replace(/\s+/g, "-") // replace spaces with -
      .replace(/[^\w\-]+/g, "") // remove non-word chars
      .replace(/\-\-+/g, "-") // replace multiple -
      .replace(/^-+/, "") // trim leading -
      .replace(/-+$/, ""); // trim trailing -
  };

  // --- SPECIALTIES CRUD ---
  const handleSpecSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const list = [...specialties];
    const proceduresArray = specForm.procedures.split(",").map(p => p.trim()).filter(p => p !== "");
    const proceduresEnArray = specForm.proceduresEn.split(",").map(p => p.trim()).filter(p => p !== "");
    const clinicsArray = specForm.clinics.split(",").map(c => c.trim()).filter(c => c !== "");

    if (editingId) {
      // Edit
      const index = list.findIndex(s => s.id === editingId);
      if (index > -1) {
        list[index] = {
          ...list[index],
          name: specForm.name,
          nameEn: specForm.nameEn || specForm.name,
          description: specForm.description,
          descriptionEn: specForm.descriptionEn || specForm.description,
          fullDescription: specForm.fullDescription,
          fullDescriptionEn: specForm.fullDescriptionEn || specForm.fullDescription,
          procedures: proceduresArray,
          proceduresEn: proceduresEnArray.length > 0 ? proceduresEnArray : proceduresArray,
          avgCostColombia: specForm.avgCostColombia,
          avgCostUS: specForm.avgCostUS,
          recoveryDays: specForm.recoveryDays,
          recoveryDaysEn: specForm.recoveryDaysEn || specForm.recoveryDays,
          clinics: clinicsArray,
          image: specForm.image || "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80&w=800"
        };
      }
    } else {
      // Add
      const newId = slugify(specForm.name);
      if (list.some(s => s.id === newId)) {
        alert("Ya existe una especialidad con este nombre o ID generado.");
        return;
      }
      list.push({
        id: newId,
        name: specForm.name,
        nameEn: specForm.nameEn || specForm.name,
        description: specForm.description,
        descriptionEn: specForm.descriptionEn || specForm.description,
        fullDescription: specForm.fullDescription,
        fullDescriptionEn: specForm.fullDescriptionEn || specForm.fullDescription,
        procedures: proceduresArray,
        proceduresEn: proceduresEnArray.length > 0 ? proceduresEnArray : proceduresArray,
        avgCostColombia: specForm.avgCostColombia,
        avgCostUS: specForm.avgCostUS,
        recoveryDays: specForm.recoveryDays,
        recoveryDaysEn: specForm.recoveryDaysEn || specForm.recoveryDays,
        clinics: clinicsArray,
        image: specForm.image || "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80&w=800"
      });
    }

    saveSpecialties(list);
    setSpecialties(list);
    resetSpecForm();
  };

  const startEditSpec = (spec: Specialty) => {
    setEditingId(spec.id);
    setSpecForm({
      name: spec.name,
      nameEn: spec.nameEn || "",
      description: spec.description,
      descriptionEn: spec.descriptionEn || "",
      fullDescription: spec.fullDescription,
      fullDescriptionEn: spec.fullDescriptionEn || "",
      procedures: spec.procedures.join(", "),
      proceduresEn: (spec.proceduresEn || []).join(", "),
      avgCostColombia: spec.avgCostColombia,
      avgCostUS: spec.avgCostUS,
      recoveryDays: spec.recoveryDays,
      recoveryDaysEn: spec.recoveryDaysEn || "",
      clinics: spec.clinics.join(", "),
      image: spec.image
    });
  };

  const deleteSpec = (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta especialidad?")) {
      const updated = specialties.filter(s => s.id !== id);
      saveSpecialties(updated);
      setSpecialties(updated);
      if (editingId === id) resetSpecForm();
    }
  };

  const resetSpecForm = () => {
    setEditingId(null);
    setSpecForm({
      name: "",
      nameEn: "",
      description: "",
      descriptionEn: "",
      fullDescription: "",
      fullDescriptionEn: "",
      procedures: "",
      proceduresEn: "",
      avgCostColombia: "",
      avgCostUS: "",
      recoveryDays: "",
      recoveryDaysEn: "",
      clinics: "",
      image: ""
    });
  };


  // --- DESTINATIONS CRUD ---
  const handleDestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const list = [...destinations];
    const clinicsArray = destForm.clinics.split(",").map(c => c.trim()).filter(c => c !== "");

    if (editingId) {
      // Edit
      const index = list.findIndex(d => d.id === editingId);
      if (index > -1) {
        list[index] = {
          ...list[index],
          name: destForm.name,
          description: destForm.description,
          descriptionEn: destForm.descriptionEn || destForm.description,
          clinics: clinicsArray,
          climate: destForm.climate,
          climateEn: destForm.climateEn || destForm.climate,
          tourism: destForm.tourism,
          tourismEn: destForm.tourismEn || destForm.tourism,
          costOfLiving: destForm.costOfLiving,
          costOfLivingEn: destForm.costOfLivingEn || destForm.costOfLiving,
          airConnectivity: destForm.airConnectivity,
          airConnectivityEn: destForm.airConnectivityEn || destForm.airConnectivity,
          image: destForm.image || "https://images.unsplash.com/photo-1596120202271-925206ee85cf?auto=format&fit=crop&q=80&w=800"
        };
      }
    } else {
      // Add
      const newId = slugify(destForm.name);
      if (list.some(d => d.id === newId)) {
        alert("Ya existe un destino con este nombre o ID generado.");
        return;
      }
      list.push({
        id: newId,
        name: destForm.name,
        description: destForm.description,
        descriptionEn: destForm.descriptionEn || destForm.description,
        clinics: clinicsArray,
        climate: destForm.climate,
        climateEn: destForm.climateEn || destForm.climate,
        tourism: destForm.tourism,
        tourismEn: destForm.tourismEn || destForm.tourism,
        costOfLiving: destForm.costOfLiving,
        costOfLivingEn: destForm.costOfLivingEn || destForm.costOfLiving,
        airConnectivity: destForm.airConnectivity,
        airConnectivityEn: destForm.airConnectivityEn || destForm.airConnectivity,
        image: destForm.image || "https://images.unsplash.com/photo-1596120202271-925206ee85cf?auto=format&fit=crop&q=80&w=800"
      });
    }

    saveDestinations(list);
    setDestinations(list);
    resetDestForm();
  };

  const startEditDest = (dest: Destination) => {
    setEditingId(dest.id);
    setDestForm({
      name: dest.name,
      description: dest.description,
      descriptionEn: dest.descriptionEn || "",
      clinics: dest.clinics.join(", "),
      climate: dest.climate,
      climateEn: dest.climateEn || "",
      tourism: dest.tourism,
      tourismEn: dest.tourismEn || "",
      costOfLiving: dest.costOfLiving,
      costOfLivingEn: dest.costOfLivingEn || "",
      airConnectivity: dest.airConnectivity,
      airConnectivityEn: dest.airConnectivityEn || "",
      image: dest.image
    });
  };

  const deleteDest = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este destino?")) {
      const updated = destinations.filter(d => d.id !== id);
      saveDestinations(updated);
      setDestinations(updated);
      if (editingId === id) resetDestForm();
    }
  };

  const resetDestForm = () => {
    setEditingId(null);
    setDestForm({
      name: "",
      description: "",
      descriptionEn: "",
      clinics: "",
      climate: "",
      climateEn: "",
      tourism: "",
      tourismEn: "",
      costOfLiving: "",
      costOfLivingEn: "",
      airConnectivity: "",
      airConnectivityEn: "",
      image: ""
    });
  };


  // --- BLOG CRUD ---
  const handleBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const list = [...blogPosts];

    if (editingId) {
      // Edit
      const index = list.findIndex(b => b.id === editingId);
      if (index > -1) {
        list[index] = {
          ...list[index],
          title: blogForm.title,
          titleEn: blogForm.titleEn || blogForm.title,
          excerpt: blogForm.excerpt,
          excerptEn: blogForm.excerptEn || blogForm.excerpt,
          content: blogForm.content,
          contentEn: blogForm.contentEn || blogForm.content,
          author: blogForm.author,
          category: blogForm.category,
          categoryEn: blogForm.categoryEn || blogForm.category,
        };
      }
    } else {
      // Add
      const newId = slugify(blogForm.title);
      if (list.some(b => b.id === newId)) {
        alert("Ya existe un artículo con este título.");
        return;
      }
      list.push({
        id: newId,
        title: blogForm.title,
        titleEn: blogForm.titleEn || blogForm.title,
        excerpt: blogForm.excerpt,
        excerptEn: blogForm.excerptEn || blogForm.excerpt,
        content: blogForm.content,
        contentEn: blogForm.contentEn || blogForm.content,
        author: blogForm.author,
        category: blogForm.category,
        categoryEn: blogForm.categoryEn || blogForm.category,
        date: new Date().toISOString().split("T")[0]
      });
    }

    saveBlogPosts(list);
    setBlogPosts(list);
    resetBlogForm();
  };

  const startEditBlog = (post: BlogPost) => {
    setEditingId(post.id);
    setBlogForm({
      title: post.title,
      titleEn: post.titleEn || "",
      excerpt: post.excerpt,
      excerptEn: post.excerptEn || "",
      content: post.content,
      contentEn: post.contentEn || "",
      author: post.author,
      category: post.category,
      categoryEn: post.categoryEn || ""
    });
  };

  const deleteBlog = (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta nota de blog?")) {
      const updated = blogPosts.filter(b => b.id !== id);
      saveBlogPosts(updated);
      setBlogPosts(updated);
      if (editingId === id) resetBlogForm();
    }
  };

  const resetBlogForm = () => {
    setEditingId(null);
    setBlogForm({
      title: "",
      titleEn: "",
      excerpt: "",
      excerptEn: "",
      content: "",
      contentEn: "",
      author: "",
      category: "",
      categoryEn: ""
    });
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchLeadQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchLeadQuery.toLowerCase()) ||
      lead.phone.includes(searchLeadQuery);
    
    const matchesStatus = filterLeadStatus === "all" || lead.status === filterLeadStatus;
    
    const matchesSpec = filterLeadSpec === "all" || lead.specialty === filterLeadSpec;
    
    return matchesSearch && matchesStatus && matchesSpec;
  });

  if (!mounted) return null;

  // Render LOCK SCREEN if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="lock-screen-wrapper">
        <div className="glass-card lock-card text-center">
          <div className="lock-icon">🔒</div>
          <h2>{t("lock.title")}</h2>
          <p>{t("lock.desc")}</p>
          
          <form onSubmit={handleLoginSubmit} className="mt-2">
            <div className="form-group">
              <input 
                type="password" 
                required 
                className="form-control text-center" 
                placeholder={t("lock.password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {authError && <p className="error-text">{authError}</p>}
            <button type="submit" className="btn btn-accent w-full bold-btn mt-1">
              {t("lock.submit")}
            </button>
          </form>
        </div>

        <style jsx>{`
          .lock-screen-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 80vh;
            padding: 2rem;
            position: relative;
          }
          .lock-card {
            max-width: 420px;
            width: 100%;
            padding: 3rem 2rem;
            box-shadow: 0 15px 40px rgba(0,0,0,0.5);
          }
          .lock-icon {
            font-size: 3rem;
            margin-bottom: 1.5rem;
          }
          h2 {
            color: var(--white);
            font-size: 1.6rem;
            margin-bottom: 0.5rem;
          }
          p {
            color: var(--gris-texto);
            font-size: 0.95rem;
            margin-bottom: 1.5rem;
          }
          .error-text {
            color: #ff6b6b;
            font-size: 0.85rem;
            margin: 0.5rem 0;
          }
          .w-full {
            width: 100%;
          }
          .bold-btn {
            font-weight: 700;
          }
          .mt-1 {
            margin-top: 0.5rem;
          }
          .text-center {
            text-align: center;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="admin-dashboard container">
      <div className="glow-sphere glow-1"></div>

      <div className="admin-header text-center">
        <h1>Panel de Administración</h1>
        <p>Gestiona las especialidades médicas, los destinos turísticos y las entradas de blog.</p>
        <button className="btn btn-secondary logout-btn" onClick={handleLogout}>
          Cerrar Sesión 🔓
        </button>
        <div className="header-bar"></div>
      </div>

      {/* Tabs list */}
      <div className="admin-tabs glass-card">
        <button 
          className={`admin-tab-btn ${activeTab === "specialties" ? "active" : ""}`}
          onClick={() => { setActiveTab("specialties"); resetSpecForm(); }}
        >
          Especialidades ({specialties.length})
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === "destinations" ? "active" : ""}`}
          onClick={() => { setActiveTab("destinations"); resetDestForm(); }}
        >
          Destinos / Ciudades ({destinations.length})
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === "blog" ? "active" : ""}`}
          onClick={() => { setActiveTab("blog"); resetBlogForm(); }}
        >
          Blog / Noticias ({blogPosts.length})
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === "leads" ? "active" : ""}`}
          onClick={() => { setActiveTab("leads"); }}
        >
          Leads / Contactos ({leads.length})
        </button>
      </div>

      {/* Admin Grid Layout or Leads Dashboard */}
      {activeTab === "leads" ? (
        <div className="leads-dashboard glass-card card mt-3" style={{ padding: "2.5rem" }}>
          <div className="leads-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h2 style={{ fontSize: "1.6rem", color: "var(--white)", borderBottom: "none", paddingBottom: 0, marginBottom: "0.25rem" }}>
                Leads de Contacto ({filteredLeads.length} filtrados)
              </h2>
              <p className="small-text" style={{ margin: 0, fontSize: "0.85rem", color: "var(--gris-texto)" }}>
                Visualiza y gestiona las solicitudes de contacto y valoraciones virtuales recibidas.
              </p>
            </div>
            <button className="btn btn-primary" onClick={exportLeadsToCSV}>
              Exportar CSV 📥
            </button>
          </div>

          {/* Search & Filters */}
          <div className="leads-filters" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: "0.8rem", marginBottom: "0.25rem" }}>Buscar paciente</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Nombre, email o teléfono..." 
                value={searchLeadQuery} 
                onChange={(e) => setSearchLeadQuery(e.target.value)} 
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: "0.8rem", marginBottom: "0.25rem" }}>Estado</label>
              <select 
                className="form-control" 
                value={filterLeadStatus} 
                onChange={(e) => setFilterLeadStatus(e.target.value)}
              >
                <option value="all">Todos los estados</option>
                <option value="nuevo">Nuevo</option>
                <option value="contactado">Contactado</option>
                <option value="archivado">Archivado</option>
              </select>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: "0.8rem", marginBottom: "0.25rem" }}>Especialidad</label>
              <select 
                className="form-control" 
                value={filterLeadSpec} 
                onChange={(e) => setFilterLeadSpec(e.target.value)}
              >
                <option value="all">Todas las especialidades</option>
                {specialties.map(spec => (
                  <option key={spec.id} value={spec.id}>{language === "es" ? spec.name : spec.nameEn}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Leads List */}
          <div className="leads-list-wrapper" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {filteredLeads.length === 0 ? (
              <div className="text-center" style={{ padding: "4rem 2rem", color: "var(--gris-texto)" }}>
                <p style={{ fontSize: "1.15rem", fontWeight: "bold", marginBottom: "0.5rem" }}>No se encontraron leads.</p>
                <p style={{ fontSize: "0.9rem", margin: 0 }}>Intenta cambiar los filtros o el término de búsqueda.</p>
              </div>
            ) : (
              filteredLeads.map((lead) => {
                const specName = specialties.find(s => s.id === lead.specialty)?.name || lead.specialty;
                const specNameEn = specialties.find(s => s.id === lead.specialty)?.nameEn || lead.specialty;
                const cleanPhone = lead.phone.replace(/[^0-9+]/g, "");
                
                return (
                  <div key={lead.id} className="lead-card-item" style={{ 
                    padding: "1.75rem", 
                    borderRadius: "var(--radius-md)", 
                    backgroundColor: "rgba(15, 17, 17, 0.4)",
                    border: "1px solid rgba(255, 255, 255, 0.06)", 
                    position: "relative" 
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
                      <div>
                        <span className={`status-badge status-${lead.status}`}>
                          {lead.status}
                        </span>
                        <span style={{ fontSize: "0.8rem", color: "var(--gris-texto)" }}>{lead.date}</span>
                      </div>
                      <div>
                        <span className="badge" style={{ margin: 0 }}>ID: {lead.id}</span>
                      </div>
                    </div>

                    <div className="grid grid-2" style={{ gap: "1.5rem", marginBottom: "1.5rem" }}>
                      {/* Personal Info */}
                      <div>
                        <h4 style={{ margin: "0 0 0.5rem 0", color: "var(--white)", fontSize: "1.15rem" }}>{lead.name}</h4>
                        <p style={{ margin: "0 0 0.35rem 0", fontSize: "0.85rem", color: "var(--gris-texto)" }}>
                          📧 <a href={`mailto:${lead.email}`} style={{ color: "var(--mint-accent)", textDecoration: "underline" }}>{lead.email}</a>
                        </p>
                        <p style={{ margin: "0", fontSize: "0.85rem", color: "var(--gris-texto)" }}>
                          💬 <a href={`https://wa.me/${cleanPhone.replace("+", "")}`} target="_blank" rel="noopener noreferrer" style={{ color: "#25D366", fontWeight: "bold" }}>
                            {lead.phone} (WhatsApp)
                          </a>
                        </p>
                      </div>

                      {/* Request Details */}
                      <div>
                        <h5 style={{ margin: "0 0 0.25rem 0", color: "var(--white)", fontWeight: "600", fontSize: "0.9rem" }}>
                          Especialidad de Interés:
                        </h5>
                        <p style={{ color: "var(--mint-accent)", fontWeight: "bold", fontSize: "0.9rem", margin: "0 0 0.75rem 0" }}>
                          {language === "es" ? specName : specNameEn}
                        </p>
                        <h5 style={{ margin: "0 0 0.25rem 0", color: "var(--white)", fontWeight: "600", fontSize: "0.9rem" }}>Mensaje del paciente:</h5>
                        <p style={{ fontStyle: "italic", margin: 0, fontSize: "0.85rem", color: "var(--gris-texto)", lineHeight: "1.5" }}>
                          "{lead.message}"
                        </p>
                      </div>
                    </div>

                    {/* Admin Actions and Notes */}
                    <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "1.25rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", alignItems: "end" }}>
                      <div>
                        <label className="form-label" style={{ marginBottom: "0.35rem", fontSize: "0.8rem" }}>Cambiar Estado</label>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <select 
                            className="form-control" 
                            value={lead.status} 
                            onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                            style={{ padding: "0.45rem 0.75rem", fontSize: "0.85rem" }}
                          >
                            <option value="nuevo">Nuevo</option>
                            <option value="contactado">Contactado</option>
                            <option value="archivado">Archivado</option>
                          </select>
                          <button className="btn btn-secondary btn-xs" onClick={() => deleteLead(lead.id)} style={{ padding: "0.45rem 0.95rem", backgroundColor: "#ff4d4d", color: "#fff", borderColor: "transparent" }}>
                            Eliminar
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="form-label" style={{ marginBottom: "0.35rem", fontSize: "0.8rem" }}>Notas de Seguimiento Administrativo</label>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Notas de llamada, cotización, etc..." 
                            value={activeLeadNotes[lead.id] || ""} 
                            onChange={(e) => setActiveLeadNotes({ ...activeLeadNotes, [lead.id]: e.target.value })}
                            style={{ fontSize: "0.85rem", padding: "0.45rem 0.75rem" }}
                          />
                          <button 
                            className="btn btn-accent btn-xs" 
                            onClick={() => updateLeadNotes(lead.id, activeLeadNotes[lead.id] || "")}
                            style={{ padding: "0.45rem 0.95rem", flexShrink: 0 }}
                          >
                            Guardar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        <div className="admin-grid mt-3">
        
        {/* Form Column */}
        <div className="form-panel glass-card card">
          <h2>{editingId ? `Editar ${activeTab === "specialties" ? "Especialidad" : activeTab === "destinations" ? "Destino" : "Artículo"}` : `Agregar ${activeTab === "specialties" ? "Especialidad" : activeTab === "destinations" ? "Destino" : "Artículo"}`}</h2>
          
          {/* SPECIALTY FORM */}
          {activeTab === "specialties" && (
            <form onSubmit={handleSpecSubmit} className="mt-2">
              <div className="grid grid-2" style={{ gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">Nombre de Especialidad (ES)</label>
                  <input 
                    type="text" required className="form-control" placeholder="Ej. Cirugía estética"
                    value={specForm.name} onChange={(e) => setSpecForm({...specForm, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Specialty Name (EN)</label>
                  <input 
                    type="text" required className="form-control" placeholder="Ej. Aesthetic Surgery"
                    value={specForm.nameEn} onChange={(e) => setSpecForm({...specForm, nameEn: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-2" style={{ gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">Descripción Corta (ES)</label>
                  <input 
                    type="text" required className="form-control" placeholder="Ej. Procedimientos plásticos..."
                    value={specForm.description} onChange={(e) => setSpecForm({...specForm, description: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Short Description (EN)</label>
                  <input 
                    type="text" required className="form-control" placeholder="Ej. High-quality plastic..."
                    value={specForm.descriptionEn} onChange={(e) => setSpecForm({...specForm, descriptionEn: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Descripción Detallada (ES)</label>
                <textarea 
                  required className="form-control" rows={2} placeholder="Describa el servicio..."
                  value={specForm.fullDescription} onChange={(e) => setSpecForm({...specForm, fullDescription: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Description (EN)</label>
                <textarea 
                  required className="form-control" rows={2} placeholder="Describe the service..."
                  value={specForm.fullDescriptionEn} onChange={(e) => setSpecForm({...specForm, fullDescriptionEn: e.target.value})}
                />
              </div>

              <div className="grid grid-2" style={{ gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">Procedimientos Incluidos (ES, separados por coma)</label>
                  <input 
                    type="text" required className="form-control" placeholder="Rinoplastia, Liposucción"
                    value={specForm.procedures} onChange={(e) => setSpecForm({...specForm, procedures: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Included Procedures (EN, comma separated)</label>
                  <input 
                    type="text" required className="form-control" placeholder="Rhinoplasty, Liposuction"
                    value={specForm.proceduresEn} onChange={(e) => setSpecForm({...specForm, proceduresEn: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-2" style={{ gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">Costo Promedio Col ($ USD)</label>
                  <input 
                    type="text" required className="form-control" placeholder="Ej. $3,500 USD"
                    value={specForm.avgCostColombia} onChange={(e) => setSpecForm({...specForm, avgCostColombia: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Costo Promedio EE. UU. ($ USD)</label>
                  <input 
                    type="text" required className="form-control" placeholder="Ej. $12,000 USD"
                    value={specForm.avgCostUS} onChange={(e) => setSpecForm({...specForm, avgCostUS: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-2" style={{ gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">Tiempo de Recuperación (ES)</label>
                  <input 
                    type="text" required className="form-control" placeholder="Ej. 7 - 10 días"
                    value={specForm.recoveryDays} onChange={(e) => setSpecForm({...specForm, recoveryDays: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Recovery Time (EN)</label>
                  <input 
                    type="text" required className="form-control" placeholder="Ej. 7 - 10 days"
                    value={specForm.recoveryDaysEn} onChange={(e) => setSpecForm({...specForm, recoveryDaysEn: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Clínicas Aliadas (Separadas por coma)</label>
                <input 
                  type="text" required className="form-control" placeholder="Clínica El Tesoro, DentiCare VIP"
                  value={specForm.clinics} onChange={(e) => setSpecForm({...specForm, clinics: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="form-label">URL de Imagen (Unsplash u otra)</label>
                <input 
                  type="text" className="form-control" placeholder="Ej. https://..."
                  value={specForm.image} onChange={(e) => setSpecForm({...specForm, image: e.target.value})}
                />
              </div>

              <div className="form-buttons mt-2">
                <button type="submit" className="btn btn-accent">Guardar Especialidad</button>
                {editingId && <button type="button" className="btn btn-secondary" onClick={resetSpecForm}>Cancelar</button>}
              </div>
            </form>
          )}

          {/* DESTINATION FORM */}
          {activeTab === "destinations" && (
            <form onSubmit={handleDestSubmit} className="mt-2">
              <div className="form-group">
                <label className="form-label">Nombre de la Ciudad</label>
                <input 
                  type="text" required className="form-control" placeholder="Ej. Medellín"
                  value={destForm.name} onChange={(e) => setDestForm({...destForm, name: e.target.value})}
                />
              </div>

              <div className="grid grid-2" style={{ gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">Descripción (ES)</label>
                  <textarea 
                    required className="form-control" rows={2} placeholder="Descripción..."
                    value={destForm.description} onChange={(e) => setDestForm({...destForm, description: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description (EN)</label>
                  <textarea 
                    required className="form-control" rows={2} placeholder="Description..."
                    value={destForm.descriptionEn} onChange={(e) => setDestForm({...destForm, descriptionEn: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Clínicas Aliadas en la Ciudad (Separadas por coma)</label>
                <input 
                  type="text" required className="form-control" placeholder="Clínica Las Américas, Hospital Pablo Tobón"
                  value={destForm.clinics} onChange={(e) => setDestForm({...destForm, clinics: e.target.value})}
                />
              </div>

              <div className="grid grid-2" style={{ gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">Clima Promedio (ES)</label>
                  <input 
                    type="text" required className="form-control" placeholder="Ej. Templado, 22°C promedio."
                    value={destForm.climate} onChange={(e) => setDestForm({...destForm, climate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Climate (EN)</label>
                  <input 
                    type="text" required className="form-control" placeholder="Ej. Temperate, 22°C average."
                    value={destForm.climateEn} onChange={(e) => setDestForm({...destForm, climateEn: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-2" style={{ gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">Sitios Turísticos Clave (ES)</label>
                  <input 
                    type="text" required className="form-control" placeholder="Ej. Plaza Botero, Parque Arví..."
                    value={destForm.tourism} onChange={(e) => setDestForm({...destForm, tourism: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tourist Hotspots (EN)</label>
                  <input 
                    type="text" required className="form-control" placeholder="Ej. Botero Square, Arvi Park..."
                    value={destForm.tourismEn} onChange={(e) => setDestForm({...destForm, tourismEn: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-2" style={{ gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">Costo de Vida Relativo (ES)</label>
                  <input 
                    type="text" required className="form-control" placeholder="Ej. Bajo (65% menor que EE. UU.)"
                    value={destForm.costOfLiving} onChange={(e) => setDestForm({...destForm, costOfLiving: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Relative Cost of Living (EN)</label>
                  <input 
                    type="text" required className="form-control" placeholder="Ej. Low (65% lower than US)"
                    value={destForm.costOfLivingEn} onChange={(e) => setDestForm({...destForm, costOfLivingEn: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-2" style={{ gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">Conectividad Aérea (ES)</label>
                  <input 
                    type="text" required className="form-control" placeholder="Ej. Aeropuerto MDE..."
                    value={destForm.airConnectivity} onChange={(e) => setDestForm({...destForm, airConnectivity: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Air Connectivity (EN)</label>
                  <input 
                    type="text" required className="form-control" placeholder="Ej. MDE Airport..."
                    value={destForm.airConnectivityEn} onChange={(e) => setDestForm({...destForm, airConnectivityEn: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">URL de Imagen</label>
                <input 
                  type="text" className="form-control" placeholder="Ej. https://..."
                  value={destForm.image} onChange={(e) => setDestForm({...destForm, image: e.target.value})}
                />
              </div>

              <div className="form-buttons mt-2">
                <button type="submit" className="btn btn-accent">Guardar Destino</button>
                {editingId && <button type="button" className="btn btn-secondary" onClick={resetDestForm}>Cancelar</button>}
              </div>
            </form>
          )}

          {/* BLOG FORM */}
          {activeTab === "blog" && (
            <form onSubmit={handleBlogSubmit} className="mt-2">
              <div className="grid grid-2" style={{ gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">Título del Artículo (ES)</label>
                  <input 
                    type="text" required className="form-control" placeholder="Ej. Guía de recuperación..."
                    value={blogForm.title} onChange={(e) => setBlogForm({...blogForm, title: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Article Title (EN)</label>
                  <input 
                    type="text" required className="form-control" placeholder="Ej. Recovery guide..."
                    value={blogForm.titleEn} onChange={(e) => setBlogForm({...blogForm, titleEn: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-2" style={{ gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">Resumen / Excerpt (ES)</label>
                  <input 
                    type="text" required className="form-control" placeholder="Breve resumen..."
                    value={blogForm.excerpt} onChange={(e) => setBlogForm({...blogForm, excerpt: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Excerpt / Summary (EN)</label>
                  <input 
                    type="text" required className="form-control" placeholder="Brief summary..."
                    value={blogForm.excerptEn} onChange={(e) => setBlogForm({...blogForm, excerptEn: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Contenido Completo (ES)</label>
                <textarea 
                  required className="form-control" rows={3} placeholder="Redacte el cuerpo de la nota..."
                  value={blogForm.content} onChange={(e) => setBlogForm({...blogForm, content: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Full Content (EN)</label>
                <textarea 
                  required className="form-control" rows={3} placeholder="Write the article content..."
                  value={blogForm.contentEn} onChange={(e) => setBlogForm({...blogForm, contentEn: e.target.value})}
                />
              </div>

              <div className="grid grid-3" style={{ gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">Autor</label>
                  <input 
                    type="text" required className="form-control" placeholder="Ej. Dr. Carlos"
                    value={blogForm.author} onChange={(e) => setBlogForm({...blogForm, author: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Categoría (ES)</label>
                  <input 
                    type="text" required className="form-control" placeholder="Ej. Consejos"
                    value={blogForm.category} onChange={(e) => setBlogForm({...blogForm, category: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category (EN)</label>
                  <input 
                    type="text" required className="form-control" placeholder="Ej. Travel Tips"
                    value={blogForm.categoryEn} onChange={(e) => setBlogForm({...blogForm, categoryEn: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-buttons mt-2">
                <button type="submit" className="btn btn-accent">Guardar Artículo</button>
                {editingId && <button type="button" className="btn btn-secondary" onClick={resetBlogForm}>Cancelar</button>}
              </div>
            </form>
          )}

        </div>

        {/* List Column */}
        <div className="list-panel glass-card card">
          <h2>Lista de Elementos Existentes</h2>
          <p className="small-text">Los cambios se aplican de inmediato en la barra de navegación y páginas de la web.</p>
          
          <div className="list-container mt-2">
            
            {/* SPECIALTIES LIST */}
            {activeTab === "specialties" && specialties.map((spec) => (
              <div key={spec.id} className="list-item">
                <div className="item-details">
                  <h4>{language === "es" ? spec.name : spec.nameEn}</h4>
                  <span className="badge">ID: {spec.id}</span>
                  <p>{language === "es" ? spec.description : spec.descriptionEn}</p>
                </div>
                <div className="item-actions">
                  <button className="btn btn-primary btn-xs" onClick={() => startEditSpec(spec)}>Editar</button>
                  <button className="btn btn-secondary btn-xs" onClick={() => deleteSpec(spec.id)}>Eliminar</button>
                </div>
              </div>
            ))}

            {/* DESTINATIONS LIST */}
            {activeTab === "destinations" && destinations.map((dest) => (
              <div key={dest.id} className="list-item">
                <div className="item-details">
                  <h4>{dest.name}</h4>
                  <span className="badge">ID: {dest.id}</span>
                  <p>{language === "es" ? dest.description : dest.descriptionEn}</p>
                </div>
                <div className="item-actions">
                  <button className="btn btn-primary btn-xs" onClick={() => startEditDest(dest)}>Editar</button>
                  <button className="btn btn-secondary btn-xs" onClick={() => deleteDest(dest.id)}>Eliminar</button>
                </div>
              </div>
            ))}

            {/* BLOG LIST */}
            {activeTab === "blog" && blogPosts.map((post) => (
              <div key={post.id} className="list-item">
                <div className="item-details">
                  <h4>{language === "es" ? post.title : post.titleEn}</h4>
                  <span className="badge">{language === "es" ? post.category : post.categoryEn}</span>
                  <p>{language === "es" ? post.excerpt : post.excerptEn}</p>
                </div>
                <div className="item-actions">
                  <button className="btn btn-primary btn-xs" onClick={() => startEditBlog(post)}>Editar</button>
                  <button className="btn btn-secondary btn-xs" onClick={() => deleteBlog(post.id)}>Eliminar</button>
                </div>
              </div>
            ))}

          </div>
        </div>

      </div>
      )}

      <style jsx>{`
        .admin-dashboard {
          padding: 8rem 1.5rem 4rem 1.5rem;
          position: relative;
        }
        .glow-sphere {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          filter: blur(140px);
          opacity: 0.12;
          pointer-events: none;
          z-index: 0;
        }
        .glow-1 {
          background: var(--teal-primary);
          top: 20%;
          left: -100px;
        }

        .admin-header {
          margin-bottom: 3rem;
          position: relative;
        }
        .logout-btn {
          position: absolute;
          top: 0;
          right: 0;
          font-size: 0.8rem;
          padding: 0.45rem 1rem;
          border-radius: var(--radius-full);
        }
        .header-bar {
          width: 80px;
          height: 3px;
          background: linear-gradient(90deg, var(--teal-primary), var(--mint-accent));
          margin: 1rem auto;
          border-radius: 2px;
        }
        
        .admin-tabs {
          display: flex;
          justify-content: center;
          gap: 1rem;
          padding: 0.5rem;
          flex-wrap: wrap;
          background: rgba(15, 17, 17, 0.7) !important;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: var(--radius-full);
          margin-bottom: 2rem;
        }
        .admin-tabs:hover {
          transform: none;
        }
        .admin-tab-btn {
          border: none;
          background: transparent;
          font-family: inherit;
          font-size: 0.95rem;
          font-weight: 600;
          padding: 0.65rem 1.5rem;
          cursor: pointer;
          color: var(--gris-texto);
          border-radius: var(--radius-full);
          transition: var(--transition-fast);
        }
        .admin-tab-btn:hover {
          color: var(--mint-accent);
          background-color: rgba(93, 202, 165, 0.08);
        }
        .admin-tab-btn.active {
          background: linear-gradient(135deg, var(--teal-primary) 0%, var(--mint-accent) 100%);
          color: var(--negro-suave);
          font-weight: 700;
        }

        .admin-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 3rem;
          align-items: start;
        }
        
        .card {
          padding: 2.5rem;
        }
        .card:hover {
          transform: none;
        }
        .card h2 {
          font-size: 1.5rem;
          color: var(--white);
          border-bottom: 1px solid rgba(93, 202, 165, 0.15);
          padding-bottom: 0.75rem;
          margin-bottom: 1.5rem;
        }
        
        .form-buttons {
          display: flex;
          gap: 1rem;
        }
        
        .list-container {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          max-height: 700px;
          overflow-y: auto;
          padding-right: 0.5rem;
        }
        .list-item {
          background-color: rgba(15, 17, 17, 0.4);
          padding: 1.25rem;
          border-radius: var(--radius-md);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }
        .item-details h4 {
          font-size: 1.05rem;
          margin-bottom: 0.25rem;
          color: var(--white);
        }
        .item-details p {
          font-size: 0.8rem;
          margin-bottom: 0;
          color: var(--gris-texto);
          line-height: 1.4;
        }
        .badge {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--mint-accent);
          background-color: rgba(93, 202, 165, 0.1);
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-sm);
          margin-bottom: 0.5rem;
          border: 1px solid rgba(93, 202, 165, 0.2);
        }
        .item-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex-shrink: 0;
        }
        .btn-xs {
          font-size: 0.75rem;
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-full);
        }
        .small-text {
          font-size: 0.85rem;
          color: var(--gris-texto);
          margin-top: -1rem;
          margin-bottom: 1.5rem;
        }

        .mt-2 { margin-top: 1rem; }
        .mt-3 { margin-top: 1.5rem; }

        /* Leads Dashboard Styles */
        .status-badge {
          display: inline-block;
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-sm);
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          margin-right: 0.75rem;
        }
        .status-badge.status-nuevo {
          background-color: rgba(29, 122, 110, 0.1);
          color: var(--mint-accent);
          border: 1px solid rgba(29, 122, 110, 0.2);
        }
        .status-badge.status-contactado {
          background-color: rgba(93, 202, 165, 0.1);
          color: var(--teal-primary);
          border: 1px solid rgba(93, 202, 165, 0.2);
        }
        .status-badge.status-archivado {
          background-color: rgba(0, 0, 0, 0.05);
          color: var(--gris-texto);
          border: 1px solid rgba(0, 0, 0, 0.1);
        }
        .lead-card-item {
          transition: var(--transition-fast);
        }
        .lead-card-item:hover {
          border-color: rgba(29, 122, 110, 0.2) !important;
          box-shadow: var(--shadow-md);
        }

        @media (max-width: 992px) {
          .admin-grid {
            grid-template-columns: 1fr;
          }
          .logout-btn {
            position: static;
            display: block;
            margin: 1rem auto 0 auto;
          }
        }
      `}</style>
    </div>
  );
}
