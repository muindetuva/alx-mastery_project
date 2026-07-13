# Reflection

## The hardest shell concept

The hardest shell concept was making the script safe to re-run without accidentally overwriting an existing workspace. The part that took the longest to get right was deciding where the check should happen. The directory check has to run before `mkdir`, README generation, `chmod`, or `git init`, because all of those steps depend on the project folder being safe to create.

I also had to be careful about quoting the variable:

```bash
if [ -d "$PROJECT_NAME" ]; then
```

Using `"$PROJECT_NAME"` consistently matters because project names can contain characters that Bash might otherwise split or interpret incorrectly.

## AI for debugging

One example where AI helped was with the Git workflow branch name. I first used a different branch name, but the task example and checker expected:

```bash
feature/add-readme-generation
```

AI helped identify that the checker might look for the exact branch name, not just any feature branch. It did not only give the fix; it explained why the original branch could fail an automatic check even though it was a valid Git workflow. The fix was to create and push the exact branch name required by the task.

## Git workflow

There was a moment where branching felt unnecessary because the script was small and could have been completed directly on `main`. Looking back, the branch was still useful because it made the history easier to review. The feature branch separated README-generation work from earlier setup and safety commits, and the pull request created a clear checkpoint with a summary and testing notes.

For a tiny assignment, branching feels slower at first. For a real project, it is worth it because it protects `main`, gives reviewers context, and leaves a better record of how the work was built.

## What I would add next

Next, I would add an optional license flag. For example:

```bash
./setup.sh my-project --license MIT
```

Rough implementation:

- keep the first argument as the project name
- check whether a second argument is `--license`
- read the license name from the third argument
- create a `LICENSE` file with matching boilerplate text
- add a `License` section to the generated `README.md`

I would also validate unsupported licenses with a clear error message so the script does not create misleading files.
