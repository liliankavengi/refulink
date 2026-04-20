import requests
import json

BASE_URL = "http://localhost:8000/api/identity/verify-rin/"

def test_verify_rin():
    # 1. Test Valid Alien ID
    data = {
        "identifier": "12345678"
    }
    print(f"Testing valid identifier: {data['identifier']}")
    try:
        response = requests.post(BASE_URL, json=data)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"Error: {e}")

    print("-" * 20)

    # 2. Test Invalid Alien ID
    data = {
        "identifier": "INVALID-ID"
    }
    print(f"Testing invalid identifier: {data['identifier']}")
    try:
        response = requests.post(BASE_URL, json=data)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"Error: {e}")

    print("-" * 20)

    # 3. Test Missing Data
    data = {}
    print("Testing missing identifier")
    try:
        response = requests.post(BASE_URL, json=data)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    print("Note: Ensure the server is running at http://localhost:8000")
    test_verify_rin()
