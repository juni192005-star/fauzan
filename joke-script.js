let currentJoke = '';
let jokeCount = 0;
let selectedJokeType = 'general';

// Joke APIs
const APIs = {
    general: 'https://official-joke-api.appspot.com/random_joke',
    programming: 'https://official-joke-api.appspot.com/jokes/programming/random',
    knockKnock: 'https://official-joke-api.appspot.com/jokes/knock-knock/random',
    dad: 'https://icanhazdadjoke.com/slack',
    jokeAPI: 'https://v2.jokeapi.dev/joke/Any?type=single'
};

// Get random joke
async function getJoke() {
    const jokeContent = document.getElementById('joke-content');
    const loading = document.getElementById('loading');
    const generateBtn = document.getElementById('generate-btn');
    
    // Show loading state
    loading.style.display = 'flex';
    jokeContent.style.display = 'none';
    generateBtn.disabled = true;
    
    try {
        let joke = '';
        
        // Select API based on joke type
        if (selectedJokeType === 'general') {
            joke = await getGeneralJoke();
        } else if (selectedJokeType === 'programming') {
            joke = await getProgrammingJoke();
        } else if (selectedJokeType === 'knock-knock') {
            joke = await getKnockKnockJoke();
        } else if (selectedJokeType === 'dad') {
            joke = await getDadJoke();
        }
        
        currentJoke = joke;
        jokeContent.textContent = joke;
        jokeCount++;
        document.getElementById('joke-count').textContent = jokeCount;
        
    } catch (error) {
        console.error('Error fetching joke:', error);
        currentJoke = '😅 Oops! Could not load a joke. Try again!';
        jokeContent.textContent = currentJoke;
    } finally {
        // Hide loading state
        loading.style.display = 'none';
        jokeContent.style.display = 'block';
        generateBtn.disabled = false;
    }
}

// Get general joke
async function getGeneralJoke() {
    try {
        const response = await fetch(APIs.general);
        const data = await response.json();
        return `${data.setup} ... ${data.punchline}`;
    } catch (error) {
        // Fallback to JokeAPI if official API fails
        try {
            const response = await fetch(APIs.jokeAPI);
            const data = await response.json();
            return data.joke;
        } catch (fallbackError) {
            throw new Error('Failed to fetch general joke');
        }
    }
}

// Get programming joke
async function getProgrammingJoke() {
    try {
        const response = await fetch(APIs.programming);
        const data = await response.json();
        return `${data.setup} ... ${data.punchline}`;
    } catch (error) {
        throw new Error('Failed to fetch programming joke');
    }
}

// Get knock-knock joke
async function getKnockKnockJoke() {
    try {
        const response = await fetch(APIs.knockKnock);
        const data = await response.json();
        return `Knock knock!\nWho's there?\n${data.setup}\n${data.setup} who?\n${data.punchline}`;
    } catch (error) {
        throw new Error('Failed to fetch knock-knock joke');
    }
}

// Get dad joke
async function getDadJoke() {
    try {
        const response = await fetch(APIs.dad);
        const data = await response.json();
        return data.attachments[0].text;
    } catch (error) {
        throw new Error('Failed to fetch dad joke');
    }
}

// Copy joke to clipboard
function copyJoke() {
    if (!currentJoke) {
        alert('No joke to copy! Generate a joke first.');
        return;
    }
    
    navigator.clipboard.writeText(currentJoke).then(() => {
        // Show copy notification
        showNotification('Joke copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy joke to clipboard');
    });
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove notification after 2 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}

// Update joke type
function updateJokeType() {
    selectedJokeType = document.getElementById('joke-type').value;
}

// Auto-generate a joke on page load
window.addEventListener('DOMContentLoaded', () => {
    // Optional: uncomment to auto-generate joke on load
    // getJoke();
});