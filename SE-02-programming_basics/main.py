from questions import QUESTIONS, get_categories
from quiz import run_quiz
from results import display_results


def get_player_name(input_func=input):
    """Prompt until the player supplies a non-empty name."""
    while True:
        player_name = input_func("Enter your name: ").strip()
        if player_name:
            return player_name
        print("Please enter a name.")


def choose_category(categories, input_func=input):
    """Display categories and return the player's valid selection."""
    print("Choose a category:")
    for number, category in enumerate(categories, start=1):
        print(f"  {number}) {category}")
    print(f"  {len(categories) + 1}) All")

    while True:
        selection = input_func("> ").strip()
        if selection.isdigit():
            index = int(selection) - 1
            if 0 <= index < len(categories):
                return categories[index]
            if index == len(categories):
                return "All"
        print("Please choose one of the displayed numbers.")


def add_percentages(scores):
    """Return category scores with display-ready percentages."""
    breakdown = {}
    for category, score in scores.items():
        percentage = score["correct"] / score["total"] * 100
        breakdown[category] = {
            "correct": score["correct"],
            "total": score["total"],
            "percentage": percentage,
        }
    return breakdown


def calculate_totals(scores):
    """Return correct, total, and percentage across all categories."""
    correct = sum(score["correct"] for score in scores.values())
    total = sum(score["total"] for score in scores.values())
    percentage = correct / total * 100 if total else 0
    return correct, total, percentage


def main(input_func=input):
    """Run the command-line quiz from setup through results."""
    player_name = get_player_name(input_func)
    category = choose_category(get_categories(), input_func)
    quiz_result = run_quiz(QUESTIONS, category, input_func)
    scores = quiz_result["scores"]
    correct, total, percentage = calculate_totals(scores)
    breakdown = add_percentages(scores)
    display_results(
        player_name,
        correct,
        total,
        percentage,
        breakdown,
    )


if __name__ == "__main__":
    main()
