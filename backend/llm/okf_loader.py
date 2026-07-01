from pathlib import Path

KNOWLEDGE_DIR = Path(__file__).parent / "knowledge"

ASPECT_MAP = {
    "methodology": ["methodology.md", "strong-methodology.md", "weak-methodology.md"],
    "results":     ["results.md", "dataset-quality.md"],
    "dataset":     ["dataset.md", "dataset-quality.md"],
    "limitations": ["limitations.md", "weak-methodology.md"],
}

def load_for_aspects(aspects: list[str]) -> str:
    seen = set()
    content = ""

    for aspect in aspects:
        for filename in ASPECT_MAP.get(aspect, []):
            if filename in seen:
                continue
            seen.add(filename)

            matches = list(KNOWLEDGE_DIR.rglob(filename))
            if matches:
                content += f"\n\n### {filename}\n"
                content += matches[0].read_text(encoding="utf-8")

    return content


def load_all() -> str:
    """Fallback — load every OKF file"""
    content = ""
    for file in sorted(KNOWLEDGE_DIR.rglob("*.md")):
        content += f"\n\n### {file.stem}\n"
        content += file.read_text(encoding="utf-8")
    return content