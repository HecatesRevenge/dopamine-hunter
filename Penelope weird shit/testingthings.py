"""Small script to test login streak increment logic without running the FastAPI server.

This script uses the project's DB helpers to create a user, simulate a login by
updating `last_login` and `login_streak`, and validates that the streak increases
when logins occur on consecutive days.

Run with: python "Penelope weird shit\testingthings.py"
"""

# Ensure the repository root is on sys.path so `import backend...` works when this
# script is executed directly from its folder (Python sets sys.path[0] to the
# script's directory). We add the repo root (parent of this file's parent).
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from datetime import datetime, timedelta
from backend.app.db.database import create_user, get_user_by_username, update_user
from backend.app.models import User


def simulate_login(username: str, now: datetime):
	user = get_user_by_username(username)
	if not user:
		raise RuntimeError("User not found")

	# replicate the endpoint logic
	if user.last_login:
		delta = now.date() - user.last_login.date()
		if delta.days == 1:
			user.login_streak = (user.login_streak or 0) + 1
		elif delta.days > 1:
			user.login_streak = 1
	else:
		user.login_streak = 1

	user.last_login = now
	updated = update_user(user.id, user)
	return updated


def main():
	# create a fresh user (will be appended to users.json)
	username = "test_streak_user"
	existing = get_user_by_username(username)
	if existing:
		print("User already exists, removing for clean test is not implemented; using existing user")
	else:
		user = User(username=username)
		create_user(user)

	# First login: should set streak to 1
	now = datetime.now()
	u1 = simulate_login(username, now)
	assert u1.login_streak == 1, f"Expected streak 1, got {u1.login_streak}"
	print("First login -> streak =", u1.login_streak)

	# Simulate next-day login -> streak increments
	tomorrow = now + timedelta(days=1)
	u2 = simulate_login(username, tomorrow)
	assert u2.login_streak == 2, f"Expected streak 2, got {u2.login_streak}"
	print("Second consecutive day login -> streak =", u2.login_streak)

	# Simulate skipping a day -> streak resets to 1
	later = tomorrow + timedelta(days=2)
	u3 = simulate_login(username, later)
	assert u3.login_streak == 1, f"Expected streak reset to 1, got {u3.login_streak}"
	print("After skipping a day -> streak =", u3.login_streak)


if __name__ == "__main__":
	main()

