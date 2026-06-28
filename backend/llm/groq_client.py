import os
import requests
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

DEFAULT_MODEL = "llama-3.3-70b-versatile"

def call_groq(
    messages: list[dict],
    model: str = DEFAULT_MODEL,
    temperature: float=0.3,
    max_tokens: int=1024,
    json_mode: bool = False,
) -> str:
    """
    Send a chat-completion request to Groq and return the model's text reply.
    """
    if not GROQ_API_KEY:
        raise ValueError(
            "GROQ_API_KEY not found. Make sure it's set in your .env file "
            "as GROQ_API_KEY=your_key_here"
        )
        
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }
    
    payload = {
        "model": model,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
    }
    
    if json_mode:
        payload["response_format"] = {"type": "json_object"}
        
    response = requests.post(GROQ_API_URL, headers=headers, json=payload, timeout=60)
        
    if response.status_code != 200:
        raise RuntimeError(
            f"Groq API error {response.status_code}: {response.text}"
        )            
    data = response.json()
            
    return data["choices"][0]["message"]["content"]