# SE-02 Programming Basics Quiz Engine

This project is a command-line quiz engine written in Python 3. It asks for the player's name and category, validates multiple-choice answers, prevents repeated questions, tracks scores by category, and displays a personalised result summary.

## Setup

The quiz uses only the Python standard library, so it has no third-party dependencies. Clone the repository and enter the project directory:

```bash
git clone https://github.com/muindetuva/alx-mastery_project.git
cd alx-mastery_project/SE-02-programming_basics
```

Python 3.8 or newer is recommended.

## Question bank

The question bank is hardcoded in `questions.py`. Keeping it in a Python module makes the data immediately available without file-loading errors and allows the category-filtering function to live beside the data it manages.

It contains 15 reviewed questions across these categories:

- Python Basics
- JavaScript Basics
- General Programming

## Run the quiz

```bash
python3 main.py
```

Enter a non-empty player name, choose a numbered category or `All`, and answer each question with `A`, `B`, `C`, or `D`. Invalid choices are rejected until a valid answer is entered.

## Module layout

- `questions.py` stores the question bank and category helpers.
- `quiz.py` handles questions, validation, the asked-question set, and scoring.
- `results.py` displays the prepared score summary and performance message.
- `main.py` gathers setup input, connects the modules, and calculates totals.
- `prompt-log.md` records planning and the reviewed AI question-bank prompt.
- `reflection.md` documents lessons from building the project.
