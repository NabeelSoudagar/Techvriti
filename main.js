const apiKey = "";

async function callGemini(prompt, systemPrompt = "") {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;
    const body = { contents: [{ parts: [{ text: prompt }] }] };
    if (systemPrompt) body.systemInstruction = { parts: [{ text: systemPrompt }] };

    let retries = 0;
    while (retries < 5) {
        try {
            const res = await fetch(url, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } });
            const data = await res.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
        } catch (e) {
            retries++;
            await new Promise(r => setTimeout(r, Math.pow(2, retries) * 1000));
        }
    }
    throw new Error("API Failed");
}

async function generateJD() {
    const role = document.getElementById('jd-input').value;
    if (!role) return;
    const btnText = document.getElementById('jd-btn-text');
    const loader = document.getElementById('jd-loader');
    const output = document.getElementById('jd-output');

    btnText.classList.add('hidden');
    loader.classList.remove('hidden');
    output.classList.add('hidden');

    try {
        const res = await callGemini(`Write a concise job description for a ${role} with 3 duties and 3 skills.`);
        output.innerText = res;
        output.classList.remove('hidden');
    } catch (e) {
        output.innerText = "Error fetching JD. Try again.";
        output.classList.remove('hidden');
    } finally {
        btnText.classList.remove('hidden');
        loader.classList.add('hidden');
    }
}

async function getAdvice() {
    const query = document.getElementById('advice-input').value;
    if (!query) return;
    const btnText = document.getElementById('advice-btn-text');
    const loader = document.getElementById('advice-loader');
    const output = document.getElementById('advice-output');

    btnText.classList.add('hidden');
    loader.classList.remove('hidden');
    output.classList.add('hidden');

    try {
        const sys = "You are TechVritti Advisor. Recommend from our programs: ML/AI, Cyber, VLSI, Full Stack, Cloud, Soft Skills. 3 sentences max.";
        const res = await callGemini(query, sys);
        output.innerText = res;
        output.classList.remove('hidden');
    } catch (e) {
        output.innerText = "Error fetching advice.";
        output.classList.remove('hidden');
    } finally {
        btnText.classList.remove('hidden');
        loader.classList.add('hidden');
    }
}

const menuToggle = document.getElementById('menu-toggle');
const menuClose = document.getElementById('menu-close');
const mobileMenu = document.getElementById('mobile-menu');

if (menuToggle) menuToggle.onclick = () => mobileMenu.classList.remove('translate-x-full');
if (menuClose) menuClose.onclick = () => mobileMenu.classList.add('translate-x-full');
if (mobileMenu) mobileMenu.onclick = (e) => { if(e.target.tagName === 'A') mobileMenu.classList.add('translate-x-full'); };

const nav = document.getElementById('navbar');
window.onscroll = () => {
    if (window.scrollY > 50) nav.classList.add('glass', 'shadow-lg', 'py-2');
    else nav.classList.remove('glass', 'shadow-lg', 'py-2');
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('appear'); });
}, { threshold: 0.1 });
document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
