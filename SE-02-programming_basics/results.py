def get_performance_message(percentage):
    if percentage < 50:
        return "Keep practising. Review the basics and try again."
    if percentage <= 80:
        return "Good work. You understand the core ideas."
    return "Excellent work. You have a strong grasp of this topic."


def display_header(player_name):
    print()
    print("=" * 32)
    print(f"Quiz Results for {player_name}")
    print("=" * 32)


def display_total_score(correct, total, percentage):
    print(f"Total Score: {correct}/{total}")
    print(f"Percentage: {percentage:.1f}%")


def display_category_breakdown(category_breakdown):
    print()
    print("Category Breakdown:")
    for category, score in category_breakdown.items():
        print(f"- {category}: {score['correct']}/{score['total']}")


def display_performance_message(percentage):
    print()
    print(get_performance_message(percentage))


def display_results(player_name, correct, total, percentage, category_breakdown):
    display_header(player_name)
    display_total_score(correct, total, percentage)
    display_category_breakdown(category_breakdown)
    display_performance_message(percentage)
