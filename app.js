class ChoicePalGame {
    constructor() {
        this.currentPlayer = 1;
        this.player1Choices = [];
        this.player2Choices = [];
        this.currentPairIndex = 0;
        this.gamePairs = [];
        this.aiService = null;
        this.isAnimating = false;
        
        this.setupEventListeners();
        this.setupInitialClasses();
    }

    setupInitialClasses() {
        // Set initial player classes
        const playerBadge = document.getElementById('player-badge');
        const cardsContainer = document.getElementById('cards-container');
        if (playerBadge) playerBadge.classList.add('player-1');
        if (cardsContainer) cardsContainer.classList.add('player-1');
    }

    setupEventListeners() {
        // Start game
        document.getElementById('start-btn').addEventListener('click', () => this.handleStart());
        
        // Enter key on inputs
        document.getElementById('topic-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') document.getElementById('api-key-input').focus();
        });
        document.getElementById('api-key-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleStart();
        });

        // Game choices
        document.getElementById('option1').addEventListener('click', () => this.handleChoice(0));
        document.getElementById('option2').addEventListener('click', () => this.handleChoice(1));

        // Pass screen
        document.getElementById('continue-btn').addEventListener('click', () => this.startPlayer2());

        // Play again
        document.getElementById('play-again-btn').addEventListener('click', () => this.reset());
    }

    triggerHaptic(type = 'light') {
        if (navigator.vibrate) {
            const patterns = {
                light: 10,
                medium: 20,
                heavy: 30,
                success: [10, 50, 10],
                error: [30, 30, 30]
            };
            navigator.vibrate(patterns[type] || patterns.light);
        }
    }

    async handleStart() {
        const topic = document.getElementById('topic-input').value.trim();
        const apiKey = document.getElementById('api-key-input').value.trim();
        
        if (!topic || !apiKey) {
            this.triggerHaptic('error');
            this.shakeInput(topic ? 'api-key-input' : 'topic-input');
            return;
        }

        this.triggerHaptic('medium');
        await this.startGame(topic, apiKey);
    }

    shakeInput(inputId) {
        const input = document.getElementById(inputId);
        input.style.animation = 'none';
        input.offsetHeight; // Trigger reflow
        input.style.animation = 'shake 0.5s ease';
        input.addEventListener('animationend', () => {
            input.style.animation = '';
        }, { once: true });
    }

    async startGame(topic, apiKey) {
        this.aiService = new AIService(apiKey);

        const startBtn = document.getElementById('start-btn');
        startBtn.classList.add('loading');
        startBtn.disabled = true;

        try {
            this.gamePairs = await this.generatePairs(topic);
            if (this.gamePairs.length === 0) {
                throw new Error('No pairs generated');
            }
            
            this.showScreen('game-screen');
            this.updateProgressDots();
            this.updateGameDisplay();
            this.triggerHaptic('success');
        } catch (error) {
            console.error('Game generation failed:', error);
            this.triggerHaptic('error');
            alert('Failed to generate game. Please check your API key and try again!');
        } finally {
            startBtn.classList.remove('loading');
            startBtn.disabled = false;
        }
    }

    async generatePairs(topic) {
        try {
            const pairs = await this.aiService.generatePairs(topic);
            return pairs;
        } catch (error) {
            console.error('Failed to generate pairs:', error);
            return this.aiService.getFallbackPairs(topic);
        }
    }

    handleChoice(choiceIndex) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const selectedCard = choiceIndex === 0 ? 
            document.getElementById('option1') : 
            document.getElementById('option2');
        const otherCard = choiceIndex === 0 ? 
            document.getElementById('option2') : 
            document.getElementById('option1');

        const choice = choiceIndex === 0 ? 
            this.gamePairs[this.currentPairIndex].option1 : 
            this.gamePairs[this.currentPairIndex].option2;

        // Store choice
        if (this.currentPlayer === 1) {
            this.player1Choices.push(choice);
        } else {
            this.player2Choices.push(choice);
        }

        this.triggerHaptic('medium');

        // Animate selection
        selectedCard.classList.add('selected');
        otherCard.style.opacity = '0.3';
        otherCard.style.transform = 'scale(0.95)';

        setTimeout(() => {
            this.currentPairIndex++;
            
            if (this.currentPairIndex >= this.gamePairs.length) {
                this.endRound();
            } else {
                this.nextQuestion(selectedCard, otherCard);
            }
        }, 400);
    }

    nextQuestion(selectedCard, otherCard) {
        // Fade out
        selectedCard.style.opacity = '0';
        otherCard.style.opacity = '0';

        setTimeout(() => {
            // Reset and update
            selectedCard.classList.remove('selected');
            selectedCard.style.opacity = '';
            selectedCard.style.transform = '';
            otherCard.style.opacity = '';
            otherCard.style.transform = '';
            
            this.updateProgressDots();
            this.updateGameDisplay();
            this.isAnimating = false;

            // Fade in animation
            this.animateCardEntrance();
        }, 200);
    }

    animateCardEntrance() {
        const cards = document.querySelectorAll('.choice-card');
        cards.forEach((card, index) => {
            card.style.animation = 'none';
            card.offsetHeight;
            card.style.animation = `cardPopIn 0.5s var(--bounce) ${index * 0.1}s backwards`;
        });
    }

    endRound() {
        setTimeout(() => {
            this.isAnimating = false;
            if (this.currentPlayer === 1) {
                this.clearCardStates();
                this.showScreen('pass-screen');
            } else {
                this.showResults();
            }
        }, 300);
    }

    clearCardStates() {
        const cards = document.querySelectorAll('.choice-card');
        cards.forEach(card => {
            card.classList.remove('selected');
            card.style.opacity = '';
            card.style.transform = '';
        });
    }

    startPlayer2() {
        this.currentPlayer = 2;
        this.currentPairIndex = 0;
        this.triggerHaptic('medium');
        
        // Clear any lingering card states from Player 1
        this.clearCardStates();
        
        // Set initial player classes
        const playerBadge = document.getElementById('player-badge');
        const cardsContainer = document.getElementById('cards-container');
        playerBadge.classList.remove('player-1');
        playerBadge.classList.add('player-2');
        cardsContainer.classList.remove('player-1');
        cardsContainer.classList.add('player-2');
        
        this.showScreen('game-screen');
        this.updateProgressDots();
        this.updateGameDisplay();
        this.animateCardEntrance();
    }

    showResults() {
        const matches = this.player1Choices.reduce((acc, choice, index) => 
            acc + (choice === this.player2Choices[index] ? 1 : 0), 0);
        const score = Math.round((matches / this.gamePairs.length) * 100);
        
        this.showScreen('results-screen');
        this.triggerHaptic('success');
        
        // Animate score
        this.animateScore(score);
        
        // Update title based on score
        const title = document.querySelector('.results-title');
        if (score >= 80) title.textContent = 'Soulmates! 🔥';
        else if (score >= 60) title.textContent = 'Great match! ✨';
        else if (score >= 40) title.textContent = 'Getting there! 💫';
        else title.textContent = 'Interesting duo! 🌟';

        // Build comparison cards
        this.buildComparisonCards();
    }

    animateScore(targetScore) {
        const scoreEl = document.getElementById('compatibility-score');
        const ringProgress = document.getElementById('score-ring-progress');
        
        // Animate number
        let current = 0;
        const duration = 1500;
        const startTime = performance.now();
        
        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            
            current = Math.round(eased * targetScore);
            scoreEl.textContent = `${current}%`;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        };
        
        requestAnimationFrame(updateNumber);
        
        // Animate ring
        setTimeout(() => {
            const circumference = 339.292;
            const offset = circumference - (targetScore / 100) * circumference;
            ringProgress.style.strokeDashoffset = offset;
        }, 100);
    }

    buildComparisonCards() {
        const container = document.getElementById('choices-comparison');
        container.innerHTML = '';

        this.gamePairs.forEach((pair, index) => {
            const choice1 = this.player1Choices[index];
            const choice2 = this.player2Choices[index];
            const isMatch = choice1 === choice2;
            
            const card = document.createElement('div');
            card.className = 'comparison-card';
            card.innerHTML = `
                <div class="comparison-header">
                    <span class="comparison-question">${pair.option1} vs ${pair.option2}</span>
                    <span class="match-badge ${isMatch ? 'match' : 'mismatch'}">
                        ${isMatch ? 'Match!' : 'Different'}
                    </span>
                </div>
                <div class="choices-row">
                    <div class="choice-pill ${choice1 === pair.option1 ? 'selected' : ''} ${isMatch ? 'match' : ''}">
                        <div class="choice-player">Player 1</div>
                        <div class="choice-value">${choice1}</div>
                    </div>
                    <div class="choice-pill ${choice2 === pair.option1 ? 'selected' : ''} ${isMatch ? 'match' : ''}">
                        <div class="choice-player">Player 2</div>
                        <div class="choice-value">${choice2}</div>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    updateProgressDots() {
        const container = document.getElementById('progress-dots');
        container.innerHTML = '';
        
        this.gamePairs.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'progress-dot';
            
            if (index < this.currentPairIndex) {
                dot.classList.add('completed');
            } else if (index === this.currentPairIndex) {
                dot.classList.add('active');
            }
            
            container.appendChild(dot);
        });
    }

    updateGameDisplay() {
        const playerIndicator = document.getElementById('player-indicator');
        const playerBadge = document.getElementById('player-badge');
        const cardsContainer = document.getElementById('cards-container');
        const option1 = document.getElementById('option1');
        const option2 = document.getElementById('option2');
        
        playerIndicator.textContent = `Player ${this.currentPlayer}`;
        
        // Update player badge styling
        playerBadge.classList.remove('player-1', 'player-2');
        playerBadge.classList.add(`player-${this.currentPlayer}`);
        
        // Update cards container for player-specific selection colors
        cardsContainer.classList.remove('player-1', 'player-2');
        cardsContainer.classList.add(`player-${this.currentPlayer}`);
        
        const currentPair = this.gamePairs[this.currentPairIndex];
        
        // Animate text change
        this.animateTextChange(option1.querySelector('.card-text'), currentPair.option1);
        this.animateTextChange(option2.querySelector('.card-text'), currentPair.option2);
    }

    animateTextChange(element, newText) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            element.textContent = newText;
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 150);
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        const targetScreen = document.getElementById(screenId);
        targetScreen.classList.add('active');
    }

    reset() {
        this.currentPlayer = 1;
        this.player1Choices = [];
        this.player2Choices = [];
        this.currentPairIndex = 0;
        this.gamePairs = [];
        this.aiService = null;
        this.isAnimating = false;
        
        document.getElementById('topic-input').value = '';
        document.getElementById('api-key-input').value = '';
        
        // Reset score ring
        const ringProgress = document.getElementById('score-ring-progress');
        if (ringProgress) {
            ringProgress.style.strokeDashoffset = '339.292';
        }
        
        // Reset player classes
        const playerBadge = document.getElementById('player-badge');
        const cardsContainer = document.getElementById('cards-container');
        playerBadge.classList.remove('player-2');
        playerBadge.classList.add('player-1');
        cardsContainer.classList.remove('player-2');
        cardsContainer.classList.add('player-1');
        
        this.triggerHaptic('light');
        this.showScreen('topic-screen');
    }
}

// Add shake animation to styles dynamically
const shakeStyles = document.createElement('style');
shakeStyles.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-8px); }
        40% { transform: translateX(8px); }
        60% { transform: translateX(-4px); }
        80% { transform: translateX(4px); }
    }
    
    @keyframes cardPopIn {
        from {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
`;
document.head.appendChild(shakeStyles);

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ChoicePalGame();
});
