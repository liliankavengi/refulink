from datetime import date
from .languages import SUPPORTED_LANGUAGES

try:
    from deep_translator import GoogleTranslator
    _TRANSLATOR_AVAILABLE = True
except ImportError:
    _TRANSLATOR_AVAILABLE = False

# The master template for the agreement. 

_AGREEMENT_TEMPLATE = """VOUCHING AGREEMENT — RefuLink Programme

I, the undersigned Trusted Ambassador, hereby attest that I have personally \
verified the identity of the refugee associated with the Reference Hash below. \
I confirm that the identity documents presented are authentic and that the \
information is accurate to the best of my knowledge.

By signing this attestation on the Stellar blockchain, I acknowledge that this \
record is immutable and will serve as the basis for the individual's access to \
financial inclusion services under the RefuLink programme.

Ambassador Public Key : {ambassador_public_key}
Refugee Reference Hash: {hashed_rin}
Date                  : {date}

I accept full responsibility for the accuracy of this verification."""

def translate_vouching_agreement(
    ambassador_public_key: str,
    hashed_rin: str,
    signing_date: str = "",
) -> dict:
    """
    Generates the vouching agreement in English and creates translations 
    for all languages configured in languages.py. 
    
    If the translation service is unavailable, it defaults to English for all entries.
    """
    
    # If no specific date is provided it defaults to today's date to keep the record current.
    if not signing_date:
        signing_date = date.today().isoformat()

    # English version is created first. It serves as the 'source of truth'.
    english_text = _AGREEMENT_TEMPLATE.format(
        ambassador_public_key=ambassador_public_key,
        hashed_rin=hashed_rin,
        date=signing_date,
    )

    
    translations = {"en": english_text}

    if not _TRANSLATOR_AVAILABLE:
        for code in SUPPORTED_LANGUAGES:
            translations[code] = english_text
        return translations

    for lang_code in SUPPORTED_LANGUAGES:
        if lang_code == "en":
            continue
            
        try:
            
            #translate the English text into the target language code.

            translated = GoogleTranslator(source="en", target=lang_code).translate(english_text)
            translations[lang_code] = translated or english_text
        except Exception:
            # If the translation fails, fallback to English so the user still sees a valid agreement.
            translations[lang_code] = english_text

    return translations