# Project Reflection

## Hardest bug

The most subtle integration problem was supporting the `All` category. The original quiz filter compared every question's category with the selected category, so choosing `All` produced an empty quiz. I traced the problem by following the category value from the menu into `get_category_questions`, then added an explicit `All` path that returns every indexed question. A simulated full quiz confirmed that all 15 unique questions were asked.

## Module structure

Splitting the program into modules made each responsibility easier to reason about. `questions.py` owns data and category filtering, `quiz.py` owns interaction and scoring, `results.py` only displays prepared values, and `main.py` coordinates them. The less obvious decision was where percentage calculations belonged: they do not belong in the display-only results module, so `main.py` prepares them before calling the renderer.

## AI and the question bank

AI accelerated the first draft of the 15 questions, but every answer still needed checking. I corrected the wording of the JavaScript `const` question because `const` prevents reassignment but does not make an object's contents immutable. This showed that generated educational content can sound convincing while still being imprecise, so factual review remains necessary.

## What I would add next

I would add optional timed questions. The quiz logic would record a start time before displaying each prompt, reject answers submitted after the configured limit, and store response times alongside category scores. The results module could then display average response time without taking responsibility for calculating it.
