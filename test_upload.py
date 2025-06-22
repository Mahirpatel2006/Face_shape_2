import requests
import os

# --- Configuration ---
# Make sure you have a test image in your project directory
# Or provide a full path to an image file.
TEST_IMAGE_PATH = "public/placeholder.jpg" 
FLASK_SERVER_URL = "http://127.0.0.1:5000/analyze"

def test_analysis_endpoint():
    """
    Sends a test image to the /analyze endpoint and prints the response.
    """
    if not os.path.exists(TEST_IMAGE_PATH):
        print(f"Error: Test image not found at '{TEST_IMAGE_PATH}'")
        print("Please make sure the file exists.")
        return

    try:
        # Open the image file in binary mode
        with open(TEST_IMAGE_PATH, 'rb') as f:
            files = {'file': (os.path.basename(TEST_IMAGE_PATH), f, 'image/jpeg')}
            
            print(f"Sending request to {FLASK_SERVER_URL}...")
            response = requests.post(FLASK_SERVER_URL, files=files)
            
            # Check the response
            if response.status_code == 200:
                print("✅ Request successful!")
                print("Response JSON:")
                print(response.json())
            else:
                print(f"❌ Request failed with status code: {response.status_code}")
                print("Response content:")
                print(response.text)

    except requests.exceptions.RequestException as e:
        print(f"An error occurred while making the request: {e}")

if __name__ == "__main__":
    test_analysis_endpoint() 