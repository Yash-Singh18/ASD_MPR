# QuickDrop SCRUM Plan

Fake quick-delivery platform (Zepto-style). React + FastAPI + PostgreSQL, with Docker, Jenkins, Prometheus, Grafana and GitHub Actions.

## Roles
- Product Owner / Scrum Master / Developer: project team

## Sprints
| Sprint | Goal | Epic |
|---|---|---|
| QD Sprint 0 | Repo, backlog and docs ready | QD-1 |
| QD Sprint 1 | Working CRUD API with tests | QD-2 |
| QD Sprint 2 | Usable React storefront and admin | QD-3 |
| QD Sprint 3 | Whole stack runs with one compose command | QD-4 |
| QD Sprint 4 | CI on GitHub Actions, CD on Jenkins, release branch | QD-5 |
| QD Sprint 5 | Metrics and Grafana dashboard | QD-6 |

Total: 32 issues (6 epics, 26 stories). Backlog: `docs/jira_backlog.csv`.

## Importing the backlog into Jira Cloud
1. Create a project: Projects > Create project > **Scrum** (company-managed), key `QD`.
2. Go to Settings (gear) > System > **External system import** > **CSV**.
3. Upload `docs/jira_backlog.csv`, choose the `QD` project.
4. Map fields:
   - Issue id -> **Issue id**
   - Issue Type -> **Issue Type**
   - Summary -> **Summary**
   - Description -> **Description**
   - Parent -> **Parent** (links stories to their epic)
   - Priority -> **Priority**
   - Story Points -> **Story point estimate** (or Story Points)
   - Sprint -> **Sprint**
   - Labels -> **Labels**
   - Status -> **Status**
5. Map the status value `To Do` and finish the import.

Issues are created in row order, so QD-1..QD-6 are the epics and QD-7..QD-32 are the stories. Commit messages reference these keys.

If your Jira version has no Parent mapping, map Parent to **Epic Link** instead, or drag stories into epics from the backlog view.

## Definition of Done
- Code merged to `main`, tests pass in CI
- Runs under docker compose
- Documented where needed
