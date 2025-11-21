// Test results data
let testResults = null;

// Initialize results when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadResults();
    animateResults();
});

function loadResults() {
    try {
        const storedResults = sessionStorage.getItem('testResults');
        if (!storedResults) {
            showError('No test results found. Please take a test first.');
            return;
        }

        testResults = JSON.parse(storedResults);
        displayResults();
        
    } catch (error) {
        console.error('Error loading results:', error);
        showError('Failed to load test results.');
    }
}

function displayResults() {
    if (!testResults) return;

    const { results, testData, userAnswers, timeSpent, testMode } = testResults;
    
    // Update basic info
    document.getElementById('testTitle').textContent = testData.title || testData.subcategory || 'NCC Test';
    document.getElementById('testMode').textContent = testMode === 'exam' ? 'Exam Mode' : 'Practice Mode';
    
    // Update score
    const scorePercentage = results.score;
    document.getElementById('scorePercentage').textContent = `${scorePercentage}%`;
    
    // Update score circle
    const scoreCircle = document.getElementById('scoreCircle');
    scoreCircle.style.setProperty('--percentage', `${scorePercentage}%`);
    
    // Update result badge
    if (results.passed) {
        document.getElementById('resultBadge').style.display = 'inline-block';
        scoreCircle.classList.add('pulse');
    } else {
        document.getElementById('failBadge').style.display = 'inline-block';
    }
    
    // Update statistics
    document.getElementById('correctAnswers').textContent = results.correctCount;
    document.getElementById('totalQuestions').textContent = results.totalQuestions;
    document.getElementById('earnedPoints').textContent = `${results.earnedPoints}/${results.totalPoints}`;
    
    // Format time spent
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;
    document.getElementById('timeSpent').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Calculate average time per question
    const avgTime = Math.round(timeSpent / results.totalQuestions);
    document.getElementById('timePerQuestion').textContent = `${avgTime}s`;
    
    // Update progress bars
    const accuracy = Math.round((results.correctCount / results.totalQuestions) * 100);
    document.getElementById('accuracyText').textContent = `${accuracy}%`;
    document.getElementById('accuracyBar').style.width = `${accuracy}%`;
    
    const completion = 100; // All questions are answered in review
    document.getElementById('completionText').textContent = `${completion}%`;
    document.getElementById('completionBar').style.width = `${completion}%`;
    
    // Display performance message
    displayPerformanceMessage(scorePercentage);
    
    // Display question review
    displayQuestionReview();
}

function displayPerformanceMessage(score) {
    const messageElement = document.getElementById('performanceMessage');
    const messageText = document.getElementById('messageText');
    
    let message, type;
    
    if (score >= 90) {
        message = "Outstanding performance! Your dedication and hard work have truly paid off. You demonstrate exceptional understanding of the subject matter.";
        type = "excellent";
    } else if (score >= 75) {
        message = "Excellent work! You have a strong grasp of the material. Keep up the good work and continue to challenge yourself.";
        type = "good";
    } else if (score >= 60) {
        message = "Good effort! You have a solid foundation. Review the areas where you faced challenges to improve further.";
        type = "average";
    } else if (score >= 40) {
        message = "You've passed, but there's room for improvement. Focus on the topics where you struggled and practice more.";
        type = "average";
    } else {
        message = "Don't be discouraged! Use this as a learning opportunity. Review the material thoroughly and try again.";
        type = "poor";
    }
    
    messageText.textContent = message;
    messageElement.className = `performance-message alert ${type}`;
    messageElement.style.display = 'block';
}

