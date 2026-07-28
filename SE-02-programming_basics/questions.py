QUESTIONS = [
    {
        "prompt": "Which keyword defines a function in Python?",
        "choices": [
            "A. func",
            "B. def",
            "C. function",
            "D. method",
        ],
        "answer": "B",
        "category": "Python Basics",
    },
    {
        "prompt": "Which mutable Python type stores ordered items?",
        "choices": [
            "A. tuple",
            "B. string",
            "C. list",
            "D. integer",
        ],
        "answer": "C",
        "category": "Python Basics",
    },
    {
        "prompt": "What does len([1, 2, 3]) return in Python?",
        "choices": [
            "A. 2",
            "B. 3",
            "C. 4",
            "D. 6",
        ],
        "answer": "B",
        "category": "Python Basics",
    },
    {
        "prompt": "Which symbol starts a comment in Python?",
        "choices": [
            "A. //",
            "B. <!--",
            "C. #",
            "D. /*",
        ],
        "answer": "C",
        "category": "Python Basics",
    },
    {
        "prompt": "Which Python structure stores key-value pairs?",
        "choices": [
            "A. list",
            "B. dictionary",
            "C. tuple",
            "D. set",
        ],
        "answer": "B",
        "category": "Python Basics",
    },
    {
        "prompt": (
            "Which keyword declares a constant-like JavaScript variable?"
        ),
        "choices": [
            "A. var",
            "B. let",
            "C. const",
            "D. fixed",
        ],
        "answer": "C",
        "category": "JavaScript Basics",
    },
    {
        "prompt": "Which method prints output in JavaScript?",
        "choices": [
            "A. console.log()",
            "B. print()",
            "C. echo()",
            "D. write()",
        ],
        "answer": "A",
        "category": "JavaScript Basics",
    },
    {
        "prompt": "Which JavaScript type represents true or false?",
        "choices": [
            "A. string",
            "B. boolean",
            "C. number",
            "D. object",
        ],
        "answer": "B",
        "category": "JavaScript Basics",
    },
    {
        "prompt": "How do you access the first item in the array items?",
        "choices": [
            "A. items[1]",
            "B. items.first",
            "C. items[0]",
            "D. items.get(0)",
        ],
        "answer": "C",
        "category": "JavaScript Basics",
    },
    {
        "prompt": "Which JavaScript statement creates a conditional branch?",
        "choices": [
            "A. if",
            "B. repeat",
            "C. define",
            "D. import",
        ],
        "answer": "A",
        "category": "JavaScript Basics",
    },
    {
        "prompt": "What is a loop used for?",
        "choices": [
            "A. Storing one number",
            "B. Repeating instructions",
            "C. Ending a program",
            "D. Naming a file",
        ],
        "answer": "B",
        "category": "General Programming",
    },
    {
        "prompt": "What is a variable used for?",
        "choices": [
            "A. To store a value",
            "B. To delete code",
            "C. To run the terminal",
            "D. To close a file",
        ],
        "answer": "A",
        "category": "General Programming",
    },
    {
        "prompt": "What does debugging mean?",
        "choices": [
            "A. Writing comments",
            "B. Finding and fixing errors",
            "C. Renaming variables",
            "D. Installing software",
        ],
        "answer": "B",
        "category": "General Programming",
    },
    {
        "prompt": "What is a function?",
        "choices": [
            "A. A reusable block of code",
            "B. A file extension",
            "C. A type of computer",
            "D. A syntax error",
        ],
        "answer": "A",
        "category": "General Programming",
    },
    {
        "prompt": "What does input validation help prevent?",
        "choices": [
            "A. Invalid or unexpected input",
            "B. All program output",
            "C. Creating variables",
            "D. Using functions",
        ],
        "answer": "A",
        "category": "General Programming",
    },
]


def get_questions_by_category(category):
    """Return all questions belonging to category."""
    return [
        question
        for question in QUESTIONS
        if question["category"] == category
    ]


def get_categories():
    """Return category names in their question-bank order."""
    return list(dict.fromkeys(question["category"] for question in QUESTIONS))
