

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjkizFWNr9e9xITLT0iSZBd6hUFY-5V6M",
  authDomain: "sih-student-portal.firebaseapp.com",
  projectId: "sih-student-portal",
  storageBucket: "sih-student-portal.firebasestorage.app",
  messagingSenderId: "801559553018",
  appId: "1:801559553018:web:45fe0c1b9acb561c9b3a43"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// --- System Configuration Core ---
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Form transaction management
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
        alert("Activity record submitted successfully!");
        document.getElementById('activityForm').reset();
    } catch (error) {
        console.error("Database Transaction Error: ", error);
    }
});

// Dynamic state streaming to tables
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
                    ` : '<span>Verified</span>'}
                </td>
            `;
            tableBody.appendChild(row);
        });
    });

// State status updates
window.changeState = async (id, targetStatus) => {
    try {
        await db.collection("activities").doc(id).update({ status: targetStatus });
    } catch (error) {
        console.error("State Mutation Error: ", error);
    }
};
