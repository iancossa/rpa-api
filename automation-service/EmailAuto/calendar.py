#Calendar integration for scheduling meetings  via the Google Calendar API

import os
import logging
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
import google.auth
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

import threading

# Thread-safe Calendar service singleton
_calendar_service = None
_service_lock = threading.Lock()

def get_calendar_service():
    global _calendar_service
    if _calendar_service is None:
        with _service_lock:
            if _calendar_service is None:
                try:
                    creds, _ = google.auth.default()
                    _calendar_service = build("calendar", "v3", credentials=creds)
                except Exception as e:
                    logger.error("Failed to authenticate with Google Calendar API: %s", str(e).replace('\n', ' ').replace('\r', ''))
                    raise
    return _calendar_service


def create_meeting_invite(
    summary: str,
    description: str,
    start_time: datetime,
    end_time: datetime,
    attendees: list[str],
    timezone_str: str = "UTC",
):
    """
    Create a Google Calendar event with meeting invites.

    Args:
        summary (str): Title of the meeting
        description (str): Meeting description/agenda
        start_time (datetime): Meeting start time
        end_time (datetime): Meeting end time
        attendees (list[str]): List of participant emails
        timezone_str (str): Timezone (default: UTC)

    Returns:
        dict: Created event metadata
    """
    # Input validation
    if not summary or not isinstance(summary, str):
        logger.error("Invalid summary provided")
        return None
    if not isinstance(start_time, datetime) or not isinstance(end_time, datetime):
        logger.error("Invalid datetime objects provided")
        return None
    if start_time >= end_time:
        logger.error("Start time must be before end time")
        return None
    if not attendees or not isinstance(attendees, list):
        logger.error("Invalid attendees list provided")
        return None
    
    # Validate email format for attendees
    import re
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    for email in attendees:
        if not isinstance(email, str) or not re.match(email_pattern, email):
            sanitized_email = str(email).replace('\n', ' ').replace('\r', '')
            logger.error("Invalid email format: %s", sanitized_email)
            return None
        
    try:
        service = get_calendar_service()
    except Exception as auth_error:
        logger.error(f"Authentication failed: {auth_error}")
        return None
    
    try:

        event = {
            "summary": summary,
            "description": description,
            "start": {
                "dateTime": start_time.isoformat(),
                "timeZone": timezone_str,
            },
            "end": {
                "dateTime": end_time.isoformat(),
                "timeZone": timezone_str,
            },
            "attendees": [{"email": email} for email in attendees],
            "reminders": {
                "useDefault": False,
                "overrides": [
                    {"method": "email", "minutes": 30},
                    {"method": "popup", "minutes": 10},
                ],
            },
        }

        event_result = (
            service.events()
            .insert(calendarId="primary", body=event, sendUpdates="all")
            .execute()
        )

        event_link = str(event_result.get('htmlLink', '')).replace('\n', ' ').replace('\r', '')
        logger.info("Event created successfully: %s", event_link)
        return event_result

    except HttpError as error:
        sanitized_error = str(error).replace('\n', ' ').replace('\r', '')
        logger.error("Google Calendar API error: %s", sanitized_error)
        return None
    except Exception as error:
        sanitized_error = str(error).replace('\n', ' ').replace('\r', '')
        logger.error("Unexpected error creating calendar event: %s", sanitized_error)
        return None


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    # Example usage
    start = datetime.now(timezone.utc) + timedelta(days=1, hours=2)  # tomorrow +2h
    end = start + timedelta(hours=1)

    create_meeting_invite(
        summary="Automation RPA Demo",
        description="Demo of automated meeting invite via Google Calendar API",
        start_time=start,
        end_time=end,
        attendees=["user1@example.com", "user2@example.com"],
        timezone_str="UTC",
    )
