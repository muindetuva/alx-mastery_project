VALID_CHOICES = {"A", "B", "C", "D"}


def get_category_questions(questions, category):
    return [
        (index, question)
        for index, question in enumerate(questions)
        if question["category"] == category
    ]


def get_next_question(category_questions, asked_questions):
    for index, question in category_questions:
        if index not in asked_questions:
            return index, question
    return None, None


def display_question(question):
    print()
    print(question["prompt"])
    for choice in question["choices"]:
        print(choice)


def get_valid_answer(input_func=input):
    while True:
        answer = input_func("Your answer (A-D): ").strip().upper()
        if answer in VALID_CHOICES:
            return answer
        print("Please enter A, B, C, or D.")


def is_correct_answer(question, answer):
    return answer == question["answer"].upper()


def update_score(scores, category, is_correct):
    if category not in scores:
        scores[category] = {"correct": 0, "total": 0}

    scores[category]["total"] += 1
    if is_correct:
        scores[category]["correct"] += 1


def ask_question(index, question, scores, asked_questions, input_func=input):
    display_question(question)
    answer = get_valid_answer(input_func)
    correct = is_correct_answer(question, answer)

    if correct:
        print("Correct!")
    else:
        print(f"Wrong. The correct answer was {question['answer']}.")

    update_score(scores, question["category"], correct)
    asked_questions.add(index)


def run_quiz(questions, category, input_func=input):
    category_questions = get_category_questions(questions, category)
    asked_questions = set()
    scores = {}

    while len(asked_questions) < len(category_questions):
        index, question = get_next_question(category_questions, asked_questions)
        if question is None:
            break
        ask_question(index, question, scores, asked_questions, input_func)

    return {
        "scores": scores,
        "asked_questions": asked_questions
    }
