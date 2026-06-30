// 1. Direct CDN Module Imports
import { initializeApp } from "https://gstatic.com";
import { getDatabase, ref, push, set } from "https://gstatic.com";

// 2. Fixed Web App Configuration (Matches your exact dashboard screenshot)
const firebaseConfig = {
  apiKey: "AIzaSyAjkizFWNr9e9xITLT0iSZBd6hUFY-5V6M",
  authDomain: "://firebaseapp.com",
  projectId: "sih-student-portal",
  storageBucket: "sih-student-portal.firebasestorage.app",
  messagingSenderId: "801559553018",
  appId: "1:801559553018:web:45fe0c1b9acb561c9b3a43",
  databaseURL: "https://firebaseio.com"
};

// 3. Initialize Firebase Connectors
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 4. Test Verification Log (If you check your phone browser console, you'll see this)
console.log("Firebase system initialized successfully!");

// 5. Direct Event Binder
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("activityForm");
    const submitBtn = document.getElementById("submitBtn");

    if (!form) {
        alert("CRITICAL LAYOUT ERROR: The script cannot find an HTML element with id='activityForm'. Please check your index.html file structure.");
        return;
    }

    form.addEventListener("submit", async (e) => {
        // Core Protection: Stop browser default blank page reload behavior immediately
        e.preventDefault(); 

        // Update button visual feedback state
        submitBtn.disabled = true;
        submitBtn.innerText = "Saving Data...";

        // Extract and capture raw user string inputs safely
        const fullName = document.getElementById("fullName").value.trim();
        const regId = document.getElementById("regId").value.trim();
        const activityTrack = document.getElementById("activityTrack").value;
        const eventName = document.getElementById("eventName").value.trim();

        // Structure database row package
        const activityData = {
            fullName: fullName,
            regId: regId,
            activityTrack: activityTrack,
            eventName: eventName,
            status: "INITIATED",
            createdAt: new Date().toISOString()
        };

        try {
            // Push reference pointing directly to your live data tree node path
            const dbRef = ref(db, 'student_activities');
            const newRecordRef = push(dbRef);
            
            // Execute cloud upload sequence
            await set(newRecordRef, activityData);
            
            // Pop up immediate confirmation window alert panel
            alert("🎉 SUCCESS! Data saved to Firebase cloud backend!");
            form.reset();

        } catch (error) {
            console.error("Database connection failure context:", error);
            alert("⚠️ CLOUD BLOCK: Database rejected the data. Error: " + error.message);
        } finally {
            // Restore interactive components to default functionality states
            submitBtn.disabled = false;
            submitBtn.innerText = "Submit Activity";
        }
    });
});
