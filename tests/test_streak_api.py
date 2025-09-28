from pathlib import Path
import json
from datetime import datetime, timedelta

import pytest
import backend.app.db.database as db
from backend.app.models import User


@pytest.fixture(autouse=True)
def isolate_data_dir(tmp_path, monkeypatch):
    """Redirect USERS_FILE/TASKS_FILE/ACHIEVEMENTS_FILE to temporary files for tests."""
    users_file = tmp_path / "users.json"
    tasks_file = tmp_path / "tasks.json"
    achievements_file = tmp_path / "achievements.json"

    monkeypatch.setattr(db, "USERS_FILE", str(users_file))
    monkeypatch.setattr(db, "TASKS_FILE", str(tasks_file))
    monkeypatch.setattr(db, "ACHIEVEMENTS_FILE", str(achievements_file))

    # Ensure files start empty
    for p in (users_file, tasks_file, achievements_file):
        if p.exists():
            p.unlink()

    yield


def read_users_file() -> list:
    path = Path(db.USERS_FILE)
    if not path.exists():
        return []
    return json.loads(path.read_text())


def write_users_file(data: list):
    Path(db.USERS_FILE).write_text(json.dumps(data, indent=2, default=str))


def test_streak_visit_flow():
    # create user via DB helper so we operate on the monkeypatched files
    user = User(username="streak_tester")
    created = db.create_user(user)
    user_id = created.id

    # First visit
    data1 = db.record_streak_visit(user_id)
    assert data1 is not None
    assert data1["totalVisits"] == 1
    assert data1["currentDailyStreak"] == 1
    assert data1["bestStreak"] == 1

    # Same day visit -> only totalVisits increments
    data2 = db.record_streak_visit(user_id)
    assert data2["totalVisits"] == 2
    assert data2["currentDailyStreak"] == 1
    assert data2["bestStreak"] == 1

    # Simulate next-day by editing the stored last_login to yesterday, then call
    users = read_users_file()
    assert len(users) == 1
    users[0]["last_login"] = (datetime.now() - timedelta(days=1)).isoformat()
    write_users_file(users)

    data3 = db.record_streak_visit(user_id)
    assert data3["totalVisits"] == 3
    assert data3["currentDailyStreak"] == 2
    assert data3["bestStreak"] == 2

    # Simulate a missed-day (set last_login to 3 days ago)
    users = read_users_file()
    users[0]["last_login"] = (datetime.now() - timedelta(days=3)).isoformat()
    write_users_file(users)

    data4 = db.record_streak_visit(user_id)
    assert data4["totalVisits"] == 4
    assert data4["currentDailyStreak"] == 1
    # bestStreak should remain as previous best (2)
    assert data4["bestStreak"] == 2
