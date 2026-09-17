def chunk_text(
    text: str,
    chunk_size: int = 1200,
    overlap: int = 200,
) -> list[str]:
    """
    Split text into paragraph-aware chunks.

    Paragraphs are kept together whenever possible.
    A small overlap is added between chunks to preserve context.
    """

    if not text.strip():
        return []

    # Split the document into paragraphs.
    paragraphs = [
        paragraph.strip()
        for paragraph in text.split("\n\n")
        if paragraph.strip()
    ]

    chunks = []
    current_chunk = ""

    for paragraph in paragraphs:

        # If adding this paragraph keeps us within the target size,
        # add it to the current chunk.
        if (
            current_chunk
            and len(current_chunk) + len(paragraph) + 2
            <= chunk_size
        ):
            current_chunk += "\n\n" + paragraph

        elif not current_chunk:
            current_chunk = paragraph

        else:
            # Current chunk is full, so save it.
            chunks.append(current_chunk)

            # Keep the last part of the previous chunk as overlap.
            overlap_text = current_chunk[-overlap:]

            current_chunk = (
                overlap_text
                + "\n\n"
                + paragraph
            )

    # Add the final chunk.
    if current_chunk:
        chunks.append(current_chunk)

    return chunks