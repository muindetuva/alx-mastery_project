"""Encrypt and decrypt private note content with Fernet."""

from cryptography.fernet import Fernet, InvalidToken

from config import VAULT_ENCRYPTION_KEY


_fernet = Fernet(VAULT_ENCRYPTION_KEY.encode("ascii"))


def encrypt_note(content: str) -> bytes:
    """Encrypt UTF-8 note content and return its opaque ciphertext."""
    return _fernet.encrypt(content.encode("utf-8"))


def decrypt_note(ciphertext: bytes) -> str:
    """Decrypt note ciphertext and return its original UTF-8 text."""
    try:
        return _fernet.decrypt(ciphertext).decode("utf-8")
    except InvalidToken as exc:
        raise ValueError("Unable to decrypt note") from exc
