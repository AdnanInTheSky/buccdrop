// --- STATE & DATA ---
const appContainer = document.getElementById('app');
let currentSlideIndex = 0;
let isTransitioning = false;

// Slide sequence definition (Updated with new flow and "Human Resources")
const slides = [
    { text: "Transfer Window", btnText: "Next" },
    { text: "From Human Resources", btnText: "Next" },
    { text: "Dibyo Singho Barua<br/><span class='text-4xl md:text-5xl text-gray-400 mt-4 block'>Subrajit</span>", btnText: "Next" },
    { text: "To Communication and Marketing", btnText: "Next" },
    { text: "From Communication and Marketing<br/><span class='text-4xl md:text-5xl text-gray-400 mt-4 block'>To Human Resources</span>", btnText: "Next" },
    { text: "Play Again?", btnText: "Yes" },
    { text: "From Human Resources", btnText: "Next" },
    { text: "Mahir Dyan", btnText: "Next" },
    { text: "To R&D", btnText: "Next" },
    { text: "Transfer Complete", btnText: "Restart" }
];

// --- RENDERING LOGIC ---

/**
 * Mounts the initial password protection screen.
 */
function renderLogin() {
    appContainer.innerHTML = `
        <div id="view-wrapper" class="opacity-0 scale-95 transition-all duration-700 ease-in-out transform flex flex-col items-center w-full">
            <h1 class="text-4xl md:text-5xl font-light mb-10 tracking-[0.2em] text-gray-200 uppercase">
                Transfer Access Portal
            </h1>
            <form id="loginForm" class="flex flex-col items-center w-full max-w-sm">
                <input 
                    type="password" 
                    id="password" 
                    placeholder="Enter Access Code"
                    class="w-full px-4 py-4 bg-gray-900 border border-gray-800 rounded-lg text-center text-xl text-white focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all mb-2" 
                    required 
                    autocomplete="off"
                />
                <p id="errorMsg" class="text-red-400 text-sm h-6 mb-4 opacity-0 transition-opacity duration-300 tracking-wide"></p>
                <button 
                    type="submit" 
                    id="loginBtn"
                    class="px-10 py-3 bg-gray-200 text-gray-900 font-semibold tracking-widest uppercase text-sm rounded hover:bg-white hover:scale-105 transition-all duration-300 w-full disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed">
                    Access
                </button>
            </form>
        </div>
    `;

    // Trigger fade-in animation
    requestAnimationFrame(() => animateIn());
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
}

/**
 * Handles the password verification via Serverless Function
 */
async function handleLogin(e) {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const btn = document.getElementById('loginBtn');
    const errorMsg = document.getElementById('errorMsg');

    // Set loading state
    btn.disabled = true;
    btn.textContent = 'Verifying...';
    errorMsg.classList.replace('opacity-100', 'opacity-0');

    try {
        const response = await fetch('/api/verify-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });

        const data = await response.json();

        if (data.success) {
            // Success: Move to slide deck
            transitionToNextView(() => renderSlide());
        } else {
            // Failure: Show elegant inline error
            showInlineError(data.message || 'Access Denied.');
            resetLoginButton(btn);
        }
    } catch (error) {
        showInlineError('Connection error. Please try again.');
        resetLoginButton(btn);
    }
}

function showInlineError(message) {
    const errorMsg = document.getElementById('errorMsg');
    errorMsg.textContent = message;
    errorMsg.classList.replace('opacity-0', 'opacity-100');
}

function resetLoginButton(btn) {
    btn.disabled = false;
    btn.textContent = 'Access';
    document.getElementById('password').value = '';
    document.getElementById('password').focus();
}

/**
 * Renders the current slide from the array
 */
function renderSlide() {
    const slide = slides[currentSlideIndex];

    appContainer.innerHTML = `
        <div id="view-wrapper" class="opacity-0 scale-95 transition-all duration-700 ease-in-out transform flex flex-col items-center justify-center w-full">
            <h2 class="text-5xl md:text-7xl font-light mb-16 tracking-wide leading-tight text-gray-100">
                ${slide.text}
            </h2>
            <button 
                id="slideBtn"
                class="px-12 py-4 bg-transparent border border-gray-600 text-gray-300 font-medium tracking-widest uppercase text-sm rounded-full hover:bg-gray-100 hover:text-gray-900 hover:scale-105 transition-all duration-500 disabled:opacity-50 disabled:hover:scale-100">
                ${slide.btnText}
            </button>
        </div>
    `;

    requestAnimationFrame(() => animateIn());

    document.getElementById('slideBtn').addEventListener('click', (e) => {
        if (isTransitioning) return;
        
        const btn = e.target;
        btn.disabled = true; // Disable button to prevent double clicks during animation

        if (currentSlideIndex === slides.length - 1) {
            currentSlideIndex = 0; // Restart without asking for password
        } else {
            currentSlideIndex++;
        }
        
        transitionToNextView(() => renderSlide());
    });
}

// --- ANIMATION UTILS ---

function animateIn() {
    setTimeout(() => {
        const wrapper = document.getElementById('view-wrapper');
        if (wrapper) {
            wrapper.classList.remove('opacity-0', 'scale-95');
            wrapper.classList.add('opacity-100', 'scale-100');
        }
    }, 50); // slight delay ensures DOM paints before transition triggers
}

function transitionToNextView(renderNextCallback) {
    if (isTransitioning) return;
    isTransitioning = true;

    const wrapper = document.getElementById('view-wrapper');
    
    if (wrapper) {
        // Trigger fade out and scale up slightly for a cinematic exit
        wrapper.classList.remove('opacity-100', 'scale-100');
        wrapper.classList.add('opacity-0', 'scale-105');
        
        // Wait for CSS transition duration (700ms) before re-rendering
        setTimeout(() => {
            renderNextCallback();
            isTransitioning = false;
        }, 700);
    } else {
        renderNextCallback();
        isTransitioning = false;
    }
}

// --- BOOTSTRAP ---
document.addEventListener('DOMContentLoaded', () => {
    renderLogin();
});