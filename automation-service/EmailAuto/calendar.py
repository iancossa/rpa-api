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

# Calendar service singleton
_calendar_service = None

def get_calendar_service():
    global _calendar_service
    if _calendar_service is None:
        try:
            creds, _ = google.auth.default()
            _calendar_service = build("calendar", "v3", credentials=creds)
        except Exception as e:
            logger.error(f"Failed to authenticate with Google Calendar API: {e}")
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
    try:
        service = get_calendar_service()

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

        logger.info(f"Event created successfully: {event_result.get('htmlLink')}")
        return event_result

    except HttpError as error:
        logger.error(f"Google Calendar API error: {error}")
        return None
    except Exception as error:
        logger.error(f"Unexpected error creating calendar event: {error}")
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
