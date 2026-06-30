// Import the Realtime Database SDK via gstatic CDN modules
import { initializeApp } from "https://gstatic.com";
import { getDatabase, ref, push, set } from "https://gstatic.com";

// Your web app's Firebase configuration coordinates
const firebaseConfig = {
  apiKey: "AIzaSyAjkizFWNr9e9xITLT0iSZBd6hUFY-5V6M",
  authDomain: "://firebaseapp.com",
  projectId: "sih-student-portal",
  storageBucket: "sih-student-portal.firebasestorage.app",
  messagingSenderId: "801559553018",
  appId: "1:801559553018:web:45fe0c1b9acb561c9b3a43"
  databaseURL: "https://firebasedatabase.app"
};

// Initialize Firebase App and link Realtime Database
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Target UI form elements
const form = document.getElementById("activityForm");
const submitBtn = document.getElementById("submitBtn");

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // STOP the page from crashing, clearing, or reloading

        // Disable button to prevent multi-click database spamming
        submitBtn.disabled = true;
        submitBtn.innerText = "Submitting Data...";

        // Extract values safely from your HTML fields
        const fullName = document.getElementById("fullName").value.trim();
        const regId = document.getElementById("regId").value.trim();
        const activityTrack = document.getElementById("activityTrack").value;
        const eventName = document.getElementById("eventName").value.trim();

        // Data packet format matching SIH tracking requirements
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
            form.reset(); // Safely clear out the text boxes only AFTER saving works
        } catch (error) {
            console.error("Database Save Error:", error);
            alert("Transaction Failed. Error: " + error.message);
        } finally {
            // Restore button to its normal state
            submitBtn.disabled = false;
            submitBtn.innerText = "Submit Activity";
        }
    });
} else {
    console.error("Could not find form element with id='activityForm'");
}
