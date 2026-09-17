import json
from pathlib import Path

from app.services.rag_pipeline import verify_claim_with_rag


# Path to our evaluation dataset
TEST_CASES_FILE = Path("evaluation/test_cases.json")


def load_test_cases() -> list[dict]:
    """
    Load evaluation cases from the JSON file.
    """

    with TEST_CASES_FILE.open(
        "r",
        encoding="utf-8",
    ) as file:
        return json.load(file)


def evaluate() -> None:
    """
    Run every evaluation case through the RAG pipeline
    and compare the actual verdict with the expected verdict.
    """

    test_cases = load_test_cases()

    total_cases = len(test_cases)
    correct_cases = 0

    print("\n==============================")
    print("RAG CLAIM VERIFICATION EVALUATION")
    print("==============================\n")

    for test_case in test_cases:

        claim = test_case["claim"]
        expected_verdict = test_case["expected_verdict"]

        print(f"Test {test_case['id']}")
        print(f"Claim: {claim}")
        print(f"Expected: {expected_verdict}")

        try:
            result = verify_claim_with_rag(
                claim=claim,
                medicine="amoxicillin",
                top_k=5,
            )

            actual_verdict = result["result"]["verdict"]

            print(f"Actual:   {actual_verdict}")

            # Compare expected and actual verdicts.
            if actual_verdict == expected_verdict:
                correct_cases += 1
                print("Result:   PASS")

            else:
                print("Result:   FAIL")

                print("Retrieved pages:")

                for evidence in result["evidence"]:
                    print(
                        f"  Page {evidence['page']} "
                        f"(distance={evidence['distance']:.4f})"
                    )

        except Exception as error:

            print("Result:   ERROR")
            print(f"Error: {error}")

        print("-" * 60)

    accuracy = (
        correct_cases / total_cases
        if total_cases > 0
        else 0
    )

    print("\n==============================")
    print("EVALUATION SUMMARY")
    print("==============================")

    print(f"Total cases:   {total_cases}")
    print(f"Correct cases: {correct_cases}")
    print(f"Accuracy:      {accuracy:.2%}")

    print("==============================\n")


if __name__ == "__main__":
    evaluate()