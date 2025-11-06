document.addEventListener('DOMContentLoaded', () => {

    // Select all the necessary elements from the DOM
    const checkboxes = document.querySelectorAll('.confluence-checkbox');
    const scoreValueEl = document.getElementById('score-value');
    const scoreFeedbackEl = document.getElementById('score-feedback');
    const resetButton = document.getElementById('reset-btn');
    const narrativeTextarea = document.getElementById('trade-narrative');

    const TOTAL_POINTS = 12;

    function updateScore() {
        let currentScore = 0;
        
        // Loop through each checkbox to see if it's checked
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                currentScore++;
            }
        });

        // Update the score display
        scoreValueEl.textContent = currentScore;

        // Update the feedback message and color based on the score
        scoreFeedbackEl.className = ''; // Reset classes
        if (currentScore >= 9) {
            scoreFeedbackEl.textContent = 'A+ Setup. High Probability.';
            scoreFeedbackEl.classList.add('prob-high');
        } else if (currentScore >= 6) {
            scoreFeedbackEl.textContent = 'Viable Setup. Medium Probability.';
            scoreFeedbackEl.classList.add('prob-medium');
        } else {
            scoreFeedbackEl.textContent = 'Low Probability. Consider Passing.';
            scoreFeedbackEl.classList.add('prob-low');
        }
    }

    function resetChecklist() {
        // Uncheck all checkboxes
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        // Clear the narrative textarea
        narrativeTextarea.value = '';

        // Update the score display to reset it to 0
        updateScore();
    }

    // Add an event listener to each checkbox that calls updateScore on change
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateScore);
    });

    // Add an event listener to the reset button
    resetButton.addEventListener('click', resetChecklist);

    // Initial call to set the score to 0 on page load
    updateScore();
});
