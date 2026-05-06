import json
import base64
from django.conf import settings
from django.utils.deprecation import MiddlewareMixin
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad, pad

class AESEncryptionMiddleware(MiddlewareMixin):
    def __init__(self, get_response):
        super().__init__(get_response)
        self.secret_key = b"fallback_secret_key_32_bytes_long!"

    def process_request(self, request):
        if request.method in ["POST", "PUT", "PATCH"] and request.content_type == "application/json":
            try:
                body = json.loads(request.body)
                if "encrypted_payload" in body:
                    encrypted_b64 = body["encrypted_payload"]
                    data = base64.b64decode(encrypted_b64)
                    iv = data[:16]
                    ciphertext = data[16:]
                    cipher = AES.new(self.secret_key, AES.MODE_CBC, iv)
                    plaintext = unpad(cipher.decrypt(ciphertext), AES.block_size)
                    request._body = plaintext
                    request.META['ENCRYPTED_REQUEST'] = True
            except Exception as e:
                pass # Fallback to normal processing if decryption fails

    def process_response(self, request, response):
        if getattr(request, 'META', {}).get('ENCRYPTED_REQUEST') and response.get('Content-Type') == 'application/json':
            try:
                from Crypto.Random import get_random_bytes
                plaintext = response.content
                iv = get_random_bytes(16)
                cipher = AES.new(self.secret_key, AES.MODE_CBC, iv)
                ciphertext = cipher.encrypt(pad(plaintext, AES.block_size))
                encrypted_b64 = base64.b64encode(iv + ciphertext).decode('utf-8')
                
                new_payload = json.dumps({"encrypted_payload": encrypted_b64}).encode('utf-8')
                response.content = new_payload
                response['Content-Length'] = str(len(response.content))
            except Exception as e:
                pass
        return response
