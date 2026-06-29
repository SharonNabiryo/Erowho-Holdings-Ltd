"""
Erowho Holdings Limited — Image Storage Abstraction

Current state: LOCAL DEMO ONLY
  Images are not persistently stored by this layer.
  The admin form accepts direct image URLs (Unsplash, Cloudinary, etc.)
  and saves them directly in the property record.

Future: Supabase Storage
  When a Supabase project is created, replace the stubs below with real
  Supabase Storage calls. The rest of the app (app.py, admin form) will
  not need to change — they'll just receive a persistent public URL back
  from save_property_image() instead of the input URL unchanged.

Migration steps (when ready):
  1. Create a Supabase project and a storage bucket named "property-images"
     (set bucket to public so images are accessible without a token).
  2. pip install supabase (adds supabase-py client).
  3. Set env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_STORAGE_BUCKET.
  4. Replace the stub implementations below with the real Supabase calls.
  5. Add a POST /api/admin/upload-image route in app.py that:
       - Reads the uploaded file from request.files["image"]
       - Calls save_property_image(file)
       - Returns {"url": image_url}
  6. In the frontend admin form, wire up the file input to POST to
       /api/admin/upload-image, get back the URL, and set it as image_url.
"""

import os

# ── Config ─────────────────────────────────────────────────────────────────────
SUPABASE_URL    = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY    = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
STORAGE_BUCKET  = os.environ.get("SUPABASE_STORAGE_BUCKET", "property-images")

STORAGE_READY = bool(SUPABASE_URL and SUPABASE_KEY)


# ── Public API ─────────────────────────────────────────────────────────────────

def save_property_image(file, filename: str = None) -> str:
    """
    Upload a property image and return its public URL.

    Args:
        file: a file-like object (e.g. werkzeug FileStorage from request.files)
        filename: optional override for the storage filename

    Returns:
        Public URL string for the stored image.

    Raises:
        NotImplementedError: if Supabase Storage is not yet configured.
        ValueError: if the file type is not allowed.

    TODO (when Supabase is ready):
        import mimetypes
        from supabase import create_client
        client = create_client(SUPABASE_URL, SUPABASE_KEY)
        ext = os.path.splitext(file.filename or "")[1].lower()
        allowed = {".jpg", ".jpeg", ".png", ".webp"}
        if ext not in allowed:
            raise ValueError(f"File type not supported. Allowed: {', '.join(allowed)}")
        if file.seek(0, 2) > 5 * 1024 * 1024:
            raise ValueError("Image is too large. Maximum file size is 5MB.")
        file.seek(0)
        import uuid
        storage_name = filename or f"property-images/{uuid.uuid4().hex}{ext}"
        data = file.read()
        mime = mimetypes.guess_type(storage_name)[0] or "image/jpeg"
        client.storage.from_(STORAGE_BUCKET).upload(storage_name, data, {"content-type": mime})
        public_url = client.storage.from_(STORAGE_BUCKET).get_public_url(storage_name)
        return public_url
    """
    raise NotImplementedError(
        "Supabase Storage is not yet configured. "
        "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables "
        "and implement the upload logic in backend/storage.py."
    )


def delete_property_image(image_url: str) -> bool:
    """
    Delete a property image from storage by its public URL.

    Returns True if deleted, False if not applicable (e.g. external URL).

    TODO (when Supabase is ready):
        Extract the storage path from the URL and call:
        client.storage.from_(STORAGE_BUCKET).remove([path])
    """
    if not STORAGE_READY:
        return False
    if SUPABASE_URL and image_url.startswith(SUPABASE_URL):
        # TODO: extract path and delete from Supabase Storage
        pass
    return False


def storage_status() -> dict:
    """Return the current storage configuration status for diagnostics."""
    return {
        "ready": STORAGE_READY,
        "provider": "supabase" if STORAGE_READY else "none",
        "bucket": STORAGE_BUCKET if STORAGE_READY else None,
        "note": (
            "Supabase Storage is active." if STORAGE_READY
            else "File upload is not configured. Using direct image URLs only."
        ),
    }
