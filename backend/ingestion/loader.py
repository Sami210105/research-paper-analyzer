import os
import pdfplumber

def load_documents(folder_path):
    documents = []
    for filename in os.listdir(folder_path):
        if filename.endswith(".txt"):
            path = os.path.join(folder_path, filename)
            with open(path, "r", encoding="utf-8") as f:
                text = f.read()
                documents.append({
                    "source": filename,
                    "text": text
                })
    return documents


def load_pdfs(folder_path):
    documents = []
    for filename in os.listdir(folder_path):
        if filename.endswith(".pdf"):
            path = os.path.join(folder_path, filename)
            with pdfplumber.open(path) as pdf:
                full_text = ""
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        full_text += page_text + "\n"

            paper_id = os.path.splitext(filename)[0]

            documents.append({
                "source": filename,
                "paper_id": paper_id,
                "text": full_text
            })

    return documents


if __name__ == "__main__":
    docs = load_pdfs("../papers")
    print(f"loaded {len(docs)} PDFs")
    for doc in docs:
        print(f"- {doc['paper_id']}: {len(doc['text'])} characters")
