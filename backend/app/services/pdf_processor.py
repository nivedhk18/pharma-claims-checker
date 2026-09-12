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


def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract text from every page of a PDF.
    """

    document = pymupdf.open(file_path)

    pages = []

    for page in document:
        text = page.get_text()
        pages.append(text)

    document.close()

    raw_text = "\n".join(pages)

    return raw_text


def process_pdf(file_path: str) -> list[str]:
    """
    Extract, clean and chunk a PDF.
    """

    raw_text = extract_text_from_pdf(file_path)

    cleaned_text = clean_text(raw_text)

    chunks = chunk_text(
        cleaned_text,
        chunk_size=1000,
        overlap=200
    )

    return chunks