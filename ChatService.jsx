import axios from 'axios';

const API_KEY = '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';

export const getChatGPTResponse = async (userInput) => {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: userInput }],
            },
            {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error fetching ChatGPT response:', error);
        return 'Sorry, I couldn’t process your request at this time.';
    }
};
