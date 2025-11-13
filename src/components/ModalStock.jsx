import React from "react";

const ModalStock = ({ tratamiento, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Insumos: {tratamiento.nombre}</h3>
          <button onClick={onClose} className="modal-close-btn">
            &times;
          </button>
        </div>

        <p className="text-md font-semibold mb-3">Insumos necesarios:</p>
        <ul className="insumos-list">
          {tratamiento.insumos && tratamiento.insumos.length > 0 ? (
            tratamiento.insumos.map((item, index) => <li key={index}>{item}</li>)
          ) : (
            <li className="text-gray-500 italic">
              No hay insumos específicos listados.
            </li>
          )}
        </ul>

        <p className="modal-status">
          Estatus: {tratamiento.stock || "Stock disponible y verificado."}
        </p>

        <button onClick={onClose} className="btn-close-modal">
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ModalStock;
