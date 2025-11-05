// ongoing-test.js - Test Session Management

class OngoingTest {
    constructor() {
        this.currentTest = null;
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.timer = null;
        this.timeRemaining = 0;
        this.testMode = 'practice'; // 'practice' or 'exam'
        this.testConfig = {};
        this.isTestActive = false;
        
        // Bind all methods that will be used as event handlers
        this.handleKeyboardNavigation = this.handleKeyboardNavigation.bind(this);
        this.handleTabSwitch = this.handleTabSwitch.bind(this);
        this.handleWindowBlur = this.handleWindowBlur.bind(this);
        this.previousQuestion = this.previousQuestion.bind(this);
        this.nextQuestion = this.nextQuestion.bind(this);
        this.confirmRestart = this.confirmRestart.bind(this);
        this.showSubmitConfirmation = this.showSubmitConfirmation.bind(this);
        this.submitTest = this.submitTest.bind(this);
        this.selectOption = this.selectOption.bind(this);
        
        console.log('OngoingTest constructor initialized');
        this.initializeTest();
    }

    async initializeTest() {
        try {
            console.log('Starting test initialization...');
            
            // Get test parameters from URL
            const urlParams = new URLSearchParams(window.location.search);
            const category = urlParams.get('category');
            const subcategory = urlParams.get('subcategory');
            this.testMode = urlParams.get('mode') || 'practice';
            
            console.log('URL Parameters:', { category, subcategory, mode: this.testMode });
            
            if (!category || !subcategory) {
                this.showError('Invalid test parameters. Please return to tests page.');
                return;
            }

            // Load test data
            await this.loadTestData(category, subcategory);
            
            // Initialize UI
            this.initializeUI();
            
            // Start security monitoring
            this.initializeSecurity();
            
            // Start test
            this.startTest();
            
            console.log('Test initialized successfully');
            
        } catch (error) {
            console.error('Test initialization failed:', error);
            this.showError('Failed to load test. Please try again.', error.message);
        }
    }

