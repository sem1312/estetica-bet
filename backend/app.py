from flask import Flask, redirect, request, jsonify, session
from flask_cors import CORS
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from google.oauth2 import service_account
from datetime import datetime, timedelta
import os

# ---------------- CONFIG ----------------
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})
app.secret_key = "clave_super_segura"

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"  # solo para desarrollo local

CLIENT_SECRETS_FILE = "credentials_oauth.json"  # tus credenciales OAuth2 web
SERVICE_ACCOUNT_FILE = "estetica-service-account.json"  # cuenta de servicio del negocio
CALENDAR_ID_EMPRESA = "tu_calendario_estetica@gmail.com"  # calendario central del negocio

SCOPES = ["https://www.googleapis.com/auth/calendar.events"]
REDIRECT_URI = "http://localhost:5000/oauth2callback"

# ---------------- RUTAS DE LOGIN ----------------
@app.route("/authorize")
def authorize():
    flow = Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE,
        scopes=SCOPES,
        redirect_uri=REDIRECT_URI,
    )
    authorization_url, state = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
        prompt="consent",
    )
    session["state"] = state
    return redirect(authorization_url)


@app.route("/oauth2callback")
def oauth2callback():
    state = session["state"]
    flow = Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE,
        scopes=SCOPES,
        redirect_uri=REDIRECT_URI,
    )
    flow.fetch_token(authorization_response=request.url)

    credentials = flow.credentials
    session["credentials"] = {
        "token": credentials.token,
        "refresh_token": credentials.refresh_token,
        "token_uri": credentials.token_uri,
        "client_id": credentials.client_id,
        "client_secret": credentials.client_secret,
        "scopes": credentials.scopes,
    }

    return jsonify({"success": True, "message": "Autenticado con Google Calendar"})


# ---------------- CREAR EVENTO ----------------
@app.route("/api/reservar", methods=["POST"])
def crear_evento():
    if "credentials" not in session:
        return jsonify({"error": "No autenticado con Google Calendar"}), 401

    data = request.get_json()
    nombre_cliente = data.get("cliente_nombre")
    tratamiento = data.get("tratamiento_nombre")
    duracion = int(data.get("duracion_minutos", 60))
    fecha_inicio_str = data.get("preferencia_fecha")

    inicio = datetime.strptime(fecha_inicio_str, "%Y-%m-%d %H:%M")
    fin = inicio + timedelta(minutes=duracion)

    evento = {
        "summary": f"Turno Estética: {tratamiento}",
        "description": f"Cliente: {nombre_cliente}\nDuración: {duracion} minutos.",
        "start": {"dateTime": inicio.isoformat(), "timeZone": "America/Argentina/Buenos_Aires"},
        "end": {"dateTime": fin.isoformat(), "timeZone": "America/Argentina/Buenos_Aires"},
    }

    # --- Crear evento en el calendario del CLIENTE ---
    credentials = Credentials(**session["credentials"])
    servicio_cliente = build("calendar", "v3", credentials=credentials)
    evento_cliente = servicio_cliente.events().insert(calendarId="primary", body=evento).execute()

    # --- Crear evento en el calendario del NEGOCIO ---
    creds_negocio = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )
    servicio_empresa = build("calendar", "v3", credentials=creds_negocio)
    servicio_empresa.events().insert(calendarId=CALENDAR_ID_EMPRESA, body=evento).execute()

    session["credentials"]["token"] = credentials.token

    return jsonify({
        "success": True,
        "message": "Reserva creada en ambos calendarios",
        "cliente_event": evento_cliente.get("htmlLink"),
    })


# ---------------- MAIN ----------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)
