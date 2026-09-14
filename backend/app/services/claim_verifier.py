import os

from dotenv import load_dotenv
from google import genai


load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not set in the environment.")

client = genai.Client(api_key=api_key)

GENERATION_MODEL = "gemini-3.6-flash"


def verify_claim(
    claim: str,
    evidence_chunks: list[str],
) -> str:
    """
    Verify a pharmaceutical claim against retrieved evidence.
    """

    evidence_text = "\n\n".join(
        f"Evidence {index + 1}:\n{chunk}"
        for index, chunk in enumerate(evidence_chunks)
    )

    prompt = f"""
You are a pharmaceutical claims verification assistant.

Your task is to evaluate a user's claim ONLY against the
provided evidence.

Do not use outside knowledge.

Classify the claim as exactly one of:

SUPPORTED
CONTRADICTED
INSUFFICIENT_EVIDENCE

Definitions:

SUPPORTED:
The provided evidence supports the claim.

CONTRADICTED:
The provided evidence directly conflicts with the claim.

INSUFFICIENT_EVIDENCE:
The provided evidence does not contain enough information
to determine whether the claim is true or false.

User claim:
{claim}

Evidence:
{evidence_text}

Return only one classification:
SUPPORTED
CONTRADICTED
or
INSUFFICIENT_EVIDENCE
"""

    interaction = client.interactions.create(
        model=GENERATION_MODEL,
        input=prompt,
    )

    return interaction.output_text.strip()

