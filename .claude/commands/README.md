# Custom Slash Commands

This directory contains reusable workflow commands for Claude Code.

## Available Commands

### `/fix-issue [issue-number]`
Automatically analyzes and fixes a GitHub issue.

**Example:**
```
/fix-issue 42
```

**What it does:**
1. Fetches issue details from GitHub
2. Analyzes the problem
3. Locates relevant files
4. Implements the fix
5. Writes/updates tests
6. Creates a commit with conventional format
7. Optionally creates a PR

---

### `/create-component [ComponentName]`
Generates a new React component with tests and proper structure.

**Example:**
```
/create-component UserProfile
```

**What it does:**
1. Creates component in `components/` directory
2. Generates React Testing Library tests
3. Creates TypeScript interface for props
4. Ensures responsive and accessible design
5. Exports from index.ts
6. Updates Storybook if applicable

---

### `/deploy`
Prepares the application for deployment with full validation.

**Example:**
```
/deploy
```

**What it does:**
1. Runs test suite
2. Builds for production
3. Runs linter
4. Generates CHANGELOG if needed
5. Creates PR with complete description
6. Tags version following semver

---

### `/security-audit`
Performs a comprehensive security audit of the codebase.

**Example:**
```
/security-audit
```

**What it does:**
1. Scans dependencies with `npm audit`
2. Checks for exposed secrets
3. Reviews input validation
4. Verifies auth/authz implementation
5. Tests rate limiting
6. Checks CORS configuration
7. Generates detailed security report

---

## Creating New Commands

To create a new slash command:

1. Create a new `.md` file in this directory
2. Use `$ARGUMENTS` to accept parameters
3. Write clear step-by-step instructions
4. Document the command in this README

**Example structure:**
```markdown
Do something with: $ARGUMENTS

1. First step
2. Second step
3. Third step
```

## Usage Tips

- Commands are automatically discovered by Claude Code
- Use descriptive command names (kebab-case)
- Keep commands focused on a single workflow
- Include error handling in command steps
- Document expected arguments

---

**Reference:** See `claude.md` for the complete S-Tier workflow methodology.
