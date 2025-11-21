class ChoicePalGame {
    constructor() {
        this.currentPlayer = 1;
        this.player1Choices = [];
        this.player2Choices = [];
        this.currentPairIndex = 0;
        this.gamePairs = [];
        this.setupEventListeners();
        this.aiService = null;
    }

    setupEventListeners() {
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('continue-btn').addEventListener('click', () => this.startPlayer2());
        document.getElementById('play-again-btn').addEventListener('click', () => this.reset());
        
        document.getElementById('option1').addEventListener('click', () => this.makeChoice(0));
        document.getElementById('option2').addEventListener('click', () => this.makeChoice(1));
    }

    async startGame() {
        const topic = document.getElementById('topic-input').value;
        const apiKey = document.getElementById('api-key-input').value;
        if (!topic || !apiKey) {
            alert('Please enter both a topic and your API key.');
            return;
        }

        this.aiService = new AIService(apiKey);

        const startBtn = document.getElementById('start-btn');
        startBtn.textContent = 'Generating...';
        startBtn.disabled = true;
        startBtn.classList.add('loading');

        try {
            this.gamePairs = await this.generatePairs(topic);
            if (this.gamePairs.length === 0) {
                throw new Error('No pairs generated');
            }
            this.showScreen('game-screen');
            this.updateGameDisplay();
        } catch (error) {
            console.error('Game generation failed:', error);
            alert('Failed to generate game. Please check your API key and try again!');
        } finally {
            startBtn.textContent = 'Start Game';
            startBtn.disabled = false;
            startBtn.classList.remove('loading');
        }
    }

    async generatePairs(topic) {
        try {
            document.getElementById('start-btn').disabled = true;
            const pairs = await this.aiService.generatePairs(topic);
            document.getElementById('start-btn').disabled = false;
            return pairs;
        } catch (error) {
            console.error('Failed to generate pairs:', error);
            document.getElementById('start-btn').disabled = false;
            return this.aiService.getFallbackPairs(topic);
        }
    }

    makeChoice(choiceIndex) {
        const choice = choiceIndex === 0 ? 
            this.gamePairs[this.currentPairIndex].option1 : 
            this.gamePairs[this.currentPairIndex].option2;

        if (this.currentPlayer === 1) {
            this.player1Choices.push(choice);
        } else {
            this.player2Choices.push(choice);
        }

        this.currentPairIndex++;
        
        if (this.currentPairIndex >= this.gamePairs.length) {
            if (this.currentPlayer === 1) {
                this.showScreen('pass-screen');
            } else {
                this.showResults();
            }
        } else {
            this.updateGameDisplay();
        }
    }

    startPlayer2() {
        this.currentPlayer = 2;
        this.currentPairIndex = 0;
        this.showScreen('game-screen');
        this.updateGameDisplay();
    }

    showResults() {
        const matches = this.player1Choices.reduce((acc, choice, index) => 
            acc + (choice === this.player2Choices[index] ? 1 : 0), 0);
        const score = Math.round((matches / this.gamePairs.length) * 100);
        
        document.getElementById('compatibility-score').textContent = 
            `You're ${score}% alike!`;
        
        // Update progress bar
        const progressBar = document.getElementById('compatibility-bar');
        progressBar.style.width = '0%';
        setTimeout(() => {
            progressBar.style.width = `${score}%`;
        }, 100);

        // Display choice comparisons
        const comparisonContainer = document.querySelector('.choices-comparison-container');
        comparisonContainer.innerHTML = '';

        this.player1Choices.forEach((choice1, index) => {
            const choice2 = this.player2Choices[index];
            const isMatch = choice1 === choice2;
            
            const card = document.createElement('div');
            card.className = 'comparison-card';
            card.innerHTML = `
                <div class="player-choice ${isMatch ? 'matching' : ''}">
                    <div>
                        <div class="choice-label">Player 1 chose:</div>
                        <div class="choice-value">${choice1}</div>
                    </div>
                    <div>
                        <div class="choice-label">Player 2 chose:</div>
                        <div class="choice-value">${choice2}</div>
                    </div>
                </div>
            `;
            comparisonContainer.appendChild(card);
        });
        
        this.showScreen('results-screen');
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => 
            screen.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    }

    updateGameDisplay() {
        document.getElementById('player-indicator').textContent = 
            `Player ${this.currentPlayer}'s turn`;
        document.getElementById('option1').textContent = 
            this.gamePairs[this.currentPairIndex].option1;
        document.getElementById('option2').textContent = 
            this.gamePairs[this.currentPairIndex].option2;
    }

    reset() {
        this.currentPlayer = 1;
        this.player1Choices = [];
        this.player2Choices = [];
        this.currentPairIndex = 0;
        this.gamePairs = [];
        this.aiService = null;
        document.getElementById('topic-input').value = '';
        document.getElementById('api-key-input').value = '';
        this.showScreen('topic-screen');
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ChoicePalGame();
});
