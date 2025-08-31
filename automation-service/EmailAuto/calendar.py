#Calendar integration for scheduling meetings  via the Google Calendar API

import os
from datetime import datetime, timedelta

from dotenv import load_dotenv
import google.auth
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# Load environment variables
load_dotenv()


def create_meeting_invite(
    summary: str,
    description: str,
    start_time: datetime,
    end_time: datetime,
    attendees: list[str],
    timezone: str = "UTC",
):
    """
    Create a Google Calendar event with meeting invites.

    Args:
        summary (str): Title of the meeting
        description (str): Meeting description/agenda
        start_time (datetime): Meeting start time
        end_time (datetime): Meeting end time
        attendees (list[str]): List of participant emails
        timezone (str): Timezone (default: UTC)

    Returns:
        dict: Created event metadata
    """
    creds, _ = google.auth.default()  # loads from GOOGLE_APPLICATION_CREDENTIALS

    try:
        service = build("calendar", "v3", credentials=creds)

        event = {
            "summary": summary,
            "description": description,
            "start": {
                "dateTime": start_time.isoformat(),
                "timeZone": timezone,
            },
            "end": {
                "dateTime": end_time.isoformat(),
                "timeZone": timezone,
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

        print(f"✅ Event created: {event_result.get('htmlLink')}")
        return event_result

    except HttpError as error:
        print(f"❌ An error occurred: {error}")
        return None


if __name__ == "__main__":
    # Example usage
    start = datetime.utcnow() + timedelta(days=1, hours=2)  # tomorrow +2h
    end = start + timedelta(hours=1)

    create_meeting_invite(
        summary="Automation RPA Demo",
        description="Demo of automated meeting invite via Google Calendar API",
        start_time=start,
        end_time=end,
        attendees=["user1@example.com", "user2@example.com"],
        timezone="UTC",
    )
