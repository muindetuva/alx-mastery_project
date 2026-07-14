# Prompt Log

## Entry 1 - Project Plan and Question Bank

### Planning Questions

**What does each module contain, and what does it import from the others?**

- `question_bank.py` contains the quiz question data. It exports a list called `QUESTIONS`.
- `quiz_logic.py` contains the quiz loop, input validation, category selection, scoring updates, and the set of asked question indexes. It imports `QUESTIONS` from `question_bank.py`.
- `results.py` contains functions that display the final score, category breakdown, and performance message. It does not need to import the question bank.
- `main.py` is the entry point. It asks for the player's name, calls the quiz logic, and passes the final results to the results display module.

I will use Python for this project because dictionaries, lists, and sets make the quiz data and scoring logic straightforward.

**What does a single question look like as a data structure?**

```python
{
    "prompt": "Which keyword defines a function in Python?",
    "choices": ["A. func", "B. def", "C. function", "D. method"],
    "answer": "B",
    "category": "Python Basics"
}
```

Each question will have:

- `prompt`: the question text
- `choices`: a list of multiple-choice answers
- `answer`: the correct choice letter
- `category`: the topic used for filtering and scoring

**What happens if the player types something that is not a valid choice?**

The quiz will reject the input and ask again. Valid answers will be `A`, `B`, `C`, and `D`, case-insensitive. If the player types anything else, the program will print a short message like `Please enter A, B, C, or D.` and repeat the same question without changing the score.

**How will a set of asked questions prevent repeats?**

Each question can be identified by its index in the question list. When a question is asked, its index is added to an `asked_questions` set. Before asking a new question, the quiz will check whether that index is already in the set. If it is, the quiz skips it and looks for another question.

### AI Prompt Used to Generate the Question Bank

```text
Generate a Python question bank for a beginner command-line quiz app.

Return exactly 15 questions across exactly 3 categories:
- Python Basics
- JavaScript Basics
- General Programming

Use this exact structure for each question:
{
    "prompt": "...",
    "choices": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "answer": "A/B/C/D",
    "category": "..."
}

Requirements:
- 5 questions per category
- each question must have exactly 4 choices
- correct answers must be accurate
- keep the wording beginner-friendly
- do not include explanations, only the list of dictionaries
```

### Reviewed Question Bank

I reviewed the generated questions before using them. I checked that each question had four choices, one correct answer letter, and one of the three required categories.

Final approved question bank:

```python
QUESTIONS = [
    {
        "prompt": "Which keyword defines a function in Python?",
        "choices": ["A. func", "B. def", "C. function", "D. method"],
        "answer": "B",
        "category": "Python Basics"
    },
    {
        "prompt": "Which Python data type stores ordered items and can be changed?",
        "choices": ["A. tuple", "B. string", "C. list", "D. integer"],
        "answer": "C",
        "category": "Python Basics"
    },
    {
        "prompt": "What does len([1, 2, 3]) return in Python?",
        "choices": ["A. 2", "B. 3", "C. 4", "D. 6"],
        "answer": "B",
        "category": "Python Basics"
    },
    {
        "prompt": "Which symbol starts a comment in Python?",
        "choices": ["A. //", "B. <!--", "C. #", "D. /*"],
        "answer": "C",
        "category": "Python Basics"
    },
    {
        "prompt": "Which Python structure stores key-value pairs?",
        "choices": ["A. list", "B. dictionary", "C. tuple", "D. set"],
        "answer": "B",
        "category": "Python Basics"
    },
    {
        "prompt": "Which keyword declares a constant-like variable in JavaScript?",
        "choices": ["A. var", "B. let", "C. const", "D. fixed"],
        "answer": "C",
        "category": "JavaScript Basics"
    },
    {
        "prompt": "Which method prints output to the console in JavaScript?",
        "choices": ["A. console.log()", "B. print()", "C. echo()", "D. write()"],
        "answer": "A",
        "category": "JavaScript Basics"
    },
    {
        "prompt": "Which JavaScript data type represents true or false?",
        "choices": ["A. string", "B. boolean", "C. number", "D. object"],
        "answer": "B",
        "category": "JavaScript Basics"
    },
    {
        "prompt": "How do you access the first item in a JavaScript array named items?",
        "choices": ["A. items[1]", "B. items.first", "C. items[0]", "D. items.get(0)"],
        "answer": "C",
        "category": "JavaScript Basics"
    },
    {
        "prompt": "Which JavaScript statement is used for a conditional branch?",
        "choices": ["A. if", "B. repeat", "C. define", "D. import"],
        "answer": "A",
        "category": "JavaScript Basics"
    },
    {
        "prompt": "What is a loop used for?",
        "choices": ["A. Storing one number", "B. Repeating instructions", "C. Ending a program", "D. Naming a file"],
        "answer": "B",
        "category": "General Programming"
    },
    {
        "prompt": "What is a variable used for?",
        "choices": ["A. To store a value", "B. To delete code", "C. To run the terminal", "D. To close a file"],
        "answer": "A",
        "category": "General Programming"
    },
    {
        "prompt": "What does debugging mean?",
        "choices": ["A. Writing comments", "B. Finding and fixing errors", "C. Renaming variables", "D. Installing software"],
        "answer": "B",
        "category": "General Programming"
    },
    {
        "prompt": "What is a function?",
        "choices": ["A. A reusable block of code", "B. A file extension", "C. A type of computer", "D. A syntax error"],
        "answer": "A",
        "category": "General Programming"
    },
    {
        "prompt": "What does input validation help prevent?",
        "choices": ["A. Invalid or unexpected user input", "B. All program output", "C. Creating variables", "D. Using functions"],
        "answer": "A",
        "category": "General Programming"
    }
]
```

### Changes Made After Review

- I corrected the wording of the JavaScript `const` question so it says `constant-like variable`, because JavaScript constants prevent reassignment but do not make object contents fully immutable.
- I kept the `10`-style beginner wording out of the questions and made every prompt readable for someone new to programming.
- I confirmed the final bank has 15 questions total, 5 per category, and every answer letter matches the correct choice.
