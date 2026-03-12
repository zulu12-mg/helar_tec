"""
Backend de IA para HELAR-TEC

Servidor FastAPI que proporciona un endpoint de chat con respuestas automáticas
basadas en palabras clave para el asistente virtual de la página web.

Este módulo implementa un chatbot simple que responde a consultas comunes
sobre la empresa Herlartec, sus servicios y formas de contacto.
"""

# ===== IMPORTACIONES =====

import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict

# ===== CONFIGURACIÓN DE LOGGING =====

# Configurar logging para el servidor
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ===== CONFIGURACIÓN DE LA APLICACIÓN =====

# Crear instancia de FastAPI
app = FastAPI(
    title="HELAR-TEC Chat API",
    description="API para el chat de IA del sitio web de HELAR-TEC",
    version="1.0.0"
)

# Configurar CORS para permitir peticiones desde el frontend
# NOTA: En producción, especificar dominios permitidos en lugar de ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar dominios permitidos
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos HTTP
    allow_headers=["*"],  # Permitir todos los headers
)

# ===== MODELOS DE DATOS =====

class Message(BaseModel):
    """
    Modelo para las peticiones del chat.

    Define la estructura esperada para los mensajes entrantes del usuario.
    """
    message: str  # El mensaje del usuario

# ===== CONFIGURACIÓN DE RESPUESTAS =====

# Diccionario de respuestas basadas en palabras clave
RESPONSES: Dict[str, str] = {
    "saludo": "Hola 👋 Bienvenido a Herlartec. ¿En qué puedo ayudarte?",
    "empresa": "Somos Herlartec, una empresa de desarrollo de software especializada en crear páginas web y soluciones tecnológicas.",
    "servicios": "Nuestros servicios incluyen desarrollo de páginas web, sistemas personalizados y automatización de procesos.",
    "web": "Sí, desarrollamos páginas web modernas y adaptadas a cualquier dispositivo.",
    "precio": "El precio depende del tipo de proyecto. Puedes escribirnos por WhatsApp para darte una cotización.",
    "whatsapp": "Puedes escribirnos por WhatsApp aquí 👉 https://wa.me/57XXXXXXXXXX",
    "instagram": "Síguenos en Instagram 👉 https://instagram.com/herlartec",
    "ubicacion": "Somos un equipo de desarrollo que trabaja en soluciones digitales para diferentes negocios.",
    "gracias": "¡Con gusto! 😊 Si tienes otra pregunta aquí estoy para ayudarte.",
    "default": "No entendí muy bien tu pregunta 😅. Puedes preguntarme sobre nuestros servicios o cómo contactarnos."
}

# Función para determinar la categoría del mensaje
def categorize_message(message: str) -> str:
    """
    Categoriza el mensaje del usuario basado en palabras clave.

    Args:
        message (str): El mensaje del usuario en minúsculas.

    Returns:
        str: La clave de la respuesta correspondiente.
    """
    if "hola" in message or "buenas" in message:
        return "saludo"
    elif "quienes" in message or "quiénes" in message:
        return "empresa"
    elif "servicios" in message:
        return "servicios"
    elif "pagina web" in message or "página web" in message:
        return "web"
    elif "precio" in message or "costo" in message:
        return "precio"
    elif "whatsapp" in message or "contacto" in message:
        return "whatsapp"
    elif "instagram" in message or "redes" in message:
        return "instagram"
    elif "ubicacion" in message or "donde estan" in message:
        return "ubicacion"
    elif "gracias" in message:
        return "gracias"
    else:
        return "default"

# ===== ENDPOINTS =====

@app.get("/health")
def health_check() -> Dict[str, str]:
    """
    Endpoint de verificación de salud del servicio.

    Returns:
        Dict[str, str]: Estado del servicio.
    """
    return {"status": "healthy", "service": "HELAR-TEC Chat API"}

@app.post("/chat")
def chat(data: Message) -> Dict[str, str]:
    """
    Endpoint principal del chat de IA.

    Recibe un mensaje del usuario y devuelve una respuesta automática
    basada en palabras clave detectadas en el mensaje.

    Args:
        data (Message): Objeto con el mensaje del usuario.

    Returns:
        Dict[str, str]: Respuesta con el campo 'reply' conteniendo la respuesta del bot.
    """
    try:
        # Validar que el mensaje no esté vacío
        if not data.message or not data.message.strip():
            logger.warning("Mensaje vacío recibido")
            raise HTTPException(status_code=400, detail="El mensaje no puede estar vacío")

        # Convertir mensaje a minúsculas para facilitar la comparación
        msg = data.message.lower().strip()

        # Log del mensaje recibido
        logger.info(f"Mensaje recibido: {msg}")

        # Determinar la categoría del mensaje
        category = categorize_message(msg)

        # Obtener la respuesta correspondiente
        reply = RESPONSES.get(category, RESPONSES["default"])

        # Log de la respuesta
        logger.info(f"Respuesta enviada: {reply}")

        return {"reply": reply}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error procesando mensaje: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

# ===== EJECUCIÓN DEL SERVIDOR =====

if __name__ == "__main__":
    import uvicorn

    # Ejecutar el servidor con configuración de desarrollo
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Recarga automática en desarrollo
        log_level="info"
    )