document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENT SELECTORS ---
    const form = document.getElementById('checklist-form');
    const allInputs = document.querySelectorAll('input, select, textarea');
    const checkboxes = document.querySelectorAll('.confluence-checkbox');
    const scoreValueEl = document.getElementById('score-value');
    const scoreFeedbackEl = document.getElementById('score-feedback');
    const resetButton = document.getElementById('reset-btn');
    
    // R:R Calculator Elements
    const entryPriceEl = document.getElementById('entry-price');
    const stopLossEl = document.getElementById('stop-loss');
    const takeProfit1El = document.getElementById('take-profit-1');
    const rrValueEl = document.getElementById('rr-value');
    const htfBiasEl = document.getElementById('htf-bias');

    const TOTAL_POINTS = 12;

    // --- FUNCTIONS ---

    function updateScore() {
        let currentScore = 0;
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) currentScore++;
        });

        scoreValueEl.textContent = currentScore;

        scoreFeedbackEl.className = ''; 
        if (currentScore >= 9) {
            scoreFeedbackEl.textContent = 'A+ Setup. High Probability.';
            scoreFeedbackEl.classList.add('prob-high');
        } else if (currentScore >= 7) {
            scoreFeedbackEl.textContent = 'Viable Setup. Medium Probability.';
            scoreFeedbackEl.classList.add('prob-medium');
        } else {
            scoreFeedbackEl.textContent = 'Low Probability. Consider Passing.';
            scoreFeedbackEl.classList.add('prob-low');
        }
    }
    
    function calculateRR() {
        const entry = parseFloat(entryPriceEl.value);
        const stop = parseFloat(stopLossEl.value);
        const tp1 = parseFloat(takeProfit1El.value);
        const bias = htfBiasEl.value;

        if (!entry || !stop || !tp1 || bias === 'neutral') {
            rrValueEl.textContent = 'N/A';
            rrValueEl.style.color = 'var(--secondary-text)';
            return;
        }

        let risk, reward;

        if (bias === 'bullish') { // For a long trade
            risk = entry - stop;
            reward = tp1 - entry;
        } else { // For a bearish trade
            risk = stop - entry;
            reward = entry - tp1;
        }

        if (risk <= 0) {
            rrValueEl.textContent = 'Invalid SL';
            rrValueEl.style.color = 'var(--rr-bad)';
            return;
        }
        
        const rrRatio = (reward / risk).toFixed(2);

        if (rrRatio > 0) {
            rrValueEl.textContent = `${rrRatio} R`;
            rrValueEl.style.color = rrRatio >= 2.5 ? 'var(--rr-good)' : 'var(--rr-bad)';
        } else {
            rrValueEl.textContent = 'Invalid TP';
            rrValueEl.style.color = 'var(--rr-bad)';
        }
    }

    function resetPlan() {
        form.reset();
        document.querySelectorAll('.left-column input, .left-column select, .left-column textarea').forEach(el => {
            if(el.tagName === 'SELECT') el.value = 'neutral';
            else el.value = '';
        });
        localStorage.removeItem('tradePlanData');
        updateAll();
    }
    
    function saveState() {
        const data = {};
        allInputs.forEach(input => {
            data[input.id] = input.type === 'checkbox' ? input.checked : input.value;
        });
        localStorage.setItem('tradePlanData', JSON.stringify(data));
    }

    function loadState() {
        const data = JSON.parse(localStorage.getItem('tradePlanData'));
        if (data) {
            allInputs.forEach(input => {
                if (data[input.id] !== undefined) {
                    if (input.type === 'checkbox') {
                        input.checked = data[input.id];
                    } else {
                        input.value = data[input.id];
                    }
                }
            });
        }
    }
    
    function updateAll() {
        updateScore();
        calculateRR();
    }

    // --- EVENT LISTENERS ---
    
    allInputs.forEach(input => {
        input.addEventListener('input', () => {
            updateAll();
            saveState();
        });
    });

    resetButton.addEventListener('click', resetPlan);

    // --- INITIALIZATION ---
    loadState();
    updateAll();
});
