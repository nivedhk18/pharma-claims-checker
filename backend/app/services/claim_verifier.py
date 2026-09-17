import json
import os

from dotenv import load_dotenv
from google import genai


# Load environment variables from .env
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not set in the environment.")


# Create Gemini client
client = genai.Client(api_key=api_key)

GENERATION_MODEL = "gemini-3.6-flash"


def verify_claim(
    claim: str,
    evidence_chunks: list[str],
) -> dict:
    """
    Verify a pharmaceutical claim using only
    the evidence retrieved from the vector database.
    """

    # Combine retrieved evidence into one prompt section.
    evidence_text = "\n\n".join(
        f"Evidence {index + 1}:\n{chunk}"
        for index, chunk in enumerate(evidence_chunks)
    )

    prompt = f"""
You are a pharmaceutical claims verification assistant.

Your task is to evaluate a pharmaceutical claim ONLY
against the provided evidence.

Do NOT use outside medical knowledge.

The evidence comes from pharmaceutical product documents
such as official drug labels.

Classify the claim as exactly ONE of these five verdicts:

SUPPORTED
PARTIALLY_SUPPORTED
UNSUPPORTED
MISSING_SAFETY_INFORMATION
INSUFFICIENT_EVIDENCE


VERDICT DEFINITIONS
===================

SUPPORTED:
Use this when the provided evidence directly supports
the complete claim without any important contradiction,
overgeneralization, or missing condition.

PARTIALLY_SUPPORTED:
Use this when an important part of the claim is supported,
but another part is incorrect, overgeneralized, incomplete,
or applies only under conditions that the claim does not state.

Example:
If the evidence supports a dosage for certain infections,
but the claim presents that dosage as applying to all infections,
use PARTIALLY_SUPPORTED.

UNSUPPORTED:
Use this when the provided evidence directly contradicts
the substantive claim and there is no meaningful portion
of the claim that can be considered supported.

MISSING_SAFETY_INFORMATION:
Use this when the claim concerns a safety-related statement,
warning, contraindication, precaution, adverse reaction,
drug interaction, pregnancy information, or similar safety
information, and the retrieved evidence does not contain
the information needed to verify that safety claim.

INSUFFICIENT_EVIDENCE:
Use this when the provided evidence does not contain enough
information to determine whether the claim is supported,
partially supported, or unsupported.

IMPORTANT:
Do NOT use INSUFFICIENT_EVIDENCE simply because the claim
is complex.

Use INSUFFICIENT_EVIDENCE only when the retrieved evidence
actually lacks the information needed to evaluate the claim.


GENERAL RULES
=============

1. Use ONLY the provided evidence.

2. Do NOT use outside medical knowledge.

3. Do NOT assume information that is not explicitly present
   in the evidence.

4. Pay attention to conditions, patient groups, dosage,
   disease severity, route of administration, timing,
   contraindications, and other qualifiers.

5. A claim that removes an important condition from the
   evidence may be PARTIALLY_SUPPORTED rather than SUPPORTED.

6. If one part of a multi-part claim is supported and another
   part is contradicted or incorrect, use PARTIALLY_SUPPORTED
   when the supported portion is meaningful.

7. Use UNSUPPORTED when the evidence directly conflicts
   with the main substance of the claim.

8. Use MISSING_SAFETY_INFORMATION only for safety-related
   claims where the required safety information is absent.

9. Confidence represents confidence in the classification,
   NOT medical certainty.

10. Do not invent evidence.

11. Keep explanations concise and evidence-based.

12. supported_points must contain only points directly
    supported by the evidence.

13. unsupported_points must contain only points that are
    unsupported, contradicted, overgeneralized, or incorrect
    according to the evidence.

14. missing_information must contain important information
    that is necessary to evaluate the claim but is absent
    from the evidence.


OUTPUT FORMAT
=============

Return ONLY valid JSON.

Do not use Markdown.
Do not wrap the JSON in ```json code fences.

Use exactly this structure:

{{
  "verdict": "SUPPORTED",
  "confidence": 0.0,
  "explanation": "Brief explanation based only on the evidence.",
  "supported_points": [],
  "unsupported_points": [],
  "missing_information": []
}}

The verdict MUST be exactly one of:

SUPPORTED
PARTIALLY_SUPPORTED
UNSUPPORTED
MISSING_SAFETY_INFORMATION
INSUFFICIENT_EVIDENCE

The confidence MUST be a number between 0 and 1.



USER CLAIM
==========

{claim}


PROVIDED EVIDENCE
=================

{evidence_text}
"""

    # Send the claim + retrieved evidence to Gemini.
    interaction = client.interactions.create(
        model=GENERATION_MODEL,
        input=prompt,
    )

    response_text = interaction.output_text.strip()

    # Defensive handling in case Gemini still returns Markdown fences.
    if response_text.startswith("```"):
        response_text = response_text.replace("```json", "", 1)
        response_text = response_text.replace("```", "", 1)
        response_text = response_text.strip()

    # Convert Gemini's JSON string into a Python dictionary.
    try:
        result = json.loads(response_text)

    except json.JSONDecodeError:
        raise ValueError(
            f"Gemini returned invalid JSON: {response_text}"
        )

    # Validate the verdict ourselves.
    allowed_verdicts = {
        "SUPPORTED",
        "PARTIALLY_SUPPORTED",
        "UNSUPPORTED",
        "MISSING_SAFETY_INFORMATION",
        "INSUFFICIENT_EVIDENCE",
    }

    if result.get("verdict") not in allowed_verdicts:
        raise ValueError(
            f"Invalid verdict returned by Gemini: "
            f"{result.get('verdict')}"
        )

    return result