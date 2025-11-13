import React, { useState } from "react";
import data from "../../data.json";
import ModalStock from "./ModalStock";
import ModalReserva from "./ModalReserva";

export function Tratamientos() {
  const [stockSeleccionado, setStockSeleccionado] = useState(null);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const tratamientos = data.tratamientos;

  return (
    <div className="tratamientos-page">
      <header className="header-container">
        <h1>Nuestros Tratamientos de Estética ✨</h1>
        <p>Consulta precios, insumos necesarios y agenda tu cita.</p>
      </header>

      <div className="tratamientos-grid">
        {tratamientos.map((t) => (
          <div className="card" key={t.id}>
            <h4 className="card-title">{t.nombre}</h4>
            <p className="card-price">
              {t.precio.toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumFractionDigits: 0,
              })}
            </p>

            <div className="card-details">
              <p>
                <span>⏱️</span> Duración: <b>{t.duracionMinutos} min</b>
              </p>
              <p>
                <span>💳</span> Pago: {t.formasDePago.join(", ")}
              </p>
            </div>

            <div className="card-actions">
              <button
                onClick={() => setReservaSeleccionada(t)}
                className="btn-primary"
              >
                Reservar 🗓️
              </button>
              <button
                onClick={() => setStockSeleccionado(t)}
                className="btn-secondary"
              >
                Ver Stock / Insumos
              </button>
            </div>
          </div>
        ))}
      </div>

      {stockSeleccionado && (
        <ModalStock
          tratamiento={stockSeleccionado}
          onClose={() => setStockSeleccionado(null)}
        />
      )}

      {reservaSeleccionada && (
        <ModalReserva
          tratamiento={reservaSeleccionada}
          onClose={() => setReservaSeleccionada(null)}
        />
      )}
    </div>
  );
}
