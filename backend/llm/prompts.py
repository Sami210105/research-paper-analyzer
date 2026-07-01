from llm.okf_loader import load_for_aspects, load_all

COMPARISON_SYSTEM_PROMPT = """
You are a research paper analyst. You will be given text chunks from multiple research papers.
Each chunk is labeled with its paper_id, aspect, and chunk_index.

Your job is to return a JSON object with this exact structure:
{
  "papers": [
    {
      "paper_id": "the paper_id string",
      "summary": "2-3 sentence summary of what this paper does",
      "summary_citations": [0, 14],
      "methodology": "the core technical approach used",
      "methodology_citations": [3, 7],
      "dataset": "what data was used, or null if not mentioned",
      "dataset_citations": [12],
      "results": "key claimed results or outcomes",
      "results_citations": [8, 11],
      "limitations": "stated or implied limitations, or null if not mentioned",
      "limitations_citations": []
    }
  ],
  "comparisons": [
    {
      "aspect": "e.g. Use of NLP",
      "agreement": true or false,
      "detail": "one sentence explaining how papers agree or differ on this aspect",
      "citations": [
        {"paper_id": "research_paper", "chunk_index": 5},
        {"paper_id": "loan-ai-research paper1", "chunk_index": 23}
      ]
    }
  ]
}

Citation arrays contain chunk_index values from the provided chunks.
Only cite chunk_index values that actually appear in the provided chunks.
Produce exactly one entry per unique paper_id in the papers array.
Return only valid JSON. No explanation, no markdown, no extra text.
"""
METHODOLOGY_SYSTEM_PROMPT = """
You are a research paper analyst. You will be given text chunks from a single research paper.

Your job is to extract the methodology as an ordered list of steps and return this exact JSON structure:
{
  "paper_id": "the paper_id string",
  "methodology_steps": [
    {
      "step": 1,
      "title": "short title for this step",
      "description": "one sentence describing what happens in this step"
    }
  ]
}

Return only valid JSON. No explanation, no markdown, no extra text.
"""
SYNTHESIS_SYSTEM_PROMPT = """
You are a research paper analyst. You will be given comparison results from multiple groups of papers.

Your job is to synthesize them into one final unified comparison with this exact structure:
{
  "papers": [
    {
      "paper_id": "the paper_id string",
      "summary": "2-3 sentence summary of what this paper does",
      "methodology": "the core technical approach used",
      "dataset": "what data was used, or null if not mentioned",
      "results": "key claimed results or outcomes",
      "limitations": "stated or implied limitations, or null if not mentioned"
    }
  ],
  "comparisons": [
    {
      "aspect": "e.g. Use of NLP",
      "agreement": true or false,
      "detail": "one sentence explaining how papers agree or differ on this aspect"
    }
  ]
}

Produce exactly one entry per unique paper_id in the papers array.
Merge duplicate comparison aspects into single entries.
Return only valid JSON. No explanation, no markdown, no extra text.
"""
def build_comparison_prompt() -> str:
    okf = load_for_aspects(["methodology", "results", "dataset", "limitations"])
    
    return f"""## RESEARCH EVALUATION CRITERIA
Use the following as your baseline for quality assessment.
When describing methodology, results, datasets, or limitations — 
evaluate against these criteria, not just describe what the paper says.

{okf}

---

{COMPARISON_SYSTEM_PROMPT}"""


def build_methodology_prompt() -> str:
    okf = load_for_aspects(["methodology"])
    
    return f"""## WHAT GOOD METHODOLOGY LOOKS LIKE
Use this as a checklist when extracting steps.
For each step, note if it meets or misses these criteria.

{okf}

---

{METHODOLOGY_SYSTEM_PROMPT}"""


def build_synthesis_prompt() -> str:
    # synthesis gets everything since it's doing a final pass
    okf = load_all()
    
    return f"""## RESEARCH EVALUATION CRITERIA
{okf}

---

{SYNTHESIS_SYSTEM_PROMPT}"""