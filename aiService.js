class AIService {
    constructor() {
        this.cache = new Map();
        this.API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
        this.API_KEY = 'YOUR_GEMINI_API_KEY'; // Replace with your Gemini API key
    }

    async generatePairs(topic) {
        if (this.cache.has(topic)) {
            return this.cache.get(topic);
        }

        try {
            const prompt = {
                contents: [{
                    role: "user",
                    parts: [{
                        text: `Generate exactly 5 pairs of choices about ${topic}. Respond with only the pairs, one per line, in the format 'Choice1|Choice2'`
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topP: 0.8,
                    topK: 40,
                    maxOutputTokens: 150,
                    candidate_count: 1
                }
            };

            console.log('Sending prompt:', prompt);  // Debug logging

            const response = await fetch(`${this.API_URL}?key=${this.API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(prompt),
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('API Error:', errorData);
                throw new Error(`API error: ${response.status}`);
            }

            const responseData = await response.json();
            console.log('AI Response:', responseData);  // Debug logging

            if (responseData.error) {
                throw new Error(responseData.error.message);
            }

            const generatedText = responseData.candidates?.[0]?.content?.parts?.[0]?.text || '';
            const pairs = this.parsePairs(generatedText);
            
            if (pairs.length === 0) {
                throw new Error('No valid pairs generated');
            }

            this.cache.set(topic, pairs);
            return pairs;
        } catch (error) {
            console.error('AI generation failed:', error);
            return this.getFallbackPairs(topic);
        }
    }

    parsePairs(text) {
        const lines = text.split('\n');
        const pairs = [];

        for (const line of lines) {
            const [option1, option2] = line.split('|').map(s => s.trim());
            if (option1 && option2) {
                pairs.push({ option1, option2 });
            }
            if (pairs.length >= 5) break;
        }

        return pairs.length > 0 ? pairs : this.getFallbackPairs('default');
    }

    getFallbackPairs(topic) {
        const topicBasedPairs = {
            food: [
                { option1: "Pizza", option2: "Burger" },
                { option1: "Ice Cream", option2: "Cake" },
                { option1: "Chinese", option2: "Italian" },
                { option1: "Spicy", option2: "Mild" },
                { option1: "Sweet", option2: "Savory" }
            ],
            default: [
                { option1: "Option A", option2: "Option B" },
                { option1: "Choice 1", option2: "Choice 2" },
                { option1: "This", option2: "That" },
                { option1: "Left", option2: "Right" },
                { option1: "Up", option2: "Down" }
            ]
        };
        return topicBasedPairs[topic.toLowerCase()] || topicBasedPairs.default;
    }
}
