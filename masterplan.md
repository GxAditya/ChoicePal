# App Overview and Objectives

**Purpose:** A fun, casual web app where users input a topic, and the app generates a "this or that" game using AI to entertain couples and friends, helping them see how alike they are.

**Objective:** Provide an engaging, quick-play experience that sparks laughter and connection without any complicated setup.

## Target Audience

All age groups—couples, friends, and families looking for a lighthearted way to pass the time and compare preferences.

## Core Features and Functionality

* **Topic Input:** Users enter any topic (e.g., "food," "animals").
* **AI-Generated Game:** Two sets of "this or that" pairs (e.g., 5-10 pairs per set) are generated using generative AI based on the topic.
* **Gameplay:**
    * Two players take turns on the same device.
    * Choices displayed as cards in sets of two; selecting one advances to the next pair.
    * Prompt (“Pass it to your partner!”) after the first player finishes their set.
* **Results:** At the end, a simple compatibility score (e.g., “You’re 75% alike!”) based on matching choices.
* **Session-Based:** Data clears when the browser tab closes.

## High-Level Technical Stack Recommendations

* **Frontend:** HTML/CSS/JavaScript (vanilla or a light framework like React for animations).
* **AI:** Free-tier generative AI (e.g., Hugging Face API) or open-source models (e.g., LLaMA, DeepSeek) hosted locally or via a free service.
* **Storage:** Client-side only (browser memory, no persistent storage).
* **Deployment:** Static hosting (e.g., Netlify or Vercel) for simplicity and cost.

## Conceptual Data Model

* **Temporary in-memory storage:**
    * **Topic:** String (user input).
    * **GameSet1, GameSet2:** Arrays of pairs (e.g., `[{option1: "Pizza", option2: "Tacos"}, ...]`).
    * **Player1Choices, Player2Choices:** Arrays of selected options.
    * **CompatibilityScore:** Calculated percentage at the end.

## User Interface Design Principles

* **Theme:** Shadow-type design with soft depth around cards.
* **Animations:**
    * Splash or bounce on app load.
    * Slide/flip when switching card pairs.
    * Fun nudge for “Pass it to your partner!” prompt.
* **Vibe:** Clean, playful, and intuitive for all ages.

## Security Considerations

* No persistent data stored; all choices wiped on tab close.
* Basic web app security (HTTPS via hosting platform).

## Development Phases or Milestones

* **Phase 1:** Basic UI with topic input and static card display (no AI yet).
* **Phase 2:** Integrate AI to generate "this or that" pairs; add client-side storage for choices.
* **Phase 3:** Add animations and compatibility scoring.
* **Phase 4:** Polish UI/UX and test with real users.

## Potential Challenges and Solutions

* **Challenge:** Free-tier AI rate limits.
    * **Solution:** Cap pairs at 5-10 and cache results in memory; fallback to open-source AI if needed.
* **Challenge:** Broad topics leading to inconsistent AI outputs.
    * **Solution:** Test with diverse topics early; tweak prompts to guide AI.