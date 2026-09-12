import re


def clean_text(text: str) -> str:
    """
    Clean extracted PDF text before chunking.
    """

    # Replace multiple spaces with a single space
    text = re.sub(r"[ \t]+", " ", text)

    # Remove excessive blank lines
    text = re.sub(r"\n\s*\n+", "\n\n", text)

    # Remove spaces at the beginning/end of lines
    lines = [line.strip() for line in text.splitlines()]

    # Remove empty lines
    lines = [line for line in lines if line]

    return "\n".join(lines)