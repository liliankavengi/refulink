from __future__ import annotations

import base64
import hashlib
import importlib
import json
from datetime import date
from collections.abc import Mapping

from django.conf import settings
from django.db import models


_PREFIX = "enc:v1:"


def _get_cipher():
    key_source = getattr(settings, "PII_ENCRYPTION_KEY", "") or settings.SECRET_KEY
    key = hashlib.sha512(key_source.encode("utf-8")).digest()
    aead_module = importlib.import_module("cryptography.hazmat.primitives.ciphers.aead")
    return aead_module.AESSIV(key)


def _encrypt(value: str, domain: str) -> str:
    if value.startswith(_PREFIX):
        return value

    ciphertext = _get_cipher().encrypt(
        value.encode("utf-8"),
        [domain.encode("utf-8")],
    )
    token = base64.urlsafe_b64encode(ciphertext).decode("ascii")
    return f"{_PREFIX}{token}"


def _decrypt(value: str, domain: str) -> str:
    if not isinstance(value, str) or not value.startswith(_PREFIX):
        return value

    ciphertext = base64.urlsafe_b64decode(value[len(_PREFIX) :].encode("ascii"))
    plaintext = _get_cipher().decrypt(ciphertext, [domain.encode("utf-8")])
    return plaintext.decode("utf-8")


class EncryptedTextField(models.TextField):
    def from_db_value(self, value, expression, connection):
        return self.to_python(value)

    def to_python(self, value):
        if value is None:
            return None
        if isinstance(value, str):
            if value == "" and self.null:
                return None
            return _decrypt(value, self.attname)
        return str(value)

    def get_prep_value(self, value):
        if value is None:
            return None
        if value == "" and self.null:
            return None
        return _encrypt(str(value), self.attname)


class EncryptedDateField(EncryptedTextField):
    def to_python(self, value):
        value = super().to_python(value)
        if value in (None, ""):
            return None
        if isinstance(value, date):
            return value
        if isinstance(value, str):
            return date.fromisoformat(value)
        return value

    def get_prep_value(self, value):
        if isinstance(value, date):
            value = value.isoformat()
        return super().get_prep_value(value)


class EncryptedJSONField(models.TextField):
    def from_db_value(self, value, expression, connection):
        return self.to_python(value)

    def to_python(self, value):
        if value is None:
            return None
        if isinstance(value, (dict, list)):
            return value
        if isinstance(value, str):
            raw_value = _decrypt(value, self.attname)
            try:
                return json.loads(raw_value)
            except json.JSONDecodeError:
                return raw_value
        return value

    def get_prep_value(self, value):
        if value is None:
            return None
        if isinstance(value, str):
            try:
                value = json.loads(value)
            except json.JSONDecodeError:
                pass

        if hasattr(value, "dict"):
            value = value.dict()
        elif isinstance(value, Mapping):
            value = dict(value)

        if not isinstance(value, str):
            value = json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)

        return _encrypt(value, self.attname)
