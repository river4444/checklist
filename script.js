document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('checklist-form');
    const allInputs = document.querySelectorAll('input, select, textarea');
    const checkboxes = document.querySelectorAll('.confluence-checkbox');
    const scoreValueEl = document.getElementById('score-value');
    const scoreFeedbackEl = document.getElementById('score-feedback');
    const resetButton = document.getElementById('reset-btn');
    
    const entryPriceEl = document.getElementById('entry-price');
    const stopLossEl = document.getElementById('stop-loss');
    const takeProfit1El = document.getElementById('take-profit-1');
    const rrValueEl = document.getElementById('rr-value');
    const htfBiasEl = document.getElementById('htf-bias');

    const TOTAL_POINTS = 12;

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

        // Reset if inputs are not valid numbers or bias is not set
        if (isNaN(entry) || isNaN(stop) || isNaN(tp1) || bias === 'neutral') {
            rrValueEl.textContent = 'N/A';
            rrValueEl.style.color = 'var(--secondary-text)';
            return;
        }

        let risk, reward;

        if (bias === 'bullish') {
            risk = entry - stop;
            reward = tp1 - entry;
        } else if (bias === 'bearish') {
            risk = stop - entry;
            reward = entry - tp1;
        } else {
            // Should not happen, but as a fallback
            rrValueEl.textContent = 'Set Bias';
            rrValueEl.style.color = 'var(--secondary-text)';
            return;
        }
        
        // Check for invalid risk or reward values
        if (risk <= 0) {
            rrValueEl.textContent = 'Invalid SL';
            rrValueEl.style.color = 'var(--rr-bad)';
            return;
        }
        if (reward <= 0) {
             rrValueEl.textContent = 'Invalid TP';
             rrValueEl.style.color = 'var(--rr-bad)';
             return;
        }
        
        const rrRatio = (reward / risk).toFixed(2);

        rrValueEl.textContent = `${rrRatio} R`;
        rrValueEl.style.color = rrRatio >= 2.5 ? 'var(--rr-good)' : 'var(--rr-bad)';
    }

    function resetPlan() {
        if (confirm("Are you sure you want to reset the entire plan?")) {
            form.reset();
            document.querySelectorAll('.left-column input, .left-column select, .left-column textarea').forEach(el => {
                if(el.tagName === 'SELECT') el.value = 'neutral';
                else el.value = '';
            });
            localStorage.removeItem('tradePlanData');
            updateAll();
        }
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
