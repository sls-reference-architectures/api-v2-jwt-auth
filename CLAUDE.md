# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm test                # lint + unit tests
npm run lint            # ESLint only
npm run lint:fix        # ESLint with auto-fix
npm run test:e2e        # E2E tests against deployed AWS stack (requires AWS credentials)

npm run deploy:infra    # Deploy Cognito/infrastructure stack first
npm run deploy:app      # Deploy app stack (depends on infra stack outputs)
npm run teardown:app    # Remove app stack
npm run teardown:infra  # Remove infra stack
```

Run a single unit test file:

```bash
npx jest test/createTokenValidator.unit.test.js
```

## Architecture

This is a reference architecture demonstrating JWT authentication with AWS HTTP API Gateway using Cognito as the identity provider. It demonstrates the OAuth2 **client credentials flow** — machine-to-machine auth with optional scope enforcement.

### Two-Stack Deployment

The project splits into two Serverless Framework stacks intentionally:

- **`api-v2-jwt-auth-infra`** (`serverless.infrastructure.yml`) — creates the Cognito User Pool, User Pool Domain, Resource Server (with scopes), and two test clients (one with `bonjour.read` scope, one without). Outputs are consumed by the app stack via CloudFormation cross-stack references (`${cf:api-v2-jwt-auth-infra-dev.*}`).

- **`api-v2-jwt-auth`** (`serverless.yml`) — the Lambda functions and HTTP API with a JWT authorizer wired to the Cognito pool. Must be deployed after infra.

### Source (`src/`)

- **`helloHandler.js`** — the protected resource endpoint, reused for both `/hello` (no scope required) and `/bonjour` (requires `client-credentials-flow-demo/bonjour.read` scope, enforced at API Gateway level).
- **`createTokenHandler.js`** — exchanges client credentials for a Cognito JWT via the `/oauth2/token` endpoint. Reads `USER_POOL_DOMAIN` and `AWS_REGION` from env.
- **`createTokenValidator.js`** — Joi schema validation for the token request body; throws `http-errors` `BadRequest` on failure.

### Tests (`test/`)

- `*.unit.test.js` — run locally, no AWS required. Matched by `npm test`.
- `*.e2e.test.js` — require a deployed stack. `jest.setup.js` runs as `globalSetup`: it reads CloudFormation stack outputs, retrieves Cognito client secrets, obtains tokens, and populates `process.env` for the test run. Key env vars set: `API_URL`, `SCOPED_TEST_TOKEN`, `UNSCOPED_TEST_TOKEN`, `SCOPED_TEST_CLIENT_ID/SECRET`, `UNSCOPED_TEST_CLIENT_ID/SECRET`.

### Scope Model

The Cognito Resource Server identifier is `client-credentials-flow-demo`. Two scopes are exercised in E2E tests:

- `/hello` — accessible to any valid JWT in the audience
- `/bonjour` — additionally requires scope `client-credentials-flow-demo/bonjour.read`

The `BonjourlessIntegrationTestClient` Cognito client has only `hello.read` scope and is used to verify 403 enforcement on `/bonjour`.
