import uvicorn
import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
import urllib.parse

# --- App Initialization ---
app = FastAPI(
    title="Air Quality API (Final)",
    description="A robust API that correctly parses the data.gov.in response, handling 'NA' values.",
    version="6.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

# --- Pydantic Models ---
class AQIData(BaseModel):
    aqi: int
    city: str
    state: str
    category: str
    raw_pm25: float
    last_updated: str

# --- Helper Functions ---
def calculate_pm25_aqi(concentration: float) -> int:
    c = round(concentration)
    breakpoints = [
        (0, 30, 0, 50), (31, 60, 51, 100), (61, 90, 101, 200),
        (91, 120, 201, 300), (121, 250, 301, 400), (251, float('inf'), 401, 500)
    ]
    for c_low, c_high, i_low, i_high in breakpoints:
        if c_low <= c <= c_high:
            return round(((i_high - i_low) / (c_high - c_low)) * (c - c_low) + i_low)
    return 500

def get_aqi_category(aqi: int) -> str:
    if aqi <= 50: return "Good"
    if aqi <= 100: return "Satisfactory"
    if aqi <= 200: return "Moderate"
    if aqi <= 300: return "Poor"
    if aqi <= 400: return "Very Poor"
    return "Severe"

# ==============================================================================
# FINAL, MOST ROBUST FUNCTION TO PROCESS THE API RESPONSE
# ==============================================================================
def process_api_response(response: requests.Response) -> AQIData:
    try:
        response.raise_for_status()
        data = response.json()
        if not data or not data.get('records'):
            raise HTTPException(status_code=404, detail="No records found for the specified location.")

        # Loop through the records to find the first one with valid data
        for record in data['records']:
            # 1. Use the correct key: 'avg_value'
            raw_pm25_str = record.get('avg_value')
            last_updated_str = record.get('last_update')
            city_name = record.get('city', 'Unknown')
            state_name = record.get('state', 'Unknown')

            # 2. Check for "NA" values before trying to convert to a float
            if raw_pm25_str and raw_pm25_str != "NA" and last_updated_str:
                raw_pm25_val = float(raw_pm25_str)
                calculated_aqi = calculate_pm25_aqi(raw_pm25_val)
                aqi_category = get_aqi_category(calculated_aqi)

                # If we found a valid record, return it immediately
                return AQIData(
                    aqi=calculated_aqi, city=city_name, state=state_name,
                    category=aqi_category, raw_pm25=raw_pm25_val, last_updated=last_updated_str
                )

        # If the loop finishes and no valid record was found
        raise HTTPException(status_code=404, detail="Data was found, but all recent records had 'NA' values.")

    except requests.exceptions.HTTPError as e:
         raise HTTPException(status_code=e.response.status_code, detail=f"Error from external API: {e.response.text}")
    except requests.exceptions.RequestException:
        raise HTTPException(status_code=503, detail="Error connecting to the external AQI data provider.")


@app.get("/api/aqi/by-city", response_model=AQIData)
def get_aqi_by_city(city: str, state: str):
    # Sanitize inputs to be URL-safe
    safe_city = urllib.parse.quote(city.strip())
    safe_state = urllib.parse.quote(state.strip())

    API_KEY = "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b"
    # Fetch up to 10 recent records to increase chances of finding a valid one
    API_URL = (
        "https://api.data.gov.in/resource/3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69"
        f"?api-key={API_KEY}&format=json&limit=10"
        f"&filters[state]={safe_state}&filters[city]={safe_city}&filters[pollutant_id]=PM2.5"
    )
    
    print(f"Requesting URL: {API_URL}") # For debugging
    
    response = requests.get(API_URL, timeout=10)
    return process_api_response(response)

@app.get("/api/aqi/by-coords", response_model=AQIData)
def get_aqi_by_coordinates(lat: float, lon: float):
    API_KEY = "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b"
    API_URL = (
        "https://api.data.gov.in/resource/3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69"
        f"?api-key={API_KEY}&format=json&limit=10"
        f"&filters[latitude]={lat}&filters[longitude]={lon}&filters[pollutant_id]=PM2.5"
    )
    response = requests.get(API_URL, timeout=10)
    return process_api_response(response)