function displayQuestionReview() {
    const container = document.getElementById('questionReviewContainer');
    const { questions } = testResults.testData;
    const { userAnswers } = testResults;
    
    container.innerHTML = '';
    
    questions.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer.isCorrect;
        const correctAnswers = question.correct_answer || [];
        
        const questionHTML = `
            <div class="question-review ${isCorrect ? 'correct' : 'incorrect'} fade-in">
                <div class="d-flex align-items-start mb-3">
                    <div class="question-number">${index + 1}</div>
                    <div class="flex-grow-1">
                        <h6 class="mb-2">${escapeHtml(question.text)}</h6>
                        <div class="d-flex align-items-center mb-2">
                            <span class="badge ${isCorrect ? 'bg-success' : 'bg-danger'} me-2">
                                ${isCorrect ? 'Correct' : 'Incorrect'}
                            </span>
                            <small class="text-muted">
                                Points: ${question.points || 1}
                            </small>
                        </div>
                    </div>
                </div>
                
                <div class="options-list">
                    ${Object.entries(question.options || {}).map(([key, value]) => {
                        const isUserSelected = userAnswer.selected.includes(key);
                        const isCorrectAnswer = correctAnswers.includes(key);
                        let indicatorClass = 'neutral';
                        
                        if (isCorrectAnswer) {
                            indicatorClass = 'correct';
                        } else if (isUserSelected && !isCorrectAnswer) {
                            indicatorClass = 'incorrect';
                        } else if (isUserSelected) {
                            indicatorClass = 'selected';
                        }
                        
                        return `
                            <div class="d-flex align-items-center mb-2 p-2 rounded ${isCorrectAnswer ? 'bg-light-success' : ''}">
                                <div class="option-indicator ${indicatorClass}">
                                    ${key.toUpperCase()}
                                </div>
                                <div class="flex-grow-1 ${isCorrectAnswer ? 'fw-bold text-success' : ''}">
                                    ${escapeHtml(value)}
                                </div>
                                ${isUserSelected ? '<small class="text-primary ms-2"><i class="fas fa-check-circle"></i> Your choice</small>' : ''}
                                ${isCorrectAnswer && !isUserSelected ? '<small class="text-success ms-2"><i class="fas fa-star"></i> Correct answer</small>' : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
                
                ${question.explanation ? `
                    <div class="explanation-box">
                        <strong><i class="fas fa-lightbulb me-2 text-warning"></i>Explanation:</strong>
                        ${escapeHtml(question.explanation)}
                    </div>
                ` : ''}
            </div>
        `;
        
        container.innerHTML += questionHTML;
    });
}

function animateResults() {
    if (!testResults) return;
    
    // Animate counting up statistics
    animateValue('correctAnswers', 0, testResults.results.correctCount, 2000);
    animateValue('totalQuestions', 0, testResults.results.totalQuestions, 2000);
    animateValue('earnedPoints', 0, testResults.results.earnedPoints, 2000);
}

function animateValue(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        
        if (elementId === 'earnedPoints') {
            element.textContent = `${value}/${testResults.results.totalPoints}`;
        } else {
            element.textContent = value;
        }
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function restartTest() {
    if (testResults) {
        const { testData, testMode } = testResults;
        const category = testData.category || 'common';
        const subcategory = testData.subcategory || 'general';
        
        window.location.href = `ongoing-test.html?category=${category}&subcategory=${subcategory}&mode=${testMode}`;
    } else {
        window.location.href = 'tests.html';
    }
}

function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') return unsafe;
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function showError(message) {
    document.body.innerHTML = `
        <div class="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
            <div class="text-center p-4 bg-white rounded shadow-lg" style="max-width: 500px;">
                <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                <h3 class="text-danger mb-3">Results Error</h3>
                <p class="lead mb-3">${message}</p>
                <div class="mt-4">
                    <a href="tests.html" class="btn btn-primary">
                        <i class="fas fa-arrow-left me-2"></i>Back to Tests
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Handle shared results
function handleSharedResults() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('shared') === 'true') {
        const score = urlParams.get('score');
        const testName = urlParams.get('test');
        
        if (score && testName) {
            document.getElementById('testTitle').textContent = decodeURIComponent(testName);
            document.getElementById('scorePercentage').textContent = `${score}%`;
            document.getElementById('scoreCircle').style.setProperty('--percentage', `${score}%`);
            
            // Hide detailed review for shared results
            document.getElementById('questionReviewContainer').innerHTML = `
                <div class="alert alert-info text-center">
                    <i class="fas fa-info-circle me-2"></i>
                    Detailed question review is only available to the test taker.
                </div>
            `;
        }
    }
}

// Initialize shared results handling
handleSharedResults();