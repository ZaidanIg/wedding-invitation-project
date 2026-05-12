# User Guide forClaude AI Code Agent

Welcome to the **Claude AI Code Agent**! This guide will help you understand how to use me effectively to build, debug, and improve software.

## How I Work

I operate based on **Context**, **Instructions**, and **Verification**. Here’s the typical flow:

1.  **Analyze Request**: I first break down your prompt into smaller tasks.
2.  **Retrieve Information**: I access the current project structure, relevant files, and documentation.
3.  **Generate Code/Fixes**: I write or modify code based on the requirements.
4.  **Verify**: I check my work against the project's coding standards and your specific instructions.

---

## 1. How to Give Me Instructions

The quality of my output depends heavily on the quality of your input. Here are the key components of a good instruction:

### 1.1 Define the Goal
Be specific about what you want to achieve.

**Instead of:**
❌ "Fix the bug."

**Say:**
✅ "Fix the `NullPointerException` in `UserService.java` that occurs when processing user creation requests."

### 1.2 Provide Context
Tell me about the current state of the project.

*   **File Locations**: "The files are located in `src/main/java/com/example/app`."
*   **Technologies**: "We are using React with TypeScript and Tailwind CSS."
*   **Current Behavior**: "When I click the save button, it submits the form twice."

### 1.3 Specify Constraints & Standards
Include any rules I must follow.

*   **Coding Standards**: "Please adhere to PEP 8 guidelines."
*   **Performance**: "The solution must have a time complexity of O(n)."
*   **Security**: "Do not use hardcoded credentials. Use environment variables."
*   **Best Practices**: "Prefer functional components over class components."

### 1.4 Request Output Format
Tell me how you want the response.

*   "Provide the code changes in a diff format."
*   "Explain the solution in bullet points."
*   "Generate unit tests for the modified function."
*   "Add comments to the code explaining the changes."

---

## 2. Common Use Cases and Examples

Here are practical examples of how to ask for different types of tasks.

### 2.1 Writing New Code

✅ "Generate a Python function that takes a list of integers and returns the median value. Ensure it handles empty lists by raising a ValueError."

### 2.2 Fixing Bugs

✅ "I'm getting a 404 error on the `/api/users` endpoint. Here is the controller code: [...]. The route is defined in `routes.js`. Please find the issue and fix it."

### 2.3 Refactoring

✅ "Refactor the `UserProfile` component to use React Hooks instead of lifecycle methods. Keep the same functionality but improve readability."

### 2.4 Adding Tests

✅ "Write Jest tests for the `calculateTotal` function in `utils.js`. Include edge cases like negative numbers and zero."

### 2.5 Optimizing Performance

✅ "The `searchProducts` function is too slow. Please optimize it by adding a caching layer for frequently searched terms."

---

## 3. How to Verify My Work

Don’t just accept my code blindly. Here’s how to verify it:

### 3.1 Manual Review
*   Read the code I generated.
*   Check if it matches your requirements and coding standards.
*   Look for obvious errors or security issues.

### 3.2 Run Tests
*   Execute the existing test suite.
*   Run the specific tests I created or updated.

```bash
# Example commands
npm test
pytest
./gradlew test
```

### 3.3 Manual Testing
*   Build and run the application.
*   Test the specific feature I worked on.
*   Check the console for any errors.

### 3.4 Provide Feedback
If my work isn’t perfect, tell me! Be specific:

❌ "This is wrong."
✅ "The function works, but it doesn’t handle negative numbers correctly. When I pass `[-1, -2, -3]`, it should return `-2`, but it returns `3`."

---

## 4. Tips for Best Results

### 4.1 Break Down Complex Tasks
If you have a large task, break it into smaller, manageable steps. It’s easier to verify and fix issues in smaller chunks.

**Instead of:**
❌ "Build a complete authentication system."

**Say:**
1.  "Create the User model and migration."
2.  "Add password hashing using bcrypt."
3.  "Implement the login API endpoint."
4.  "Add JWT authentication."
5.  "Create a login UI form."

### 4.2 Iterate and Refine
If you’re not satisfied with the result, don’t give up. Provide feedback and ask for revisions.

**Example Iteration:**
1.  **You**: "Make the login form look like this: [...]."
2.  **Me**: Generates code.
3.  **You**: "The layout is good, but the fields are not aligned. Please fix the alignment."
4.  **Me**: Adjusts the layout.

### 4.3 Ask for Explanations
If you don’t understand something I did, ask me to explain it.

✅ "Why did you choose a recursive approach for this problem? What are the trade-offs?"

### 4.4 Provide Code Context
When asking about a specific part of the codebase, include relevant code snippets. Don’t assume I remember every detail of the entire project.

---

## 5. What to Do When Things Go Wrong

### 5.1 Check the Logs
If I produce code that doesn’t compile or run, check the error messages:

*   **Compilation Errors**: "I'm getting this compilation error: [...]."
*   **Runtime Errors**: "The app crashes with this stack trace: [...]."

### 5.2 Verify File Paths
Ensure that the file paths I’m using are correct. If not, provide the correct paths.

### 5.3 Verify Dependencies
Make sure I’m aware of all necessary dependencies. If I try to use a function that doesn’t exist, ask me to add the required library.

---

## Summary

| Action | Good Example | Bad Example |
|--------|--------------|-------------|
| **Defining Goal** | "Implement JWT authentication" | "Fix login" |
| **Providing Context** | "Using React and Tailwind" | (None) |
| **Specifying Standards** | "Use TypeScript and functional components" | (None) |
| **Requesting Format** | "Provide code in diff format" | "Give me the code" |
| **Breaking Tasks** | Step-by-step instructions | Single massive request |
| **Verifying** | "Run tests with npm test" | "Hope it works" |

By following these guidelines, you’ll get the most out of our collaboration. I’m here to help you build great software efficiently and effectively!

---

**Ready to start?** Tell me what you’re working on!
