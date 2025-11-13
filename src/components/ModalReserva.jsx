import React, { useState } from "react";

const ModalReserva = ({ tratamiento, onClose }) => {
  const [form, setForm] = useState({
    cliente_nombre: "",
    cliente_email: "",
    cliente_telefono: "",
    preferencia_fecha: "",
  });

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAuth = async () => {
    // 🔗 Redirige al flujo OAuth2 de tu backend Flask
    window.location.href = "http://localhost:5000/authorize";
  };

  const handleReserva = async () => {
    setLoading(true);
    setMensaje("");

    const body = {
      ...form,
      tratamiento_nombre: tratamiento.nombre,
      duracion_minutos: tratamiento.duracionMinutos,
      preferencia_fecha: form.preferencia_fecha,
    };

    try {
      const res = await fetch("http://localhost:5000/api/reservar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        setMensaje("✅ Reserva creada con éxito en ambos calendarios.");
      } else {
        setMensaje("⚠️ " + (data.message || "Error al crear la reserva."));
      }
    } catch (err) {
      setMensaje("❌ Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Reservar: {tratamiento.nombre}</h3>
          <button onClick={onClose} className="modal-close-btn">
            &times;
          </button>
        </div>

        <div className="modal-body">
          <label>
            Nombre:
            <input
              type="text"
              name="cliente_nombre"
              value={form.cliente_nombre}
              onChange={handleChange}
            />
          </label>

          <label>
            Email:
            <input
              type="email"
              name="cliente_email"
              value={form.cliente_email}
              onChange={handleChange}
            />
          </label>

          <label>
            Teléfono:
            <input
              type="text"
              name="cliente_telefono"
              value={form.cliente_telefono}
              onChange={handleChange}
            />
          </label>

          <label>
            Fecha y hora:
            <input
              type="datetime-local"
              name="preferencia_fecha"
              value={form.preferencia_fecha}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="modal-footer">
          {!loading && (
            <>
              <button onClick={handleAuth} className="btn-secondary">
                Conectar con Google
              </button>
              <button onClick={handleReserva} className="btn-primary">
                Confirmar Reserva
              </button>
            </>
          )}
          {loading && <p>⏳ Procesando reserva...</p>}
          {mensaje && <p>{mensaje}</p>}
        </div>
      </div>
    </div>
  );
};

export default ModalReserva;
