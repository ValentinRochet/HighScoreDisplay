document.addEventListener('DOMContentLoaded', function() {
    const addScoreBtn = document.querySelector('.add-score-btn');
    const popup = document.getElementById('popup');
    const cancelBtn = document.getElementById('cancelBtn');
    const scoreForm = document.getElementById('scoreForm');

    const titleElement = document.getElementById('title');
    const titlePopup = document.getElementById('titlePopup');
    const cancelTitleBtn = document.getElementById('cancelTitleBtn');
    const titleForm = document.getElementById('titleForm');
    const newTitleInput = document.getElementById('newTitle');
    const clearScoresBtn = document.getElementById('clearScoresBtn');

    const confirmPopup = document.getElementById('confirmPopup');
    const confirmYes = document.getElementById('confirmYes');
    const confirmNo = document.getElementById('confirmNo');

    const confirmDeleteScore = document.getElementById('confirmDeleteScore');
    const confirmDeleteYes = document.getElementById('confirmDeleteYes');
    const confirmDeleteNo = document.getElementById('confirmDeleteNo');
    const deleteScoreText = document.getElementById('deleteScoreText');

    const viewAllScoresBtn = document.querySelector('.view-all-scores-btn');
    const allScoresPopup = document.getElementById('allScoresPopup');
    const closeAllScoresBtn = document.getElementById('closeAllScoresBtn');
    const allScoresList = document.getElementById('allScoresList');

    let scoreToDelete = null;

    // Charger les données sauvegardées au démarrage
    loadSavedData();

    // Démarrer les animations dynamiques
    startFloatingParticles();
    startScoreAnimations();

    addScoreBtn.addEventListener('click', function() {
        popup.classList.remove('hidden');
    });

    cancelBtn.addEventListener('click', function() {
        popup.classList.add('hidden');
        scoreForm.reset();
    });

    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            popup.classList.add('hidden');
            scoreForm.reset();
        }
    });

    titleElement.addEventListener('click', function() {
        newTitleInput.value = titleElement.textContent;
        titlePopup.classList.remove('hidden');
    });

    cancelTitleBtn.addEventListener('click', function() {
        titlePopup.classList.add('hidden');
        titleForm.reset();
    });

    titlePopup.addEventListener('click', function(e) {
        if (e.target === titlePopup) {
            titlePopup.classList.add('hidden');
            titleForm.reset();
        }
    });

    titleForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const newTitle = newTitleInput.value.trim();
        if (newTitle) {
            titleElement.textContent = newTitle;
            titlePopup.classList.add('hidden');
            titleForm.reset();
            saveData();
        }
    });

    scoreForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const playerName = document.getElementById('playerName').value;
        const playerScore = parseInt(document.getElementById('playerScore').value);

        if (playerName && playerScore) {
            // Ajouter le score (qui gère à la fois la sauvegarde et l'affichage)
            addNewScore(playerName, playerScore);
            popup.classList.add('hidden');
            scoreForm.reset();
        }
    });

    clearScoresBtn.addEventListener('click', function() {
        titlePopup.classList.add('hidden');
        confirmPopup.classList.remove('hidden');
    });

    confirmNo.addEventListener('click', function() {
        confirmPopup.classList.add('hidden');
        titlePopup.classList.remove('hidden');
    });

    confirmYes.addEventListener('click', function() {
        clearAllScores();
        confirmPopup.classList.add('hidden');
        titlePopup.classList.add('hidden');
    });

    confirmPopup.addEventListener('click', function(e) {
        if (e.target === confirmPopup) {
            confirmPopup.classList.add('hidden');
            titlePopup.classList.remove('hidden');
        }
    });

    confirmDeleteNo.addEventListener('click', function() {
        confirmDeleteScore.classList.add('hidden');
        scoreToDelete = null;
    });

    confirmDeleteYes.addEventListener('click', function() {
        if (scoreToDelete !== null) {
            deleteScoreAtIndex(scoreToDelete);
            confirmDeleteScore.classList.add('hidden');
            scoreToDelete = null;
        }
    });

    confirmDeleteScore.addEventListener('click', function(e) {
        if (e.target === confirmDeleteScore) {
            confirmDeleteScore.classList.add('hidden');
            scoreToDelete = null;
        }
    });

    viewAllScoresBtn.addEventListener('click', function() {
        displayAllScores();
        allScoresPopup.classList.remove('hidden');
    });

    closeAllScoresBtn.addEventListener('click', function() {
        allScoresPopup.classList.add('hidden');
    });

    allScoresPopup.addEventListener('click', function(e) {
        if (e.target === allScoresPopup) {
            allScoresPopup.classList.add('hidden');
        }
    });

    function setupRankingClickHandlers() {
        const rankings = document.querySelectorAll('.ranking');
        rankings.forEach((ranking, index) => {
            ranking.addEventListener('click', function() {
                const scoreItem = ranking.closest('.score-item');
                const playerName = scoreItem.querySelector('.player-name').textContent;
                const score = scoreItem.querySelector('.score').textContent;

                // Ne pas permettre de supprimer les scores vides
                if (playerName === '---' && score === '0') {
                    return;
                }

                scoreToDelete = index;
                deleteScoreText.textContent = `Êtes-vous sûr de vouloir supprimer le score de "${playerName}" (${score} points) ?`;
                confirmDeleteScore.classList.remove('hidden');
            });
        });
    }

    function addNewScore(name, score) {
        console.log('Ajout du nouveau score:', name, score);

        // Récupérer tous les scores sauvegardés pour avoir la liste complète
        const savedData = localStorage.getItem('highScoreData');
        let allScores = [];

        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                allScores = data.allScores || data.scores || [];
            } catch (error) {
                allScores = [];
            }
        }

        // Filtrer les scores vides et ajouter le nouveau score
        allScores = allScores.filter(s => s.name !== '---' && s.score > 0);
        allScores.push({ name: name, score: score });
        allScores.sort((a, b) => b.score - a.score);

        // Préparer les scores pour l'affichage (top 10 + remplissage)
        const displayScores = allScores.slice(0, 10);
        while (displayScores.length < 10) {
            displayScores.push({ name: '---', score: 0 });
        }

        // Sauvegarder tous les scores
        const dataToSave = {
            title: titleElement.textContent,
            scores: displayScores,
            allScores: allScores
        };

        localStorage.setItem('highScoreData', JSON.stringify(dataToSave));
        console.log('Score sauvegardé:', dataToSave);

        // Trouver la position du nouveau score
        const newScoreIndex = allScores.findIndex(s => s.name === name && s.score === score);

        // Ne faire l'animation que si le score est dans le top 10
        if (newScoreIndex < 10) {
            animateScoreInsertion(displayScores, newScoreIndex);
        } else {
            // Si le score n'est pas dans le top 10, juste mettre à jour l'affichage sans animation
            updateScoreDisplayWithoutAnimation(displayScores);
        }
    }

    function animateScoreInsertion(scores, newScoreIndex) {
        const scoresContainer = document.querySelector('.score-list');
        const scoreItems = Array.from(scoresContainer.querySelectorAll('.score-item'));

        const itemsToSlide = scoreItems.slice(newScoreIndex);

        itemsToSlide.reverse().forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('sliding-down');
            }, index * 150);
        });

        setTimeout(() => {
            updateScoreDisplay(scores, newScoreIndex);
        }, itemsToSlide.length * 150 + 800);
    }

    function updateScoreDisplay(scores, newScoreIndex) {
        const scoresContainer = document.querySelector('.score-list');
        scoresContainer.innerHTML = '';

        const rankingSuffixes = ['1ST', '2ND', '3RD', '4TH', '5TH', '6TH', '7TH', '8TH', '9TH', '10TH'];

        scores.slice(0, 10).forEach((scoreData, index) => {
            const scoreItem = document.createElement('div');
            scoreItem.className = 'score-item';

            if (index === newScoreIndex) {
                scoreItem.classList.add('sliding-up', 'new-score');
                scoreItem.innerHTML = `
                    <div class="ranking">${rankingSuffixes[index]}</div>
                    <div class="player-name typewriter-container">
                        <span class="typewriter-text" data-text="${scoreData.name}"></span>
                    </div>
                    <div class="score typewriter-container">
                        <span class="typewriter-text" data-text="${scoreData.score}"></span>
                    </div>
                `;
            } else {
                scoreItem.innerHTML = `
                    <div class="ranking">${rankingSuffixes[index]}</div>
                    <div class="player-name">${scoreData.name}</div>
                    <div class="score">${scoreData.score}</div>
                `;
            }

            scoresContainer.appendChild(scoreItem);
        });

        if (newScoreIndex !== -1) {
            setTimeout(() => {
                startTypewriterEffect(newScoreIndex);
            }, 400);
        }

        // Réactiver les handlers de clic après mise à jour
        setTimeout(() => {
            setupRankingClickHandlers();
        }, 500);
    }

    function startTypewriterEffect(scoreIndex) {
        const newScoreItem = document.querySelectorAll('.score-item')[scoreIndex];
        const typewriterElements = newScoreItem.querySelectorAll('.typewriter-text');

        typewriterElements.forEach((element, index) => {
            const text = element.getAttribute('data-text');
            element.textContent = '';

            setTimeout(() => {
                typewriterAnimation(element, text, index === typewriterElements.length - 1);
            }, index * 1000);
        });
    }

    function typewriterAnimation(element, text, isLast) {
        let currentIndex = 0;
        element.style.borderRight = '2px solid #00ff00';

        const typeInterval = setInterval(() => {
            if (currentIndex < text.length) {
                element.textContent += text.charAt(currentIndex);
                currentIndex++;
            } else {
                clearInterval(typeInterval);
                setTimeout(() => {
                    element.style.borderRight = 'none';
                    element.classList.add('typing-complete');
                }, 500);
            }
        }, 120);
    }

    function saveNewScore(name, score) {
        console.log('Sauvegarde immédiate du nouveau score:', name, score);

        // Récupérer les scores actuels depuis localStorage ou créer un tableau vide
        let savedData = localStorage.getItem('highScoreData');
        let currentScores = [];

        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                currentScores = data.scores || [];
            } catch (error) {
                currentScores = [];
            }
        }

        // Ajouter le nouveau score et trier
        currentScores.push({ name: name, score: score });
        currentScores.sort((a, b) => b.score - a.score);

        // Garder tous les scores pour la sauvegarde complète
        const allScores = [...currentScores];

        // Garder seulement les 10 premiers pour l'affichage
        const displayScores = currentScores.slice(0, 10);

        // Compléter avec des entrées vides si nécessaire pour l'affichage
        while (displayScores.length < 10) {
            displayScores.push({ name: '---', score: 0 });
        }

        // Sauvegarder tous les scores
        const dataToSave = {
            title: titleElement.textContent,
            scores: displayScores, // Affichage seulement
            allScores: allScores  // Tous les scores
        };

        localStorage.setItem('highScoreData', JSON.stringify(dataToSave));
        console.log('Sauvegarde immédiate terminée:', dataToSave);
    }

    function saveData() {
        console.log('Tentative de sauvegarde...');
        const scoresContainer = document.querySelector('.score-list');
        const scoreItems = Array.from(scoresContainer.querySelectorAll('.score-item'));

        const scores = scoreItems.map(item => {
            return {
                name: item.querySelector('.player-name').textContent,
                score: parseInt(item.querySelector('.score').textContent) || 0
            };
        });

        // Récupérer tous les scores existants
        const savedData = localStorage.getItem('highScoreData');
        let allScores = [];
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                allScores = data.allScores || data.scores || [];
            } catch (error) {
                allScores = [];
            }
        }

        const data = {
            title: titleElement.textContent,
            scores: scores,
            allScores: allScores
        };

        console.log('Données à sauvegarder:', data);
        localStorage.setItem('highScoreData', JSON.stringify(data));
        console.log('Sauvegarde terminée');
    }

    function loadSavedData() {
        const savedData = localStorage.getItem('highScoreData');
        console.log('Données sauvegardées trouvées:', savedData);
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                console.log('Données parsées:', data);

                // Restaurer le titre
                if (data.title) {
                    titleElement.textContent = data.title;
                }

                // Restaurer les scores
                if (data.scores && data.scores.length > 0) {
                    const scoresContainer = document.querySelector('.score-list');
                    scoresContainer.innerHTML = '';

                    const rankingSuffixes = ['1ST', '2ND', '3RD', '4TH', '5TH', '6TH', '7TH', '8TH', '9TH', '10TH'];

                    // Assurer qu'on a toujours 10 lignes
                    for (let i = 0; i < 10; i++) {
                        const scoreItem = document.createElement('div');
                        scoreItem.className = 'score-item';

                        const scoreData = data.scores[i];
                        const name = scoreData ? scoreData.name : '---';
                        const score = scoreData ? scoreData.score : 0;

                        scoreItem.innerHTML = `
                            <div class="ranking">${rankingSuffixes[i]}</div>
                            <div class="player-name">${name}</div>
                            <div class="score">${score}</div>
                        `;

                        scoresContainer.appendChild(scoreItem);
                    }
                }
            } catch (error) {
                console.error('Erreur lors du chargement des données sauvegardées:', error);
            }
        }
        // Activer les handlers de clic après chargement
        setupRankingClickHandlers();
    }

    function clearAllScores() {
        console.log('Suppression de tous les scores...');

        // Effacer le localStorage
        localStorage.removeItem('highScoreData');

        // Remettre l'affichage par défaut
        const scoresContainer = document.querySelector('.score-list');
        scoresContainer.innerHTML = '';

        const rankingSuffixes = ['1ST', '2ND', '3RD', '4TH', '5TH', '6TH', '7TH', '8TH', '9TH', '10TH'];

        for (let i = 0; i < 10; i++) {
            const scoreItem = document.createElement('div');
            scoreItem.className = 'score-item';

            scoreItem.innerHTML = `
                <div class="ranking">${rankingSuffixes[i]}</div>
                <div class="player-name">---</div>
                <div class="score">0</div>
            `;

            scoresContainer.appendChild(scoreItem);
        }

        console.log('Tous les scores ont été supprimés');
        // Réactiver les handlers après suppression
        setupRankingClickHandlers();
    }

    function deleteScoreAtIndex(index) {
        console.log('Suppression du score à l\'index:', index);

        // Récupérer les scores actuels
        const savedData = localStorage.getItem('highScoreData');
        let currentScores = [];
        let allScores = [];

        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                currentScores = data.scores || [];
                allScores = data.allScores || data.scores || [];
            } catch (error) {
                currentScores = [];
                allScores = [];
            }
        }

        // Supprimer le score correspondant dans allScores
        if (index >= 0 && index < currentScores.length) {
            const scoreToDelete = currentScores[index];
            if (scoreToDelete.name !== '---') {
                // Trouver et supprimer le score correspondant dans allScores
                const allScoreIndex = allScores.findIndex(s =>
                    s.name === scoreToDelete.name && s.score === scoreToDelete.score
                );
                if (allScoreIndex !== -1) {
                    allScores.splice(allScoreIndex, 1);
                }
            }
        }

        // Recalculer les scores d'affichage (top 10 de allScores)
        allScores.sort((a, b) => b.score - a.score);
        const displayScores = allScores.slice(0, 10);

        // Compléter avec des entrées vides pour avoir 10 lignes
        while (displayScores.length < 10) {
            displayScores.push({ name: '---', score: 0 });
        }

        // Sauvegarder
        const dataToSave = {
            title: titleElement.textContent,
            scores: displayScores,
            allScores: allScores
        };

        localStorage.setItem('highScoreData', JSON.stringify(dataToSave));

        // Mettre à jour l'affichage
        const scoresContainer = document.querySelector('.score-list');
        scoresContainer.innerHTML = '';

        const rankingSuffixes = ['1ST', '2ND', '3RD', '4TH', '5TH', '6TH', '7TH', '8TH', '9TH', '10TH'];

        displayScores.forEach((scoreData, i) => {
            const scoreItem = document.createElement('div');
            scoreItem.className = 'score-item';

            scoreItem.innerHTML = `
                <div class="ranking">${rankingSuffixes[i]}</div>
                <div class="player-name">${scoreData.name}</div>
                <div class="score">${scoreData.score}</div>
            `;

            scoresContainer.appendChild(scoreItem);
        });

        console.log('Score supprimé, affichage mis à jour');
        // Réactiver les handlers
        setupRankingClickHandlers();
    }

    function updateScoreDisplayWithoutAnimation(scores) {
        const scoresContainer = document.querySelector('.score-list');
        scoresContainer.innerHTML = '';

        const rankingSuffixes = ['1ST', '2ND', '3RD', '4TH', '5TH', '6TH', '7TH', '8TH', '9TH', '10TH'];

        scores.forEach((scoreData, index) => {
            const scoreItem = document.createElement('div');
            scoreItem.className = 'score-item';

            scoreItem.innerHTML = `
                <div class="ranking">${rankingSuffixes[index]}</div>
                <div class="player-name">${scoreData.name}</div>
                <div class="score">${scoreData.score}</div>
            `;

            scoresContainer.appendChild(scoreItem);
        });

        // Réactiver les handlers de clic après mise à jour
        setupRankingClickHandlers();
    }

    function displayAllScores() {
        const savedData = localStorage.getItem('highScoreData');
        let allScores = [];

        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                allScores = data.allScores || data.scores || [];
            } catch (error) {
                allScores = [];
            }
        }

        // Filtrer les scores vides
        allScores = allScores.filter(score => score.name !== '---' && score.score > 0);

        // Trier par score décroissant
        allScores.sort((a, b) => b.score - a.score);

        // Vider la liste existante
        allScoresList.innerHTML = '';

        if (allScores.length === 0) {
            allScoresList.innerHTML = '<div class="no-scores">Aucun score enregistré</div>';
            return;
        }

        // Créer l'en-tête
        const header = document.createElement('div');
        header.className = 'all-scores-header';
        header.innerHTML = `
            <div class="all-score-rank">RANG</div>
            <div class="all-score-name">JOUEUR</div>
            <div class="all-score-points">POINTS</div>
        `;
        allScoresList.appendChild(header);

        // Ajouter tous les scores
        allScores.forEach((score, index) => {
            const scoreItem = document.createElement('div');
            scoreItem.className = 'all-score-item';

            // Ajouter une classe spéciale pour les 3 premiers
            if (index < 3) {
                scoreItem.classList.add(`rank-${index + 1}`);
            }

            scoreItem.innerHTML = `
                <div class="all-score-rank">${index + 1}</div>
                <div class="all-score-name">${score.name}</div>
                <div class="all-score-points">${score.score}</div>
            `;

            allScoresList.appendChild(scoreItem);
        });
    }

    // Particules flottantes
    function startFloatingParticles() {
        const particlesContainer = document.querySelector('.floating-particles');

        function createParticle() {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '2px';
            particle.style.height = '2px';
            particle.style.backgroundColor = Math.random() > 0.5 ? '#00ff41' : '#00ffff';
            particle.style.borderRadius = '50%';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.bottom = '0px';
            particle.style.boxShadow = `0 0 4px ${particle.style.backgroundColor}`;

            const animationType = Math.floor(Math.random() * 3) + 1;
            const duration = 15 + Math.random() * 10; // 15-25 secondes
            particle.style.animation = `floatUp${animationType} ${duration}s linear`;

            particlesContainer.appendChild(particle);

            // Supprimer la particule après l'animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, duration * 1000);
        }

        // Créer une nouvelle particule toutes les 3-8 secondes
        function scheduleNextParticle() {
            const delay = 3000 + Math.random() * 5000;
            setTimeout(() => {
                createParticle();
                scheduleNextParticle();
            }, delay);
        }

        // Créer quelques particules initiales
        setTimeout(() => createParticle(), 2000);
        setTimeout(() => createParticle(), 5000);
        scheduleNextParticle();
    }

    // Animations des scores
    function startScoreAnimations() {
        function animateScoreDigits() {
            const scoreElements = document.querySelectorAll('.score');

            scoreElements.forEach((scoreEl, index) => {
                const scoreValue = scoreEl.textContent.replace(' PTS', '').trim();

                // Seulement animer les scores non-vides et non-zero
                if (scoreValue && scoreValue !== '0' && scoreValue !== '---') {
                    // Animation aléatoire avec faible probabilité
                    if (Math.random() < 0.1) { // 10% de chance par vérification
                        scoreEl.style.animation = 'scoreDigitFlicker 0.6s ease-in-out';
                        setTimeout(() => {
                            scoreEl.style.animation = '';
                        }, 600);
                    }
                }
            });
        }

        // Vérifier toutes les 8-15 secondes
        function scheduleNextScoreAnimation() {
            const delay = 8000 + Math.random() * 7000;
            setTimeout(() => {
                animateScoreDigits();
                scheduleNextScoreAnimation();
            }, delay);
        }

        scheduleNextScoreAnimation();
    }
});