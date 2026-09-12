import os

from dotenv import load_dotenv
from google import genai


load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not set in the environment.")

client = genai.Client(api_key=api_key)


EMBEDDING_MODEL = "gemini-embedding-001"


def create_embedding(text: str) -> list[float]:
    """
    Convert text into a numerical embedding vector.
    """

    response = client.models.embed_content(
        model=EMBEDDING_MODEL,
        contents=text,
    )

    return response.embeddings[0].values