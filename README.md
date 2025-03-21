# ChoicePal 🌟

ChoicePal is a fun, interactive web game that helps couples, friends, and families discover how alike they are through an engaging "this or that" choice-based experience.

## Features ✨

- **Topic-based Gameplay**: Players input any topic (e.g., food, movies, animals) to start the game
- **AI-Generated Choices**: Uses the Gemini AI API to generate unique pairs of choices based on the chosen topic
- **Two-Player Experience**: Players take turns making choices on the same device
- **Beautiful UI**: Sleek, modern interface with smooth animations and a celestial theme
- **Compatibility Score**: See how well your choices match with your partner's at the end
- **Responsive Design**: Works seamlessly on both desktop and mobile devices

## Tech Stack 🛠️

- HTML5
- CSS3 (with modern features like CSS Grid and Flexbox)
- Vanilla JavaScript (ES6+)
- Node.js (for local development server)
- Google's Gemini AI API

## Getting Started 🚀

1. Clone the repository:
```bash
git clone https://github.com/GxAditya/ChoicePal.git
cd ChoicePal
```

2. Set up your Gemini API key:
   - Get your API key from Google's Generative AI platform
   - Replace the `API_KEY` in `aiService.js` with your key

3. Start the local development server:
```bash
node server.js
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## How to Play 🎮

1. Enter a topic in the input field
2. Player 1 makes their choices
3. Pass the device to Player 2
4. Player 2 makes their choices
5. View your compatibility score and comparison of choices

## Features in Detail 📝

- **AI Integration**: Uses Gemini AI to generate contextually relevant choices
- **Fallback System**: Includes predefined choices if AI generation fails
- **Responsive Cards**: Interactive choice cards with hover effects
- **Progress Tracking**: Visual indicators for game progress
- **Results Analysis**: Detailed comparison of both players' choices
- **Replayability**: Easy to start a new game with a different topic

## Browser Support 🌐

Supports all modern browsers including:
- Chrome
- Firefox
- Safari
- Edge

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

This project is open source and available under the MIT License.
