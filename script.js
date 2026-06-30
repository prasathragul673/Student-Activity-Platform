// Import the Realtime Database SDK via gstatic CDN modules
import { initializeApp } from "https://gstatic.com";
import { getDatabase, ref, push, set } from "https://gstatic.com";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjkizFWNr9e9xITLT0iSZBd6hUFY-5V6M",
  authDomain: "://firebaseapp.com",
  projectId: "sih-student-portal",
  storageBucket: "sih-student-portal.firebasestorage.app",
  messagingSenderId: "801559553018",
  appId: "1:801559553018:web:45fe0c1b9acb561c9b3a43"
};

// Initialize Firebase App and link Realtime Database
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Target UI form elements
const form = document.getElementById("activityForm");
const submitBtn = document.getElementById("submitBtn");

form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Stop page from reloading

    // Disable button to prevent multi-click database spamming
    submitBtn.disabled = true;
    submitBtn.innerText = "Submitting Data...";

    // Extract values safely
    const fullName = document.getElementById("fullName").value.trim();
    const regId = document.getElementById("regId").value.trim();
    const activityTrack = document.getElementById("activityTrack").value;
    const eventName = document.getElementById("eventName").value.trim();

    // Data packet format matching SIH requirements
    const activityData = {
        fullName: fullName,
        regId: regId,
        activityTrack: activityTrack,
        eventName: eventName,
        status: "INITIATED",
        createdAt: new Date().toISOString()
    };

    try {
        // Create a unique new location reference inside the "student_activities" node
        const activityListRef = ref(db, 'student_activities');
        const newActivityRef = push(activityListRef);
        
        // Write data package to cloud reference node path
        await set(newActivityRef, activityData);
        
        alert("Success! Entry uploaded directly to Realtime Database. Status: INITIATED");
        form.reset(); // Wipe UI field text inputs
    } catch (error) {
        console.error("Database Save Error:", error);
        alert("Transaction Failed. Check database rules. Error: " + error.message);
    } finally {
        // Restore element view states
        submitBtn.disabled = false;
        submitBtn.innerText = "Submit Activity";
    }
});
      
