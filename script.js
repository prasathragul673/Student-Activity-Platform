// REPLACE WITH YOUR ACTUAL FIREBASE CONFIG FROM THE CONSOLE
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize app components
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Form listener to save inputs to the cloud database
document.getElementById('activityForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const payload = {
        studentName: document.getElementById('studentName').value,
        studentId: document.getElementById('studentId').value,
        category: document.getElementById('activityCategory').value,
        activityTitle: document.getElementById('activityTitle').value,
        status: "Pending",
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        await db.collection("activities").add(payload);
        alert("Activity record submitted!");
        document.getElementById('activityForm').reset();
    } catch (error) {
        console.error("Database Save Error: ", error);
    }
});

// Real-time synchronization pipeline for UI lists
db.collection("activities").orderBy("timestamp", "desc")
    .onSnapshot((snapshot) => {
        const tableBody = document.getElementById('adminTableBody');
        tableBody.innerHTML = ""; 

        snapshot.forEach((doc) => {
            const item = doc.data();
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${item.studentName}</td>
                <td>${item.studentId}</td>
                <td>${item.category}</td>
                <td>${item.activityTitle}</td>
                <td><span class="badge badge-${item.status}">${item.status}</span></td>
                <td>
                    ${item.status === 'Pending' ? `
                        <button class="btn action-btn btn-approve" onclick="changeState('${doc.id}', 'Approved')">Approve</button>
                        <button class="btn action-btn btn-reject" onclick="changeState('${doc.id}', 'Rejected')">Reject</button>
                    ` : '<span>Closed</span>'}
                </td>
            `;
            tableBody.appendChild(row);
        });
    });

// State manager for admin actions
window.changeState = async (id, targetStatus) => {
    try {
        await db.collection("activities").doc(id).update({ status: targetStatus });
    } catch (error) {
        console.error("Status Update Error: ", error);
    }
};
          
