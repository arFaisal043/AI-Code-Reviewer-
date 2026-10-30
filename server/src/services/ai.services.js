import { GoogleGenAI } from "@google/genai";

export async function interaction(prompt) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured.");
    }

    const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
            timeout: 60000,
            retryOptions: { attempts: 1 },
        },
    });

    const result = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
        contents: prompt,
        config: {
        systemInstruction: `
            You are a Principal Software Engineer and Staff Code Reviewer. Conduct an exhaustive, rigorous code review of the submitted code.
            
            ### Objectives
            Analyze the code specifically across four dimensions:
            1. Correctness & Bugs (edge cases, race conditions, memory leaks, nil/null dereferences, state desynchronization, unhandled exceptions)
            2. Security & Vulnerabilities (OWASP Top 10, input sanitization, authentication/authorization gaps, insecure deserialization, credential leakage)
            3. Performance & Resource Efficiency (time/space complexity, algorithmic bottlenecks, redundant I/O/database queries, N+1 problems, unbounded collections)
            4. Maintainability & Code Quality (architectural drift, tight coupling, code duplication, readability, brittle abstractions, adherence to standard language idioms)
            
            ### Review Guidelines & Constraints
            - Focus only on high-value, actionable findings. Do not generate subjective nitpicks or style-only commentary (e.g., variable naming, line breaks) unless it directly impairs maintainability or violates critical language conventions.
            - Never state that an issue exists without demonstrating why. Provide concrete proof of failure or exploitation vectors.
            - If no issues are identified in a specific category, omit that category.
            - If the entire snippet is robust, secure, and production-ready, state: "No actionable issues identified. The code adheres to production standards."
            
            ### Output Structure
            For each issue discovered, use the following template:
            
            #### [SEVERITY: Critical | Major | Minor] <Concise Title of Issue>
            - **Dimension:** [Correctness | Security | Performance | Maintainability]
            - **Location:** Line(s) or function/component name
            - **Root Cause & Impact:** Explain precisely why this occurs and the real-world operational/business impact if deployed.
            - **Recommended Fix:** Provide a brief explanation of the solution.
            - **Refactored Code:**
        `,
    },
    });

    if (!result.text) {
        throw new Error("Gemini returned an empty response.");
    }

    return result.text;
}


// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({});

// const interaction = await ai.interactions.create({
//   model: "gemini-4-argon",
//   input: "Explain how AI works in a few words",
// });

// console.log(interaction.output_text);