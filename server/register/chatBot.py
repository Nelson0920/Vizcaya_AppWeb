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
    # Lógica del chatbot para responder preguntas
    if 'producto' in user_input:
        return 'El producto que buscas es muy popular en nuestra tienda.'
    elif 'ubicación' in user_input or 'dirección' in user_input or 'ubicados' in user_input or 'ubicacion' in user_input or 'ubican' in user_input:
        return 'Nuestra tienda está ubicada en la Calle Principal #123.'
    elif 'horario' in user_input or 'hora' in user_input:
        return 'Nuestro horario de atención es de lunes a viernes de 9am a 6pm.'
    elif 'contacto' in user_input or 'teléfono' in user_input:
        return 'Puedes contactarnos al 123-456-789 o enviarnos un correo a contacto@vizcaya.com.'
    elif 'stock' in user_input or 'disponibilidad' in user_input:
        return 'El producto que buscas actualmente está en stock.'
    elif 'promociones' in user_input or 'ofertas' in user_input:
        return 'Tenemos varias promociones en diferentes productos. Te invitamos a visitarnos en la tienda para conocerlas.'
    elif 'tiempo de entrega' in user_input or 'envío' in user_input:
        return 'El tiempo de entrega estándar es de 3 a 5 días hábiles. También ofrecemos envío express con entrega en 24 horas.'
    elif 'devoluciones' in user_input or 'garantía' in user_input:
        return 'Aceptamos devoluciones dentro de los 30 días posteriores a la compra. Todos nuestros productos tienen garantía de 1 año.'
    elif 'soporte técnico' in user_input or 'asistencia' in user_input:
        return 'Ofrecemos soporte técnico para nuestros productos. Si necesitas ayuda, puedes comunicarte con nuestro equipo de asistencia técnica.'
    elif 'hola' in user_input or 'como estas' in user_input:
        return '¡Hola! Soy Caya, tu asistente virtual de Vizcaya.'
    else:
        return 'Lo siento, no puedo entender tu pregunta. Por favor, reformula tu consulta de nuevo.'

