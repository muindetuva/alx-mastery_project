# Production Deployment Evidence

## Live URL

https://quotes.tuva.dev

The production endpoint is expected to serve the quote API through Nginx with
HTTPS termination. The app health URL is `https://quotes.tuva.dev/health`.

## Pipeline Status

The most recent push produced a green run across all 4 jobs: lint, test, build,
and deploy. The recorded workflow run is:

https://github.com/muindetuva/alx-mastery_project/actions/runs/17845291024

## What Would Break This

The deployment can fail silently if `/health` only proves that the FastAPI
process started. A broken `/quote` route or unavailable dependency could leave
the health check green, allowing the deploy job to succeed while the app's real
feature is unusable. A production readiness probe should therefore exercise a
representative dependency and a post-deploy smoke test should request
`/quote?quote_id=1` before the workflow reports success.
