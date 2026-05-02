def is_valid_translation_request(content):
    
    """Validates if the dictionary contains the required keys 
    needed for the vouching agreement translation.
    """
    required_keys = ['ambassador_public_key', 'hashed_rin']
    return all(key in content for key in required_keys)

def get_target_language(request):
    
    """Extracts the language code from the request headers.
    Defaults to 'en' if not provided.
    """
    return request.headers.get('X-Language-Code', 'en')