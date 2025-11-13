from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Reserva(db.Model):
    __tablename__ = "reservas"

    id = db.Column(db.Integer, primary_key=True)
    cliente_nombre = db.Column(db.String(100), nullable=False)
    cliente_email = db.Column(db.String(100))
    cliente_telefono = db.Column(db.String(50))
    tratamiento_id = db.Column(db.String(50))
    tratamiento_nombre = db.Column(db.String(100), nullable=False)
    duracion_minutos = db.Column(db.Integer)
    precio = db.Column(db.Float)
    preferencia_fecha = db.Column(db.String(100))
    notas = db.Column(db.Text)
    creado_en = db.Column(db.DateTime, default=datetime.now)
