import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
DEFAULT_MODEL = "gemini-2.0-flash"

client = genai.Client(api_key=GEMINI_API_KEY)

def call_gemini(
    messages: list[dict],
    temperature: float = 0.3,
    max_tokens: int = 2048,
    json_mode: bool = False,
) -> str:
    if not GEMINI_API_KEY:
        raise ValueError(
            "GEMINI_API_KEY not found. Make sure it's set in your .env file."
        )

    # convert messages list to Gemini format
    system_prompt = ""
    conversation = []

    for msg in messages:
        if msg["role"] == "system":
            system_prompt = msg["content"]
        elif msg["role"] == "user":
            conversation.append(types.Part.from_text(text=msg["content"]))

    config = types.GenerateContentConfig(
        temperature=temperature,
        max_output_tokens=max_tokens,
        system_instruction=system_prompt,
        response_mime_type="application/json" if json_mode else "text/plain",
    )

    response = client.models.generate_content(
        model=DEFAULT_MODEL,
        contents=conversation,
        config=config,
    )

    return response.text