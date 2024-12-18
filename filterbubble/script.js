const posts =
{
    tecnologia: [
        "Nuove funzionalità di iOS 17 rivelate!",
        "Il futuro dell'Intelligenza Artificiale",
        "Review: Gli ultimi smartphone del 2024",
        "Guida al Cloud Computing",
        "Le novità di ChatGPT",
        "Apple lancia un nuovo visore AR: rivoluzione nel mondo del metaverso",
        "L'intelligenza artificiale di OpenAI ora integrata nei principali motori di ricerca",
        "Rivoluzione delle batterie al grafene: smartphone con autonomia di una settimana"
    ],
    sport: [
        "Highlights della Serie A",
        "Il calciomercato si infiamma",
        "La Formula 1 introduce nuove regole",
        "Il tennis moderno: analisi tecnica",
        "Mondiali di nuoto: risultati",
        "Messi conquista il Pallone d'Oro 2024: il record continua",
        "Le Olimpiadi invernali: Italia vince l'oro nello sci alpino",
        "Formula 1: Verstappen domina anche l'ultimo GP della stagione"
    ],
    cucina: [
        "Ricette della tradizione italiana",
        "Cucina fusion: tendenze 2024",
        "I segreti della pasta fatta in casa",
        "Dolci vegani: ricette facili",
        "Pizza: la guida definitiva",
        "La pasta alla carbonara diventa patrimonio UNESCO",
        "Chef stellati reinventano il tiramisù: dessert in nuove forme",
        "La tendenza del 2024: cucina fusion italiana e asiatica"
    ],
    viaggi: [
        "Le meraviglie nascoste della Toscana",
        "Viaggiare in Giappone: guida completa",
        "Weekend nelle capitali europee",
        "Viaggi sostenibili: consigli pratici",
        "Le spiagge più belle del mediterraneo",
        "I 10 borghi italiani da visitare nel 2024",
        "Isole tropicali o città d'arte? Le destinazioni più prenotate per il Capodanno",
        "Treni panoramici in Europa: un modo lento per scoprire il continente"
    ]
};

let userPreferences = {
    tecnologia: 0,
    sport: 0,
    cucina: 0,
    viaggi: 0
};

let interactionCount = 0;
const INTERACTIONS_NEEDED = 5;

function initializeFeed()
{
    const feedContainer = document.getElementById('feedContainer');
    feedContainer.innerHTML = '';
    
    const allPosts = [];
    Object.keys(posts).forEach(topic => {
        posts[topic].forEach(post => {
            allPosts.push({ text: post, topic: topic });
        });
    });
    
    for (let i = allPosts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allPosts[i], allPosts[j]] = [allPosts[j], allPosts[i]];
    }
    
    allPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = post.text;
        postElement.dataset.topic = post.topic;
        postElement.onclick = () => handlePostClick(postElement);
        feedContainer.appendChild(postElement);
    });
}

function handlePostClick(postElement)
{
    if (postElement.classList.contains('disabled')) return;
    
    if (postElement.classList.contains('liked')) {
        postElement.classList.remove('liked');
        const topic = postElement.dataset.topic;
        userPreferences[topic]--;
        interactionCount--;
        
        if (interactionCount < INTERACTIONS_NEEDED) {
            enableAllPosts();
            document.getElementById('statusMessage').style.display = 'none';
        }
    } else if (interactionCount < INTERACTIONS_NEEDED) {
        postElement.classList.add('liked');
        const topic = postElement.dataset.topic;
        userPreferences[topic]++;
        interactionCount++;
        
        if (interactionCount >= INTERACTIONS_NEEDED) {
            disableUnlikedPosts();
            document.getElementById('statusMessage').style.display = 'block';
        }
    }

    document.getElementById('interactionCounter').textContent = interactionCount;
    updateProgressBar();

    if (interactionCount >= INTERACTIONS_NEEDED) {
        showPersonalizedFeed();
    } else {
        document.getElementById('bubbleExplanation').style.display = 'none';
    }
}

function disableUnlikedPosts()
{
    const posts = document.getElementsByClassName('post');
    for (let post of posts) {
        if (!post.classList.contains('liked')) {
            post.classList.add('disabled');
        }
    }
}

function enableAllPosts()
{
    const posts = document.getElementsByClassName('post');
    for (let post of posts) {
        post.classList.remove('disabled');
    }
}

function updateProgressBar()
{
    const progress = Math.min((interactionCount / INTERACTIONS_NEEDED) * 100, 100);
    document.querySelector('.progress-bar').style.width = `${progress}%`;
}

function showPersonalizedFeed()
{
    const explanation = document.getElementById('bubbleExplanation');
    explanation.style.display = 'block';
    
    const statsDiv = document.getElementById('preferenceStats');
    statsDiv.innerHTML = Object.entries(userPreferences)
        .map(([topic, count]) => `<p>${topic}: ${count} interazioni</p>`)
        .join('');
    
    const feedContainer = document.getElementById('feedContainer');
    const posts = Array.from(feedContainer.getElementsByClassName('post'));
    
    posts.forEach(post => {
        const topic = post.dataset.topic;
        if (userPreferences[topic] === 0) {
            post.classList.add('hidden');
        }
    });
    
    posts
        .filter(post => !post.classList.contains('hidden'))
        .sort((a, b) => {
            const topicA = a.dataset.topic;
            const topicB = b.dataset.topic;
            return userPreferences[topicB] - userPreferences[topicA];
        })
        .forEach(post => feedContainer.appendChild(post));
}

function resetExperiment() {
    userPreferences = {
        tecnologia: 0,
        sport: 0,
        cucina: 0,
        viaggi: 0
    };
    interactionCount = 0;
    document.querySelector('.progress-bar').style.width = '0%';
    document.getElementById('bubbleExplanation').style.display = 'none';
    document.getElementById('interactionCounter').textContent = '0';
    document.getElementById('statusMessage').style.display = 'none';
    
    initializeFeed();
}

document.addEventListener('DOMContentLoaded', initializeFeed);