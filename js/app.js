// --- STATE & DATA ---
const appContainer = document.getElementById('app');
let currentSlideIndex = 0;
let isTransitioning = false;

// Slide sequence definition
const slides = [
    { text: "Transfer Window", btnText: "Next" },
    { text: "From Human Resources", btnText: "Next" },
    { text: "Dibyo Singho Barua<br/><span class='text-4xl md:text-5xl text-gray-400 mt-4 block'>Subrajit</span>", btnText: "Next" },
    { text: "To Communication and Marketing", btnText: "Next" },
    { text: "From Communication and Marketing<br", btnText: "Next" },
    { text: "To Human Resources", btnText: "Next" },
    { text: "Play Again?", btnText: "Yes" },
    { text: "From Human Resources", btnText: "Next" },
    { text: "Mahir Dyan", btnText: "Next" },
    { text: "To R&D", btnText: "Next" },
    { text: "Transfer Complete", btnText: "Next" },
    { text: "From Finance", btnText: "Next" },
    { text: "Rafia Raisa Taimur", btnText: "Next" },
    { text: "To Human Resources", btnText: "Next" },
    { text: "From Human Resources", btnText: "Next" },
    { text: "To Finance", btnText: "Next" },
    { text: "Transfer Complete", btnText: "Restart" }
];

// --- RENDERING LOGIC ---

function renderLogin() {
    // Removed Tailwind transition classes to let GSAP handle it
    appContainer.innerHTML = `
        <div id="view-wrapper" class="flex flex-col items-center w-full">
            <h1 class="text-4xl md:text-5xl font-light mb-10 tracking-[0.2em] text-gray-200 uppercase">
                Transfer Access Portal
            </h1>
            <form id="loginForm" class="flex flex-col items-center w-full max-w-sm">
                <input 
                    type="password" 
                    id="password" 
                    placeholder="Enter Access Code"
                    class="w-full px-4 py-4 bg-gray-900 border border-gray-800 rounded-lg text-center text-xl text-white focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors mb-2" 
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

    animateIn();
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
}

async function handleLogin(e) {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const btn = document.getElementById('loginBtn');
    const errorMsg = document.getElementById('errorMsg');

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
            transitionToNextView(() => renderSlide());
        } else {
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
    
    // Shake animation for error
    gsap.fromTo(errorMsg, 
        { x: -10 }, 
        { x: 0, duration: 0.4, ease: "bounce.out" }
    );
}

function resetLoginButton(btn) {
    btn.disabled = false;
    btn.textContent = 'Access';
    document.getElementById('password').value = '';
    document.getElementById('password').focus();
}

function renderSlide() {
    const slide = slides[currentSlideIndex];

    appContainer.innerHTML = `
        <div id="view-wrapper" class="flex flex-col items-center justify-center w-full">
            <h2 class="text-5xl md:text-7xl font-light mb-16 tracking-wide leading-tight text-gray-100">
                ${slide.text}
            </h2>
            <button 
                id="slideBtn"
                class="px-12 py-4 bg-transparent border border-gray-600 text-gray-300 font-medium tracking-widest uppercase text-sm rounded-full hover:bg-gray-100 hover:text-gray-900 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100">
                ${slide.btnText}
            </button>
        </div>
    `;

    animateIn();

    document.getElementById('slideBtn').addEventListener('click', (e) => {
        if (isTransitioning) return;
        
        const btn = e.target;
        btn.disabled = true; 

        if (currentSlideIndex === slides.length - 1) {
            currentSlideIndex = 0; 
        } else {
            currentSlideIndex++;
        }
        
        transitionToNextView(() => renderSlide());
    });
}

// --- GSAP ANIMATION UTILS ---

function animateIn() {
    const wrapper = document.getElementById('view-wrapper');
    if (!wrapper) return;

    // Animate children (Title, then Form/Button) sliding up and fading in
    gsap.fromTo(wrapper.children, 
        { y: 40, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
    );
}

function transitionToNextView(renderNextCallback) {
    if (isTransitioning) return;
    isTransitioning = true;

    const wrapper = document.getElementById('view-wrapper');
    
    if (wrapper) {
        // Animate children sliding out and fading away
        gsap.to(wrapper.children, {
            y: -40,
            opacity: 0,
            scale: 1.05,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.in",
            onComplete: () => {
                renderNextCallback();
                isTransitioning = false;
            }
        });
    } else {
        renderNextCallback();
        isTransitioning = false;
    }
}

// --- BOOTSTRAP ---
document.addEventListener('DOMContentLoaded', () => {
    renderLogin();
});