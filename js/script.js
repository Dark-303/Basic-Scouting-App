// Import and configure Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCxc0XQOsbOzvYRRIss3gid23szbAl6eTE",
    authDomain: "basic-scouting-app.firebaseapp.com",
    projectId: "basic-scouting-app",
    storageBucket: "basic-scouting-app.appspot.com",
    messagingSenderId: "1014517616917",
    appId: "1:1014517616917:web:c44b99c7b91ed6648e991c",
    measurementId: "G-34Z8LNRBG6"
}

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener('DOMContentLoaded', function() {
    const showFormBtn = document.getElementById('show-form-btn');
    const viewResultsBtn = document.getElementById('view-results-btn');
    const dataEntrySection = document.getElementById('data-entry');
    const resultsSection = document.getElementById('results');
    const form = document.getElementById('scouting-form');
    const resultsContainer = document.getElementById('results-container');
    
    showFormBtn.addEventListener('click', function() {
        dataEntrySection.style.display = 'block';
        resultsSection.style.display = 'none';
    });

    viewResultsBtn.addEventListener('click', function() {
        dataEntrySection.style.display = 'none';
        resultsSection.style.display = 'block';
        displayResults();
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const teamName = document.getElementById('team-name').value;
        const robotCapabilities = document.getElementById('robot-capabilities').value;
        
        const newEntryRef = ref(db, 'entries/' + Date.now());
        set(newEntryRef, {
            teamName,
            robotCapabilities
        })
        .then(() => {
            alert('Data submitted successfully!');
            form.reset();
        })
        .catch((error) => {
            console.error('Error submitting data:', error);
        });
    });

    function displayResults() {
        const entriesRef = ref(db, 'entries');
        onValue(entriesRef, (snapshot) => {
            resultsContainer.innerHTML = '';
            const data = snapshot.val();
            if (!data) {
                resultsContainer.innerHTML = '<p>No data available</p>';
                return;
            }
            Object.keys(data).forEach(key => {
                const entry = data[key];
                const entryDiv = document.createElement('div');
                entryDiv.innerHTML = `<p>Team: ${entry.teamName}, Capabilities: ${entry.robotCapabilities}</p>`;
                resultsContainer.appendChild(entryDiv);
            });
        });
    }
});
