// Import the Web SDK functions via gstatic CDN for direct HTML deployment
import { initializeApp } from "https://gstatic.com";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://gstatic.com";

// Your exact web app's Firebase configuration coordinates
const firebaseConfig = {
  apiKey: "AIzaSyAjkizFWNr9e9xITLT0iSZBd6hUFY-5V6M",
  authDomain: "sih-student-portal.firebaseapp.com",
  projectId: "sih-student-portal",
  storageBucket: "sih-student-portal.firebasestorage.app",
  messagingSenderId: "801559553018",
  appId: "1:801559553018:web:45fe0c1b9acb561c9b3a43"
};

// Initialize connection instance to Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get direct links to UI elements
const form = document.getElementById("activityForm");
const submitBtn = document.getElementById("submitBtn");

form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Lock browser page execution flow from page refresh

    // Block submission interaction to avoid duplicating entries during request latencies
    submitBtn.disabled = true;
    submitBtn.innerText = "Submitting Data...";

    // Safely collect input parameters
    const fullName = document.getElementById("fullName").value.trim();
    const regId = document.getElementById("regId").value.trim();
    const activityTrack = document.getElementById("activityTrack").value;
    const eventName = document.getElementById("eventName").value.trim();

    // Map fields directly to Jammu & Kashmir SIH specifications 
    const activityData = {
        fullName: fullName,
        regId: regId,
        activityTrack: activityTrack,
        eventName: eventName,
        status: "INITIATED", // Workflow tracker status key
        createdAt: serverTimestamp() // Cloud server server execution timestamp
    };

    try {
        // Send and record object inside your Cloud Firestore collection "student_activities"
        const docRef = await addDoc(collection(db, "student_activities"), activityData);
        
        console.log("Document logged safely in Firebase with Reference ID: ", docRef.id);
        alert("Success! Entry uploaded directly to Cloud Database. Current status: INITIATED");
        
        form.reset(); // Clear user visual components input text values
    } catch (error) {
        console.error("Firebase Execution Error detected: ", error);
        alert("Transaction Failed. Check Firestore Database security rules. System error: " + error.message);
    } finally {
        // Release operation block from interaction view components
        submitBtn.disabled = false;
        submitBtn.innerText = "Submit Activity";
    }
});
