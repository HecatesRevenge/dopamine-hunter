import requests

# Replace with your API base URL and user ID
BASE_URL = "http://localhost:8000"
USER_ID = 123

url = f"{BASE_URL}/{USER_ID}/stats/last-visit"

response = requests.get(url)

print("Status code:", response.status_code)
try:
    print("Response JSON:", response.json())
except Exception:
    print("Raw response text:", response.text)

