# import  pymupdf


# def extract_text_from_pdf(file_path: str) -> str:
#     """
#     Extract text from every page of a PDF.
#     """

#     document =  pymupdf.open(file_path)

#     pages = []

#     for page in document:
#         text = page.get_text()
#         pages.append(text)

#     document.close()

#     return "\n".join(pages)
import pymupdf

from app.services.text_cleaner import clean_text
from app.services.chunker import chunk_text


def extract_pages_from_pdf(file_path: str) -> list[dict]:
    """
    Extract text from a PDF while preserving the page number.
    """

    document = pymupdf.open(file_path)

    pages = []

    for page_number, page in enumerate(document, start=1):
        text = page.get_text()

        if text.strip():
            pages.append(
                {
                    "page": page_number,
                    "text": text,
                }
            )

    document.close()

    return pages


def process_pdf(file_path: str) -> list[dict]:
    """
    Clean and chunk PDF text while preserving page numbers.
    """

    pages = extract_pages_from_pdf(file_path)

    processed_chunks = []

    for page in pages:
        cleaned_text = clean_text(page["text"])

        chunks = chunk_text(
            cleaned_text,
            chunk_size=1000,
            overlap=200,
        )

        for chunk in chunks:
            processed_chunks.append(
                {
                    "text": chunk,
                    "page": page["page"],
                }
            )

    return processed_chunks