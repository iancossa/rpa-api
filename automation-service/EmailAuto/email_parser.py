import re
import logging
from datetime import datetime
from email.mime.text import MIMEText
import google.auth
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import base64

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
            logger.error("Failed to authenticate with Gmail API: %s", str(e).replace('\n', ' ').replace('\r', ''))
            raise
    return _gmail_service

def get_emails(query="is:unread", max_results=10):
    """Get emails based on query"""
    try:
        service = get_gmail_service()
        results = service.users().messages().list(userId='me', q=query, maxResults=max_results).execute()
        messages = results.get('messages', [])
        
        emails = []
        for msg in messages:
            email_data = service.users().messages().get(userId='me', id=msg['id']).execute()
            emails.append(parse_email(email_data))
        
        return emails
    except HttpError as error:
        logger.error("Gmail API error: %s", str(error).replace('\n', ' ').replace('\r', ''))
        return []

def parse_email(email_data):
    """Parse email data and extract key information"""
    headers = email_data['payload'].get('headers', [])
    
    # Extract basic info
    subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
    sender = next((h['value'] for h in headers if h['name'] == 'From'), '')
    date = next((h['value'] for h in headers if h['name'] == 'Date'), '')
    
    # Extract body
    body = extract_body(email_data['payload'])
    
    # Extract structured data
    extracted_data = {
        'id': email_data['id'],
        'subject': subject,
        'sender': sender,
        'date': date,
        'body': body,
        'attachments': extract_attachments(email_data['payload']),
        'extracted_info': extract_structured_data(body)
    }
    
    return extracted_data

def extract_body(payload):
    """Extract email body text"""
    body = ""
    
    if 'parts' in payload:
        for part in payload['parts']:
            if part['mimeType'] == 'text/plain':
                data = part['body']['data']
                body = base64.urlsafe_b64decode(data).decode('utf-8')
                break
    elif payload['mimeType'] == 'text/plain':
        data = payload['body']['data']
        body = base64.urlsafe_b64decode(data).decode('utf-8')
    
    return body

def extract_attachments(payload):
    """Extract attachment information"""
    attachments = []
    
    if 'parts' in payload:
        for part in payload['parts']:
            if part.get('filename'):
                attachments.append({
                    'filename': part['filename'],
                    'mimeType': part['mimeType'],
                    'size': part['body'].get('size', 0)
                })
    
    return attachments

def extract_structured_data(body):
    """Extract structured data from email body using regex patterns"""
    data = {}
    
    # Common patterns for RPA automation
    patterns = {
        'invoice_number': r'invoice\s*#?\s*:?\s*([A-Z0-9-]+)',
        'order_number': r'order\s*#?\s*:?\s*([A-Z0-9-]+)',
        'amount': r'\$?(\d+(?:,\d{3})*(?:\.\d{2})?)',
        'email': r'([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})',
        'phone': r'(\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4})',
        'date': r'(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})',
        'tracking_number': r'tracking\s*#?\s*:?\s*([A-Z0-9]+)',
        'reference_number': r'ref\s*#?\s*:?\s*([A-Z0-9-]+)'
    }
    
    for key, pattern in patterns.items():
        matches = re.findall(pattern, body, re.IGNORECASE)
        if matches:
            data[key] = matches[0] if len(matches) == 1 else matches
    
    return data

def mark_as_processed(email_id):
    """Mark email as processed by adding a label"""
    try:
        service = get_gmail_service()
        service.users().messages().modify(
            userId='me',
            id=email_id,
            body={'addLabelIds': ['INBOX'], 'removeLabelIds': ['UNREAD']}
        ).execute()
        logger.info("Email marked as processed: %s", email_id)
    except HttpError as error:
        logger.error("Error marking email as processed: %s", str(error).replace('\n', ' ').replace('\r', ''))

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    
    # Example usage
    emails = get_emails("is:unread", 5)
    for email in emails:
        logger.info("Subject: %s", email['subject'])
        logger.info("Extracted data: %s", email['extracted_info'])