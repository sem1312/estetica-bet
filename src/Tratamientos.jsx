import React, { useState } from 'react';
import data from '../data.json'; 

// =========================================================
// FUNCIÓN PARA REDIRECCIONAR A GOOGLE CALENDAR
// =========================================================
const handleGoogleCalendarRedirect = (tratamiento) => {
    const baseURL = 'https://calendar.google.com/calendar/r/eventedit';
    const title = encodeURIComponent(`Turno Estética: ${tratamiento.nombre}`);
    const details = encodeURIComponent(`¡Hola! Quisiera reservar este turno.\nTratamiento: ${tratamiento.nombre}\nDuración: ${tratamiento.duracionMinutos} min.`);
    const calendarURL = `${baseURL}?text=${title}&details=${details}&location=Tu%20Ubicación%20Estética`;
    window.open(calendarURL, '_blank');
};


// =========================================================
// MODAL PARA MOSTRAR STOCK / INSUMOS (con clases CSS)
// =========================================================
const ModalStock = ({ tratamiento, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Reservar: {tratamiento.nombre}</h3>
                    <button onClick={onClose} className="modal-close-btn">&times;</button>
                </div>

                <p className="text-md font-semibold mb-3">Insumos Necesarios:</p>
                <ul className="insumos-list">
                    {tratamiento.insumos && tratamiento.insumos.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                    {(!tratamiento.insumos || tratamiento.insumos.length === 0) && (
                         <li className="text-gray-500 italic">No hay insumos específicos listados.</li>
                    )}
                </ul>

                <p className="modal-status">
                    Estatus: {tratamiento.stock || "Stock disponible y verificado."}
                </p>
                
                <button 
                    onClick={onClose} 
                    className="btn-close-modal"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
};


// =========================================================
// TARJETA DE CADA TRATAMIENTO (con clases CSS)
// =========================================================
const TratamientoCard = ({ tratamiento, onVerStockClick }) => {
    const precioFormateado = tratamiento.precio.toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0
    });

    return (
        <div className="card">
            <div>
                <h4 className="card-title">{tratamiento.nombre}</h4>
                <p className="card-price">{precioFormateado}</p> 
            </div>
            
            <div className="card-details">
                <p><span>⏱️</span> Duración: **{tratamiento.duracionMinutos} min**</p>
                <p><span>💳</span> Pago: {tratamiento.formasDePago.join(', ')}</p>
            </div>
            
            <div className="card-actions">
                <button 
                    onClick={() => handleGoogleCalendarRedirect(tratamiento)}
                    className="btn-primary"
                >
                    Reservar y Abrir Google Calendar 🗓️
                </button>
                <button 
                    onClick={() => onVerStockClick(tratamiento)}
                    className="btn-secondary"
                >
                    Ver Stock / Insumos
                </button>
            </div>
        </div>
    );
};


// =========================================================
// COMPONENTE PRINCIPAL (EXPORTADO)
// =========================================================
export function Tratamientos() {
    const [stockSeleccionado, setStockSeleccionado] = useState(null); 
    const tratamientos = data.tratamientos;

    return (
        <div className="tratamientos-page">
            <header className="header-container">
                <h1>Nuestros Tratamientos de Estética ✨</h1>
                <p>Consulta precios, insumos necesarios y agenda tu cita.</p>
            </header>

            <div className="tratamientos-grid">
                {tratamientos.map((t) => (
                    <TratamientoCard 
                        key={t.id} 
                        tratamiento={t} 
                        onVerStockClick={setStockSeleccionado} 
                    />
                ))}
            </div>

            {stockSeleccionado && (
                <ModalStock 
                    tratamiento={stockSeleccionado} 
                    onClose={() => setStockSeleccionado(null)} 
                />
            )}
        </div>
    );
}