import { online_voting } from "../../declarations/online_voting";

const routes = {
    '#/': 'index.html',
    '#/registeration': 'registration.html',
    '#/login': 'login.html',
    '#/result': 'result.html',
    '#/vote': 'vote.html',
    '#/admin': 'admin.html',
    '#/dashboard': 'dashboard.html',
    '#/admindashboard': 'admindashboard.html',
    }

    function router() {
        const path = window.location.hash || '#/';
        const route = routes[path] || routes['#/'];
        loadPage(route);
      }
      
      window.addEventListener('hashchange', router);
      window.addEventListener('load', router);

      async function loadPage(url) {
        const mainContainer = document.getElementById('main-container');
        if (!mainContainer) {
          console.error('Main container not found');
          return;
        }
      
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const content = await response.text();
          
          mainContainer.innerHTML = content;
          
          // Run page-specific scripts
          if (url.endsWith('vote.html')) {
            setupVotingFunctionality();
          } else if (url.endsWith('results.html')) {
            loadResults();
          }
        } catch (error) {
          console.error('Error loading page:', error);
          mainContainer.innerHTML = '<p>Error loading page. Please try again.</p>';
        }
      }
      
 const canisterId = 'rrkah-fqaaa-aaaaa-aaaaq-cai'; // Replace with your actual canister ID
  const host = 'https://ic0.app';

 const agent = new window.ic.HttpAgent({ host });
 const actor = window.ic.Actor.createActor(idlFactory, { agent, canisterId });

const addCandidate = document.getElementById('addCandidate');
addCandidate.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('candidateName').value;
    const id = document.getElementById('addCandidate').value;
    if (name) {
       try {
          const result = await online_voting.addCandidate(name);
        if ('ok' in result) {
           alert('Candidate added successfully!');
           nameInput.value = '';
          } else {
            alert('Error: ' + result.err);
       }
       } catch (error) {
         console.error('Error adding candidate:', error);
         alert('An error occurred while adding the candidate.');
       }
     } else {
        alert('Please enter a candidate name.');
      }
    }
     );
  
// document.addEventListener('DOMContentLoaded', async () => {
//     // Setup your UI and event listeners here 
//     AddCandidate();
//   });
  
//   document.querySelector("form").addEventListener("submit", async function (event) {
//     event.preventDefault();
  
// //   function setupAddCandidateButton() {
//     const addButton = document.getElementById('addCandidate');
//     const nameInput = document.getElementById('candidateName');
  
//     addButton.onclick = async () => {
//       const name = nameInput.value.trim();
//       if (name) {
//         try {
//           const result = await online_voting.addCandidate(name);
//           if ('ok' in result) {
//             alert('Candidate added successfully!');
//             nameInput.value = '';
//           } else {
//             alert('Error: ' + result.err);
//           }
//         } catch (error) {
//           console.error('Error adding candidate:', error);
//           alert('An error occurred while adding the candidate.');
//         }
//       } else {
//         alert('Please enter a candidate name.');
//       }
//     }
//     });
  
// async function addCandidate() {
//     const name = document.getElementById('addCandidate').value;
//     try {
//         const result = await actor.addCandidate(name);
//         if (result.ok) {
//             alert('Candidate added successfully');
//             getCandidates();
//         } else {
//             alert('Error: ' + result.err);
//         }
//     } catch (error) {
//         console.error('Error adding candidate:', error);
//     }
// }

async function vote() {
    const select = document.getElementById('candidateSelect');
    const name = select.options[select.selectedIndex].value;
    try {
        const result = await actor.vote(name);
        if (result.ok) {
            alert('Vote cast successfully');
            getResults();
        } else {
            alert('Error: ' + result.err);
        }
    } catch (error) {
        console.error('Error voting:', error);
    }
}

async function getResults() {
    try {
        const results = await actor.getResults();
        const resultsList = document.getElementById('resultsList');
        resultsList.innerHTML = results.map(([name, votes]) => `${name}: ${votes} votes`).join('<br>');
    } catch (error) {
        console.error('Error getting results:', error);
    }
}

async function getCandidates() {
    try {
        const candidates = await actor.getCandidates();
        const candidatesList = document.getElementById('candidatesList');
        candidatesList.innerHTML = candidates.join('<br>');
        
        const select = document.getElementById('candidateSelect');
        select.innerHTML = candidates.map(name => `<option value="${name}">${name}</option>`).join('');
    } catch (error) {
        console.error('Error getting candidates:', error);
    }
}

async function resetSystem() {
    if (confirm('Are you sure you want to reset the system? This will delete all candidates and votes.')) {
        try {
            const result = await actor.reset();
            if (result.ok) {
                alert('System reset successfully');
                getCandidates();
                getResults();
            } else {
                alert('Error: ' + result.err);
            }
        } catch (error) {
            console.error('Error resetting system:', error);
        }
    }
}

// Initialize the page
getCandidates();
getResults();