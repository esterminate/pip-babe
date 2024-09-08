document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('nav a');
    const menuClickSound = new Audio('assets/audio/menu-click.mp3'); 
    const itemClickSound = new Audio('assets/audio/menu-click.mp3'); 
    const introVideo = document.getElementById('intro-video');
    const pipboyContent = document.getElementById('pipboy-content');
    const introVideoPlayer = document.getElementById('intro-video-player');
    const introAudio = new Audio('assets/intro-audio.mp3'); 
    const missionAudio = new Audio('assets/audio/start-mission.mp3'); 
    const correctFrequency = '250.9 FM'; 

    const itemData = {
        'party': { sprite: 'assets/img/party-boy.png', audio: 'assets/audio/party-horn.mp3', description: 'Se Moira non va alla festa, la festa va da Moira<br><br>Numero minimo di partecipanti: 2' },
        'denario': { sprite: 'assets/img/caesar-boy.webp', audio: 'assets/audio/ave-caesar.mp3', description: '<i>Caesar Dictator</i><br><br>Tasso di cambio: 5 tappi' },
        'fischietto': { sprite: 'assets/img/whistle-boy.png', audio: 'assets/audio/coo.mp3', description: 'Usalo per richiamare volatili e all’occorrente vacche<br><br>Utilizzi: 0/∞' },
        'chappell': { sprite: 'assets/img/singer-boy.png', audio: 'assets/audio/great-set-piper.mp3', description: 'Vedo che hai già usato il fischietto<br><br>=^CORRUPTEDDATA?#@[' }
    };

    function showSection(id) {
        sections.forEach(section => {
            if (section.id === id) {
                section.classList.remove('fade-out', 'flicker');
                section.classList.add('fade-in');
                section.style.display = 'block';
                section.classList.add('active');
            } else {
                section.classList.remove('fade-in');
                section.classList.add('fade-out', 'flicker');
                setTimeout(() => {
                    section.style.display = 'none';
                    section.classList.remove('active');
                }, 500); 
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.id === `${id}-link`) {
                link.classList.add('active');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.id.replace('-link', '');
            showSection(targetId);
            menuClickSound.play(); 
        });
    });

    window.addItem = function() {
        const itemInput = document.getElementById('item-input');
        const itemList = document.getElementById('item-list');
        const itemName = itemInput.value.trim().toLowerCase();
        const itemErrorMessage = document.getElementById('item-error-message');

        itemErrorMessage.style.display = 'none'; 

        if (itemName in itemData) {
            const listItem = document.createElement('li');
            listItem.textContent = itemName.charAt(0).toUpperCase() + itemName.slice(1);

            const audio = new Audio(itemData[itemName].audio);

            listItem.addEventListener('click', function() {
                const itemDetails = document.getElementById('item-details');
                const itemSprite = document.getElementById('item-sprite');
                const itemDescription = document.getElementById('item-description');

                const allItems = itemList.querySelectorAll('li');
                allItems.forEach(item => item.classList.remove('selected'));

                listItem.classList.add('selected');

                itemSprite.src = itemData[itemName].sprite;
                itemDescription.innerHTML = itemData[itemName].description;
                itemDetails.style.display = 'block';
                document.querySelector('.item-description-container').style.display = 'block';
                itemSprite.style.display = 'block';

                itemClickSound.play(); 
            });

            itemList.appendChild(listItem);
            itemInput.value = ''; 
            audio.play(); 
        } else {
            itemErrorMessage.textContent = 'Invalid object name';
            itemErrorMessage.style.display = 'block'; 
        }
    };

    document.getElementById('item-input').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); 
            addItem();
        }
    });

    function setFrequency() {
        const frequencyInput = document.getElementById('frequency');
        const frequency = frequencyInput.value.trim();
        const errorMessage = document.getElementById('error-message');
        const videoContainer = document.getElementById('video-container');
        const waveVideo = document.getElementById('wave-video');
        const questCompleteSound = new Audio('assets/audio/quest-complete.mp3'); 
        const questFailureSound = new Audio('assets/audio/quest-failure.mp3'); 

        if (frequency === correctFrequency) {
            videoContainer.style.display = 'block';
            waveVideo.style.display = 'block';
            errorMessage.style.display = 'none'; 
            questCompleteSound.play(); 
           
            questCompleteSound.onended = function() {
                waveVideo.play();
            };
            
        } else {
            errorMessage.style.display = 'block'; 
            videoContainer.style.display = 'none'; 
            waveVideo.style.display = 'none'; 
            questFailureSound.play(); 
        }
    }

    document.querySelector('button[onclick="setFrequency()"]').addEventListener('click', setFrequency);

    document.getElementById('frequency').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); 
            setFrequency();
        }
    });

    window.activateQuest = function(id) {
        const questItem = document.getElementById(id);
        const questDescription = document.getElementById('quest-description');
        
        missionAudio.play(); 
        
        questDescription.style.display = 'block';
        document.getElementById('main-text').innerHTML = `
            Hai captato una trasmissione misteriosa, sintonizzati sulla frequenza corretta per scoprire di cosa si tratta<br><br>
        `; 
        
        document.getElementById('additional-text').style.display = 'block';
        
        questItem.style.backgroundColor = '#00ff00'; 
        questItem.style.color = '#1c1c1c'; 
    };

    introVideoPlayer.addEventListener('canplay', () => {
        introAudio.play(); 
    });

    introVideoPlayer.addEventListener('ended', () => {
        introAudio.pause(); 
        introAudio.currentTime = 0; 
        introVideo.style.display = 'none'; 
        pipboyContent.style.display = 'flex'; 
        showSection('quests'); 
    });

    pipboyContent.style.display = 'none';
});
