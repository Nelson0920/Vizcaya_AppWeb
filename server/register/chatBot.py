from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def chatbot(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_input = data.get('user_input', '').lower()

        response = get_chatbot_response(user_input)

        return JsonResponse({'response': response})

def get_chatbot_response(user_input):
    if 'producto' in user_input or 'artículo' in user_input or 'ítem' in user_input:
        return 'Productos popualres encontra'
    elif 'ubicación' in user_input or 'dirección' in user_input or 'ubicados' in user_input or 'ubicacion' in user_input or 'ubican' in user_input:
        return 'Nos ubicamos en la Calle Principal #123'
    elif 'horario' in user_input or 'hora' in user_input or 'atención' in user_input:
        return 'Hoarios de lunes a viernes de 9am a 6pm'
    elif 'contacto' in user_input or 'teléfono' in user_input or 'correo' in user_input or 'email' in user_input:
        return '123-456-789 o contacto@vizcaya.com'
    elif 'stock' in user_input or 'disponibilidad' in user_input or 'disponible' in user_input:
        return 'en stock'
    elif 'promociones' in user_input or 'ofertas' in user_input or 'descuentos' in user_input:
        return 'Contamos con varias promociones en prodcutos de gama alta y baja'
    elif 'tiempo de entrega' in user_input or 'envío' in user_input or 'enviar' in user_input or 'enviando' in user_input:
        return '3 a 5 días hábiles o envío express 24 horas a todo el país'
    elif 'devoluciones' in user_input or 'garantía' in user_input or 'reembolso' in user_input or 'devolver' in user_input:
        return 'Devoluciones hábiles 30 días despuesde la compra, garantías 1 año'
    elif 'soporte técnico' in user_input or 'asistencia' in user_input or 'ayuda' in user_input or 'soporte' in user_input:
        return 'Soporte técnico disponible, llama al 04267732522'
    elif 'hola' in user_input or 'como estas' in user_input:
        return '¡Hola! Soy Caya, tu asistente virtual de Vizcaya.'
    elif 'métodos de pago' in user_input or 'formas de pago' in user_input or 'pagar' in user_input or 'pago' in user_input:
        return 'Aceptamos tarjetas de crédito, débito, PayPal, transferencias bancarias'
    elif 'información de la cuenta' in user_input or 'registrarme' in user_input or 'iniciar sesión' in user_input:
        return 'registro e inicio de sesión en nuestro sitio web'
    elif 'seguridad' in user_input or 'protección' in user_input or 'seguro' in user_input or 'proteger' in user_input:
        return 'Utilizamos medidas de encriptación para proteger tus datos'
    elif 'novedades' in user_input or 'nuevos productos' in user_input or 'nueva colección' in user_input or 'nuevo' in user_input:
        return 'explora nuestra pagina para enterrarte de todas las novedades que puedes conseguir solo con nosotros.'
    elif 'reembolso' in user_input or 'devolver dinero' in user_input or 'reembolsar' in user_input or 'reembolsaron' in user_input:
        return 'Procesos de reembolso son de manera presencial en nuestras sucursales'
    elif 'reservar' in user_input or 'reserva' in user_input or 'reservado' in user_input:
        return 'No ofrecemos reservas e productos'
    elif 'pintura' in user_input or 'pintar' in user_input or 'pintando' in user_input or 'pinté' in user_input:
        return 'Amplia gama de pinturas para tu proyecto'
    elif 'herramientas' in user_input or 'herramienta' in user_input or 'herramientas eléctricas' in user_input:
        return 'tenemos las mejores herramientas para tus tareas'
    elif 'cerraduras' in user_input or 'cerradura' in user_input or 'cerrajería' in user_input or 'cerrajeria' in user_input:
        return 'diferentes tipos de cerraduras y soluciones de cerrajería'
    elif 'fontanería' in user_input or 'fontanero' in user_input or 'fontanería hogar' in user_input or 'fontaneria' in user_input:
        return 'todo lo que necesitas para reparaciones y proyectos de fontanería'
    elif 'iluminación' in user_input or 'luces' in user_input or 'lámparas' in user_input:
        return 'amplia selección de iluminación para interiores y exteriores'
    else:
        return 'No puedo entender tu pregunta. Por favor, reformula tu consulta de nuevo.'