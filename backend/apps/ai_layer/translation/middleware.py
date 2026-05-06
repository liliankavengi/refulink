import json
from django.utils.deprecation import MiddlewareMixin
from .service import translate_vouching_agreement

class TranslationMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        if response.get('Content-Type') != 'application/json':
            return self.get_response
        try:
            content = json.loads(response.content.decode('utf-8'))

            if 'ambassador_public_key' in content and 'hashed_rin' in content:
                translations = translate_vouching_agreement(
                    content['ambassador_public_key'],
                    content['hashed_rin']
                )
                content['translations'] = translations

            response.content = json.dumps(content).encode('utf-8')
        except (ValueError, UnicodeDecodeError):
            pass

        return response
