import base64
import mimetypes
import logging
import os
from email.message import EmailMessage
from pathlib import Path

import google.auth
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

logger = logging.getLogger(__name__)

# Gmail service singleton
_gmail_service = None

def get_gmail_service():
    global _gmail_service
    if _gmail_service is None:
        try:
            creds, _ = google.auth.default()
            _gmail_service = build("gmail", "v1", credentials=creds)
        except Exception as e:
            logger.error(f"Failed to authenticate with Gmail API: {e}")
            raise
    return _gmail_service


def send_email(to: str, subject: str, body: str, attachments: list[str] = None, from_alias: str = "me"):
    """
    Send an email with optional attachments using Gmail API.

    Args:
        to (str): Recipient email
        subject (str): Email subject
        body (str): Plain text email body
        attachments (list[str], optional): List of file paths to attach (PDF, Excel, images, etc.)
        from_alias (str): "me" or actual sender address if delegated

    Returns:
        dict: Sent message metadata
    """

    try:
        service = get_gmail_service()

        message = EmailMessage()
        message.set_content(body)

        message["To"] = to
        message["From"] = from_alias
        message["Subject"] = subject

        # Add attachments if provided
        if attachments:
            for file_path_str in attachments:
                try:
                    # Validate and secure file path
                    file_path = Path(file_path_str).resolve()
                    
                    # Security check: ensure file is within allowed directory
                    if not str(file_path).startswith(os.getcwd()):
                        logger.warning(f"Path traversal attempt blocked: {file_path_str}")
                        continue
                    
                    if not file_path.exists():
                        logger.warning(f"Attachment not found: {file_path}")
                        continue

                    # Guess MIME type
                    mime_type, _ = mimetypes.guess_type(file_path)
                    if mime_type is None:
                        mime_type = "application/octet-stream"

                    maintype, subtype = mime_type.split("/", 1)

                    with open(file_path, "rb") as f:
                        file_data = f.read()

                    message.add_attachment(
                        file_data,
                        maintype=maintype,
                        subtype=subtype,
                        filename=file_path.name,
                    )
                except (IOError, PermissionError, OSError) as e:
                    logger.error(f"Failed to attach file {file_path_str}: {e}")
                    continue

        # Encode message
        encoded_message = base64.urlsafe_b64encode(message.as_bytes()).decode()

        send_body = {"raw": encoded_message}

        sent_message = (
            service.users()
            .messages()
            .send(userId="me", body=send_body)
            .execute()
        )

        logger.info(f"Message sent successfully. ID: {sent_message['id']}")
        return sent_message

    except HttpError as error:
        logger.error(f"Gmail API error: {error}")
        return None
    except Exception as error:
        logger.error(f"Unexpected error sending email: {error}")
        return None


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    # Example usage
    send_email(
        to="recipient@example.com",
        subject="Invoice Report",
        body="Hello, please find attached the invoice and report.",
        attachments=[
            "files/invoice.pdf",
            "files/report.xlsx",
            "files/diagram.png"
        ],
    )