    async loadTestData(category, subcategory) {
        try {
            // Use the correct file path structure
            const filePath = `test/${category}/${subcategory}.json`;
            console.log('Attempting to load test from:', filePath);
            
            const response = await fetch(filePath);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
            }
            
            const testData = await response.json();
            console.log('Test data loaded successfully:', testData);
            
            // Validate test data structure
            if (!testData.questions || !Array.isArray(testData.questions)) {
                throw new Error('Invalid test file format: missing questions array');
            }
            
            this.currentTest = testData;
            this.questions = testData.questions;
            this.testConfig = testData.metadata || {};
            
            console.log(`Loaded ${this.questions.length} questions`);
            console.log('Test config:', this.testConfig);
            
            if (this.questions.length === 0) {
                throw new Error('No questions found in test file');
            }
            
            // Validate each question has required fields
            this.questions.forEach((question, index) => {
                if (!question.text) {
                    throw new Error(`Question ${index + 1} missing text`);
                }
                if (!question.options || typeof question.options !== 'object') {
                    throw new Error(`Question ${index + 1} missing options`);
                }
                if (!question.correct_answer || !Array.isArray(question.correct_answer)) {
                    throw new Error(`Question ${index + 1} missing correct_answer array`);
                }
            });
            
            // Initialize user answers
            this.questions.forEach((question, index) => {
                this.userAnswers[index] = {
                    selected: [],
                    isAnswered: false,
                    isCorrect: false
                };
            });
            
        } catch (error) {
            console.error('Error loading test data:', error);
            console.error('Error details:', {
                category,
                subcategory,
                errorMessage: error.message,
                stack: error.stack
            });
            throw new Error(`Could not load test questions: ${error.message}`);
        }
    }

    initializeUI() {
        try {
            console.log('Initializing UI...');
            
            // Set test info
            const testTitle = document.getElementById('testTitle');
            const testMode = document.getElementById('testMode');
            
            if (!testTitle || !testMode) {
                throw new Error('Required UI elements not found');
            }
            
            testTitle.textContent = this.currentTest.title || this.currentTest.subcategory || 'NCC Test';
            testMode.textContent = this.testMode === 'exam' ? 'Exam Mode' : 'Practice Mode';
            
            // Initialize timer
            this.timeRemaining = this.testConfig.time_limit || 1800; // Default 30 minutes
            this.updateTimerDisplay();
            
            // Initialize progress
            this.updateProgress();
            
            // Create question navigation buttons
            this.createNavigationButtons();
            
            // Load first question
            this.loadQuestion(0);
            
            // Initialize event listeners
            this.initializeEventListeners();
            
            console.log('UI initialized successfully');
            
        } catch (error) {
            console.error('UI initialization failed:', error);
            throw new Error('Failed to initialize test interface');
        }
    }

    initializeEventListeners() {
        try {
            // Navigation buttons
            const prevBtn = document.getElementById('prevQuestionBtn');
            const nextBtn = document.getElementById('nextQuestionBtn');
            const restartBtn = document.getElementById('restartTestBtn');
            const submitBtn = document.getElementById('submitTestBtn');
            const confirmSubmitBtn = document.getElementById('confirmSubmitBtn');
            
            if (prevBtn) prevBtn.addEventListener('click', this.previousQuestion);
            if (nextBtn) nextBtn.addEventListener('click', this.nextQuestion);
            if (restartBtn) restartBtn.addEventListener('click', this.confirmRestart);
            if (submitBtn) submitBtn.addEventListener('click', this.showSubmitConfirmation);
            if (confirmSubmitBtn) confirmSubmitBtn.addEventListener('click', this.submitTest);
            
            // Keyboard navigation
            document.addEventListener('keydown', this.handleKeyboardNavigation);
            
            // Prevent right-click
            document.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.showWarning('Right-click is disabled during test.');
            });
            
            // Prevent text selection
            document.addEventListener('selectstart', (e) => {
                e.preventDefault();
            });
            
            console.log('Event listeners initialized');
            
        } catch (error) {
            console.error('Event listener initialization failed:', error);
        }
    }

    initializeSecurity() {
        try {
            // Tab visibility detection
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.handleTabSwitch();
                }
            });
            
            // Window blur (switching applications)
            window.addEventListener('blur', this.handleWindowBlur);
            
            // Prevent developer tools
            document.addEventListener('keydown', (e) => {
                if (e.key === 'F12' || 
                    (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                    (e.ctrlKey && e.shiftKey && e.key === 'J') ||
                    (e.ctrlKey && e.key === 'U')) {
                    e.preventDefault();
                    this.showWarning('Developer tools are disabled during test.');
                }
            });
            
            console.log('Security features initialized');
            
        } catch (error) {
            console.error('Security initialization failed:', error);
        }
    }

    handleTabSwitch() {
        if (this.testMode === 'exam' && this.isTestActive) {
            this.showWarningModal(
                'Warning: You switched away from the test window. ' +
                'This is not allowed in exam mode. Multiple violations may result in test cancellation.'
            );
        }
    }

    handleWindowBlur() {
        if (this.testMode === 'exam' && this.isTestActive) {
            this.showWarningModal(
                'Security Alert: You switched to another application. ' +
                'This is not permitted in exam mode. Your test may be cancelled.'
            );
        }
    }

    showWarningModal(message) {
        try {
            const warningMessage = document.getElementById('warningMessage');
            const examWarning = document.getElementById('examWarning');
            
            if (warningMessage) warningMessage.textContent = message;
            
            if (examWarning) {
                examWarning.style.display = this.testMode === 'exam' ? 'block' : 'none';
            }
            
            const modalElement = document.getElementById('warningModal');
            if (modalElement && typeof bootstrap !== 'undefined') {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
            }
        } catch (error) {
            console.error('Error showing warning modal:', error);
            alert(message); // Fallback
        }
    }

    startTest() {
        this.isTestActive = true;
        this.startTimer();
        
        console.log(`Test started in ${this.testMode} mode`);
        
        // Show exam mode warnings
        if (this.testMode === 'exam') {
            this.showWarningModal(
                'Exam Mode Active: Switching applications or tabs will result in test cancellation. ' +
                'Keep this window focused until test completion.'
            );
        }
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();
            
            if (this.timeRemaining <= 0) {
                this.timeUp();
            }
            
            // Warning when 5 minutes remaining
            if (this.timeRemaining === 300) {
                this.showTimeWarning('5 minutes remaining!');
            }
            
            // Warning when 1 minute remaining
            if (this.timeRemaining === 60) {
                this.showTimeWarning('1 minute remaining!');
            }
            
        }, 1000);
        
        console.log('Timer started');
    }

    updateTimerDisplay() {
        const timerElement = document.getElementById('testTimer');
        if (!timerElement) return;
        
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Add warning styles
        timerElement.classList.remove('warning', 'danger');
        if (this.timeRemaining <= 300) {
            timerElement.classList.add('warning');
        }
        if (this.timeRemaining <= 60) {
            timerElement.classList.add('danger');
        }
    }

    showTimeWarning(message) {
        try {
            const toast = document.createElement('div');
            toast.className = 'alert alert-warning alert-dismissible fade show position-fixed';
            toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
            toast.innerHTML = `
                <strong><i class="fas fa-clock me-2"></i>Time Warning</strong>
                <div>${message}</div>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            document.body.appendChild(toast);
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 5000);
        } catch (error) {
            console.error('Error showing time warning:', error);
        }
    }

    timeUp() {
        clearInterval(this.timer);
        this.isTestActive = false;
        
        console.log('Time up - auto submitting test');
        
        this.showWarningModal(
            'Time is up! Your test will be automatically submitted.'
        );
        
        setTimeout(() => {
            this.submitTest();
        }, 3000);
    }

    loadQuestion(index) {
        if (index < 0 || index >= this.questions.length) {
            console.error('Invalid question index:', index);
            return;
        }
        
        this.currentQuestionIndex = index;
        const question = this.questions[index];
        
        console.log(`Loading question ${index + 1} of ${this.questions.length}`);
        
        // Update question display
        const currentQuestionNum = document.getElementById('currentQuestionNum');
        const totalQuestions = document.getElementById('totalQuestions');
        
        if (currentQuestionNum) currentQuestionNum.textContent = index + 1;
        if (totalQuestions) totalQuestions.textContent = this.questions.length;
        
        // Create question HTML
        const questionContainer = document.getElementById('questionContainer');
        if (questionContainer) {
            questionContainer.innerHTML = this.createQuestionHTML(question, index);
        }
        
        // Update navigation
        this.updateNavigationButtons();
        this.updateProgress();
        
        // Restore user answer if exists
        this.restoreUserAnswer(index);
    }

    createQuestionHTML(question, index) {
        const questionType = question.type || 'multiple_choice';
        const optionsHTML = this.createOptionsHTML(question, index, questionType);
        
        return `
            <div class="question-card" data-question-index="${index}">
                <div class="question-meta">
                    <span class="question-type">${this.getQuestionTypeLabel(questionType)}</span>
                    <span class="question-points">${question.points || 1} point${question.points !== 1 ? 's' : ''}</span>
                </div>
                
                <div class="question-text">
                    ${this.escapeHtml(question.text)}
                </div>
                
                <div class="options-container" data-question-type="${questionType}">
                    ${optionsHTML}
                </div>
                
                ${question.explanation && this.testMode === 'practice' ? `
                    <div class="explanation-container mt-3" style="display: none;">
                        <div class="alert alert-info">
                            <strong>Explanation:</strong> ${this.escapeHtml(question.explanation)}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    createOptionsHTML(question, questionIndex, questionType) {
        const options = question.options || {};
        let html = '';
        
        Object.keys(options).forEach(key => {
            const optionText = options[key];
            const isSelected = this.userAnswers[questionIndex].selected.includes(key);
            
            html += `
                <div class="option-item ${isSelected ? 'selected' : ''} ${questionType}" 
                     data-option="${key}"
                     onclick="window.ongoingTest.selectOption(${questionIndex}, '${key}')">
                    <div class="option-letter">${key.toUpperCase()}</div>
                    <div class="option-text">${this.escapeHtml(optionText)}</div>
                </div>
            `;
        });
        
        return html;
    }

    selectOption(questionIndex, optionKey) {
        try {
            const question = this.questions[questionIndex];
            const questionType = question.type || 'multiple_choice';
            const userAnswer = this.userAnswers[questionIndex];
            
            console.log(`Selecting option ${optionKey} for question ${questionIndex}`);
            
            if (questionType === 'multiple_choice') {
                // Single selection - replace current selection
                userAnswer.selected = [optionKey];
            } else if (questionType === 'multiple_response') {
                // Multiple selection - toggle option
                const index = userAnswer.selected.indexOf(optionKey);
                if (index > -1) {
                    userAnswer.selected.splice(index, 1);
                } else {
                    userAnswer.selected.push(optionKey);
                }
            }
            
            userAnswer.isAnswered = userAnswer.selected.length > 0;
            
            // Update UI
            this.updateOptionSelection(questionIndex);
            this.updateNavigationButtons();
            
            // In practice mode, show immediate feedback
            if (this.testMode === 'practice' && userAnswer.isAnswered) {
                this.showPracticeFeedback(questionIndex);
            }
        } catch (error) {
            console.error('Error selecting option:', error);
        }
    }

    updateOptionSelection(questionIndex) {
        const questionElement = document.querySelector(`[data-question-index="${questionIndex}"]`);
        if (!questionElement) return;
        
        const optionElements = questionElement.querySelectorAll('.option-item');
        const userAnswer = this.userAnswers[questionIndex];
        
        optionElements.forEach(optionElement => {
            const optionKey = optionElement.getAttribute('data-option');
            const isSelected = userAnswer.selected.includes(optionKey);
            
            optionElement.classList.toggle('selected', isSelected);
        });
    }

    showPracticeFeedback(questionIndex) {
        try {
            const question = this.questions[questionIndex];
            const userAnswer = this.userAnswers[questionIndex];
            const correctAnswer = question.correct_answer || [];
            
            // Check if answer is correct
            const isCorrect = JSON.stringify(userAnswer.selected.sort()) === JSON.stringify(correctAnswer.sort());
            userAnswer.isCorrect = isCorrect;
            
            console.log(`Question ${questionIndex + 1} answered: ${isCorrect ? 'Correct' : 'Incorrect'}`);
            
            // Show explanation
            const explanationContainer = document.querySelector(`[data-question-index="${questionIndex}"] .explanation-container`);
            if (explanationContainer) {
                explanationContainer.style.display = 'block';
            }
            
            // Highlight correct/incorrect answers
            this.highlightAnswers(questionIndex, isCorrect);
        } catch (error) {
            console.error('Error showing practice feedback:', error);
        }
    }

    highlightAnswers(questionIndex, isCorrect) {
        const questionElement = document.querySelector(`[data-question-index="${questionIndex}"]`);
        if (!questionElement) return;
        
        const question = this.questions[questionIndex];
        const correctAnswer = question.correct_answer || [];
        
        questionElement.querySelectorAll('.option-item').forEach(optionElement => {
            const optionKey = optionElement.getAttribute('data-option');
            const isUserSelected = this.userAnswers[questionIndex].selected.includes(optionKey);
            const isCorrectAnswer = correctAnswer.includes(optionKey);
            
            optionElement.classList.remove('correct-answer', 'wrong-answer');
            
            if (isCorrectAnswer) {
                optionElement.classList.add('correct-answer');
            } else if (isUserSelected && !isCorrectAnswer) {
                optionElement.classList.add('wrong-answer');
            }
        });
    }

    createNavigationButtons() {
        const navContainer = document.getElementById('questionNavButtons');
        if (!navContainer) return;
        
        navContainer.innerHTML = '';
        
        this.questions.forEach((_, index) => {
            const button = document.createElement('button');
            button.className = 'nav-btn';
            button.textContent = index + 1;
            button.addEventListener('click', () => {
                this.loadQuestion(index);
            });
            navContainer.appendChild(button);
        });
        
        this.updateNavigationButtons();
    }

    updateNavigationButtons() {
        // Update desktop navigation buttons
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach((button, index) => {
            const userAnswer = this.userAnswers[index];
            
            button.classList.remove('active', 'answered', 'current');
            
            if (index === this.currentQuestionIndex) {
                button.classList.add('current');
            } else if (userAnswer.isAnswered) {
                button.classList.add('answered');
            }
        });
        
        // Update mobile navigation buttons
        const prevBtn = document.getElementById('prevQuestionBtn');
        const nextBtn = document.getElementById('nextQuestionBtn');
        
        if (prevBtn) prevBtn.disabled = this.currentQuestionIndex === 0;
        if (nextBtn) nextBtn.disabled = this.currentQuestionIndex === this.questions.length - 1;
        
        // Update submit confirmation counts
        this.updateSubmitConfirmation();
    }

    updateProgress() {
        const progressBar = document.getElementById('progressBar');
        if (!progressBar) return;
        
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.loadQuestion(this.currentQuestionIndex - 1);
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.loadQuestion(this.currentQuestionIndex + 1);
        }
    }

    handleKeyboardNavigation(e) {
        if (e.key === 'ArrowLeft') {
            this.previousQuestion();
        } else if (e.key === 'ArrowRight') {
            this.nextQuestion();
        } else if (e.key >= '1' && e.key <= '4') {
            // Select option 1-4 with keyboard
            const optionKey = String.fromCharCode(96 + parseInt(e.key)); // 1->a, 2->b, etc.
            this.selectOption(this.currentQuestionIndex, optionKey);
        }
    }

    updateSubmitConfirmation() {
        const answeredCount = Object.values(this.userAnswers).filter(answer => answer.isAnswered).length;
        const remainingCount = this.questions.length - answeredCount;
        
        const answeredElement = document.getElementById('answeredCount');
        const remainingElement = document.getElementById('remainingCount');
        
        if (answeredElement) answeredElement.textContent = answeredCount;
        if (remainingElement) remainingElement.textContent = remainingCount;
    }

    showSubmitConfirmation() {
        this.updateSubmitConfirmation();
        const modalElement = document.getElementById('confirmSubmitModal');
        if (modalElement && typeof bootstrap !== 'undefined') {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
    }

    submitTest() {
        try {
            console.log('Submitting test...');
            
            clearInterval(this.timer);
            this.isTestActive = false;
            
            // Calculate results
            const results = this.calculateResults();
            
            console.log('Test results:', results);
            
            // Store results in sessionStorage for results page
            sessionStorage.setItem('testResults', JSON.stringify({
                testData: this.currentTest,
                userAnswers: this.userAnswers,
                results: results,
                timeSpent: (this.testConfig.time_limit || 1800) - this.timeRemaining,
                testMode: this.testMode
            }));
            
            // Redirect to results page
            window.location.href = 'test-results.html';
            
        } catch (error) {
            console.error('Error submitting test:', error);
            this.showError('Failed to submit test. Please try again.');
        }
    }

    calculateResults() {
        let correctCount = 0;
        let totalPoints = 0;
        let earnedPoints = 0;
        
        this.questions.forEach((question, index) => {
            const userAnswer = this.userAnswers[index];
            const correctAnswer = question.correct_answer || [];
            const points = question.points || 1;
            
            totalPoints += points;
            
            const isCorrect = JSON.stringify(userAnswer.selected.sort()) === JSON.stringify(correctAnswer.sort());
            
            if (isCorrect) {
                correctCount++;
                earnedPoints += points;
                userAnswer.isCorrect = true;
            }
        });
        
        const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
        const passed = score >= (this.testConfig.passing_score || 70);
        
        return {
            correctCount,
            totalQuestions: this.questions.length,
            score,
            earnedPoints,
            totalPoints,
            passed
        };
    }

    confirmRestart() {
        if (confirm('Are you sure you want to restart the test? All your progress will be lost.')) {
            this.restartTest();
        }
    }

    restartTest() {
        clearInterval(this.timer);
        this.userAnswers = {};
        this.currentQuestionIndex = 0;
        this.timeRemaining = this.testConfig.time_limit || 1800;
        
        // Re-initialize user answers
        this.questions.forEach((_, index) => {
            this.userAnswers[index] = {
                selected: [],
                isAnswered: false,
                isCorrect: false
            };
        });
        
        // Restart test
        this.loadQuestion(0);
        this.startTimer();
        this.updateNavigationButtons();
        
        console.log('Test restarted');
    }

    restoreUserAnswer(questionIndex) {
        const userAnswer = this.userAnswers[questionIndex];
        if (userAnswer.isAnswered) {
            this.updateOptionSelection(questionIndex);
        }
    }

    // Utility methods
    escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') return unsafe;
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    getQuestionTypeLabel(type) {
        const types = {
            'multiple_choice': 'Multiple Choice',
            'multiple_response': 'Multiple Response',
            'true_false': 'True/False'
        };
        return types[type] || 'Question';
    }

    showError(message, details = '') {
        document.body.innerHTML = `
            <div class="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
                <div class="text-center p-4 bg-white rounded shadow-lg" style="max-width: 500px;">
                    <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                    <h3 class="text-danger mb-3">Test Error</h3>
                    <p class="lead mb-3">${message}</p>
                    ${details ? `<p class="text-muted small mb-3">${details}</p>` : ''}
                    <div class="mt-4">
                        <button class="btn btn-primary me-2" onclick="window.location.href='tests.html'">
                            <i class="fas fa-arrow-left me-2"></i>Back to Tests
                        </button>
                        <button class="btn btn-outline-secondary" onclick="location.reload()">
                            <i class="fas fa-redo me-2"></i>Retry
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    showWarning(message) {
        try {
            const warning = document.createElement('div');
            warning.className = 'alert alert-warning position-fixed';
            warning.style.cssText = 'top: 10px; right: 10px; z-index: 9999; min-width: 250px;';
            warning.innerHTML = `
                <i class="fas fa-exclamation-circle me-2"></i>${message}
            `;
            document.body.appendChild(warning);
            
            setTimeout(() => {
                if (warning.parentNode) {
                    warning.remove();
                }
            }, 3000);
        } catch (error) {
            console.error('Error showing warning:', error);
        }
    }
}

// Additional CSS for answer highlighting
const additionalStyles = `
    .option-item.correct-answer {
        border-color: #28a745 !important;
        background: #d4edda !important;
    }
    
    .option-item.correct-answer .option-letter {
        background: #28a745 !important;
        color: white !important;
    }
    
    .option-item.wrong-answer {
        border-color: #dc3545 !important;
        background: #f8d7da !important;
    }
    
    .option-item.wrong-answer .option-letter {
        background: #dc3545 !important;
        color: white !important;
    }
    
    .nav-btn.current {
        background: #007bff !important;
        color: white !important;
        border-color: #007bff !important;
    }
    
    .nav-btn.answered {
        background: #28a745 !important;
        color: white !important;
        border-color: #28a745 !important;
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize test when page loads
let ongoingTest;

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing test...');
    
    try {
        ongoingTest = new OngoingTest();
        window.ongoingTest = ongoingTest; // Make it globally available
        
        console.log('Test initialized successfully on DOM load');
    } catch (error) {
        console.error('Failed to initialize test on DOM load:', error);
        document.body.innerHTML = `
            <div class="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
                <div class="text-center p-4 bg-white rounded shadow-lg">
                    <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                    <h3 class="text-danger mb-3">Critical Error</h3>
                    <p class="lead mb-3">Failed to initialize test system</p>
                    <button class="btn btn-primary" onclick="window.location.href='tests.html'">
                        <i class="fas fa-arrow-left me-2"></i>Return to Tests
                    </button>
                </div>
            </div>
        `;
    }
});

// Make it globally available for HTML onclick handlers
window.ongoingTest = ongoingTest;