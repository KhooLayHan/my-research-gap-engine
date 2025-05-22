<!-- This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details. -->

# 🔍 What's Not Being Researched Engine?

## Discover the Uncharted: Uncovering Critical Gaps in Global Knowledge

---

## 🚀 Introduction

In the vast landscape of global research, certain areas receive immense attention, funding, and scholarly focus. However, equally critical questions often remain untouched, neglected, or simply overlooked due to various biases—be it geographical, demographic, or thematic. This leads to significant knowledge gaps that can hinder innovation, effective policymaking, and equitable development.

The **"What's Not Being Researched Engine?"** is our innovative solution to tackle this challenge. Leveraging the power of real-time web intelligence, this tool aims to shed light on these underserved research domains, guiding curious minds, researchers, and policymakers towards uncharted territories of discovery.

---

## ✨ Features (MVP)

Our prototype focuses on the core functionality to identify and visualize research gaps:

* **Intuitive Search:** Easily input any topic to begin exploring its research landscape.
* **Real-time Gap Analysis:**
    * **Research Timeline:** Visualize the historical volume of research to identify periods of inactivity or decline.
    * **Regional Distribution:** Map where the research has (or hasn't) been conducted across different geographical areas.
    * **Population Coverage:** Highlight which demographic groups are underrepresented in studies related to your topic.
    * **Subtopic Radar:** Reveal related themes and their current research coverage.
* **Actionable Insights:** Automated summaries of identified gaps (e.g., "No significant studies found in Southeast Asia post-2020 on X topic").
* **AI-Suggested Questions:** Generate novel, impactful research questions directly derived from the identified gaps, fostering new avenues for inquiry.
* **Clear About Page:** Explains the problem, our methodology, and the role of Perplexity Sonar API.

---

## ⚙️ How It Works (Technical Overview)

The engine functions by orchestrating powerful web search and data analysis in real-time:

1.  **User Query:** A user submits a research topic via the intuitive frontend.
2.  **API Gateway:** The Next.js frontend sends this query to a secure API route (`/api/search`).
3.  **Perplexity Sonar API Integration:** Our backend leverages the **Perplexity Sonar API** for comprehensive, real-time web search. It intelligently queries academic databases, news sources, and other reputable online content for the user's topic, as well as specific permutations (e.g., "topic in Africa," "topic post-2020," "topic children").
    * We employ strategies to filter for **reputable academic sources**, analyze **recency of publications**, and look for **keywords indicating active research** within snippets to mitigate false negatives.
4.  **Data Processing & Gap Detection:** The raw results from Perplexity Sonar are processed to:
    * Count publication volumes per year, region, and demographic.
    * Identify low-activity areas based on predefined metrics and comparisons.
5.  **Insight Generation:** Based on the detected gaps, the system generates concise textual insights and feeds them into an AI model (leveraging Perplexity's own language model capabilities or a dedicated LLM if applicable) to formulate precise, actionable research questions.
6.  **Frontend Visualization:** The processed data, insights, and suggested questions are sent back to the Next.js frontend, where they are beautifully visualized using various charts and maps via ShadCN/UI components.

---

## 🛠️ Technologies Used

* **Frontend/Backend Framework:** [Next.js](https://nextjs.org/) (React framework for both frontend and API routes)
* **Language:** [TypeScript](https://www.typescriptlang.org/) (for type safety across the entire stack)
* **UI Components:** [ShadCN/UI](https://ui.shadcn.com/) (beautifully crafted, re-usable components)
* **State Management:** [Zustand](https://zustand-store.github.io/) (for efficient and clean global state management)
* **Schema Validation:** [Zod](https://zod.dev/) (for robust input validation on API routes)
* **CI/CD:** [GitHub Actions](https://docs.github.com/en/actions) (for automated testing and deployment)
* **Deployment Platform:** [Vercel](https://vercel.com/) (for seamless, high-performance web hosting)
* **Core Data Engine:** **Perplexity Sonar API** (the backbone for real-time web search and insights)
* **Data Visualization:** (e.g., Recharts, Chart.js, or ShadCN's `ui/chart` if used)

---

## 🚀 Getting Started (Local Development)

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/my-research-gap-engine.git](https://github.com/your-username/my-research-gap-engine.git)
    cd my-research-gap-engine
    ```

2.  **Install pnpm (if you don't have it):**
    ```bash
    npm install -g pnpm
    ```

3.  **Install dependencies:**
    ```bash
    pnpm install
    ```

4.  **Set up Environment Variables:**
    Create a `.env.local` file in the project root and add your Perplexity API Key:
    ```
    PERPLEXITY_API_KEY=your_perplexity_sonar_api_key_here
    ```
    *You can obtain your Perplexity Sonar API Key from the Perplexity AI platform.*

5.  **Run the development server:**
    ```bash
    pnpm dev
    ```
    Open your browser and visit `http://localhost:3000`.

---

## 🌐 CI/CD & Deployment

This project utilizes **GitHub Actions** for its Continuous Integration and Continuous Deployment pipeline.

* On every `push` to the `main` branch or `pull_request` targeting `main`, the workflow:
    1.  Installs dependencies.
    2.  Runs ESLint checks.
    3.  Performs TypeScript type checks.
    4.  Builds the Next.js application.
    5.  Deploys the production-ready build to **Vercel**.

Deployment is handled automatically via Vercel's seamless integration with Next.js and GitHub. You can view the live deployment at [Your Vercel Deployment URL Here] (e.g., `https://whats-not-being-researched.vercel.app/`).

---

## 🔮 Future Enhancements (Post-Hackathon)

Given more time, we envision the following enhancements:

* **Research Gap Dashboard:** For power users to save queries, track discovered gaps over time, and export visualizations. This would require a database integration (e.g., using Drizzle ORM with a serverless Postgres/MySQL).
* **User Accounts & Personalization:** Allow users to create profiles, save their favorite research areas, and receive tailored gap alerts.
* **Refined Gap Detection Algorithms:** Incorporate more sophisticated NLP techniques (e.g., topic modeling, knowledge graph analysis) to identify nuanced and complex interdisciplinary gaps.
* **Collaboration Features:** Enable researchers to share identified gaps and collaborate on potential projects.
* **Crowdsourced Validation:** Allow users to confirm or refine identified gaps and suggested questions.

---

## 🙏 Acknowledgements

We extend our sincere gratitude to:

* **Perplexity AI** for providing the powerful Sonar API, which is central to this project's capabilities.
* **The creators of Next.js, React, TypeScript, ShadCN/UI, Zustand, Zod, and Vercel** for building such incredible tools that empower rapid development.
* **The Hackathon Organizers** for providing this platform to innovate!

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
