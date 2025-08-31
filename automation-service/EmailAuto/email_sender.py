import base64
import mimetypes
from email.message import EmailMessage
from pathlib import Path

import google.auth
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError


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

    creds, _ = google.auth.default()  # Requires GOOGLE_APPLICATION_CREDENTIALS set

    try:
        service = build("gmail", "v1", credentials=creds)

        message = EmailMessage()
        message.set_content(body)

        message["To"] = to
        message["From"] = from_alias
        message["Subject"] = subject

        # Add attachments if provided
        if attachments:
            for file_path in attachments:
                file_path = Path(file_path)
                if not file_path.exists():
                    print(f"⚠️ Attachment not found: {file_path}")
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

        # Encode message
        encoded_message = base64.urlsafe_b64encode(message.as_bytes()).decode()

        send_body = {"raw": encoded_message}

        sent_message = (
            service.users()
            .messages()
            .send(userId="me", body=send_body)
            .execute()
        )

        print(f"✅ Message sent successfully. ID: {sent_message['id']}")
        return sent_message

    except HttpError as error:
        print(f"❌ An error occurred: {error}")
        return None


if __name__ == "__main__":
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
