# ChoicePal

![License](https://img.shields.io/badge/License-MIT-FF6B5B?style=flat-square)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

ChoicePal is a fun, interactive web game that helps couples, friends, and families discover how alike they are through an engaging "this or that" choice-based experience.

## Features

- **Topic-based Gameplay**: Players input any topic (e.g., food, movies, animals) to start the game
- **AI-Generated Choices**: Uses Google's Gemini 2.5 Flash Lite AI API to generate unique pairs of choices based on the chosen topic
- **Two-Player Experience**: Players take turns making choices on the same device
- **Beautiful UI**: Sleek, modern interface with smooth animations and playful design
- **Compatibility Score**: See how well your choices match with your partner's at the end
- **Responsive Design**: Works seamlessly on both desktop and mobile devices

## Tech Stack

- HTML5
- CSS3 (with modern features like CSS Grid and Flexbox)
- Vanilla JavaScript (ES6+)
- Node.js (for local development server)
- Google's Gemini Flash Lite AI API

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/GxAditya/ChoicePal.git
cd ChoicePal
```

2. Get your Gemini API key:
   - Sign up for Google AI Studio at https://aistudio.google.com/app/apikey
   - Create and copy your API key

3. Start the local development server:
```bash
node server.js
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

5. Enter your API key and a topic to start playing!

## How to Play

1. Enter your Gemini API key in the provided field
2. Enter a topic in the input field (e.g., food, movies, animals)
3. Player 1 makes their choices
4. Pass the device to Player 2
5. Player 2 makes their choices
6. View your compatibility score and comparison of choices

## Features in Detail

- **AI Integration**: Uses Google's Gemini 2.5 Flash Lite AI to generate contextually relevant choices
- **Fallback System**: Includes predefined choices if AI generation fails
- **Responsive Cards**: Interactive choice cards with hover effects
- **Progress Tracking**: Visual indicators for game progress
- **Results Analysis**: Detailed comparison of both players' choices
- **Replayability**: Easy to start a new game with a different topic

## Browser Support

Supports all modern browsers including:
- Chrome
- Firefox
- Safari
- Edge

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.
