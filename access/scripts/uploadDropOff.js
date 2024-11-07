// Function to generate a unique Courier ID
function generateCourierId() {
    const randomNumber = Math.floor(Math.random() * 900000) + 100000;
    return `C${randomNumber}`;
}


function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

// Initialize Firebase only once
let databaseInitialized = false;
function initializeFirebase() {
    if (!databaseInitialized) {
        firebase.initializeApp(firebaseConfig); // Use your Firebase configuration
        databaseInitialized = true;
    }
}

// Clear alert messages
function clearAlerts() {
    document.getElementById("alertNameExist").textContent = "";
    document.getElementById("alertPhoneExist").textContent = "";
}

// Handle form submission
document.getElementById("dropOffForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    initializeFirebase(); // Ensure Firebase is initialized

    // Get form values
    const recipientName = document.getElementById("recipientName").value;
    const recipientAddress = document.getElementById("recipientAddress").value;
    const recipientPhone = document.getElementById("recipientPhone").value;
    const currentDate = new Date().toISOString().split('T')[0];

    // Generate a unique Courier ID
    const courierId = generateCourierId();
    
    // Assuming userUID is set (e.g., from authentication)
    const userUID = getCookie('userUID');  // Fetch from cookie or other storage

    // Create a drop-off object
    const dropOffData = {
        Company: "CompanyName",
        courierId: courierId,
        receivingDate: currentDate,
        recipientAddress: recipientAddress,
        recipientName: recipientName,
        recipientPhone: recipientPhone,
        CreatedAt: currentDate,
    };

    // Push the drop-off data to the database under the user's delivery information
    try {
        await firebase.database().ref(`users/${userUID}/dropOffs/${courierId}`).set(dropOffData);
        alert("Drop-off information submitted successfully!");
        document.getElementById("dropOffForm").reset(); // Reset the form
    } catch (error) {
        console.error("Error submitting drop-off information:", error);
        alert("Error submitting drop-off information. Please try again.");
    }
});

// Check if sender exists
async function checkSenderExistence() {
    initializeFirebase();

    const senderName = document.getElementById("senderName").value.trim();
    const senderPhone = document.getElementById("senderPhone").value.trim();
    
    if (!senderName && !senderPhone) {
        clearAlerts();
        return;
    }

    try {
        const snapshot = await firebase.database().ref('dropOffs').once('value');
        let nameExists = false;
        let phoneExists = false;
        let messages = "";
        let messagesPhone = "";

        snapshot.forEach(childSnapshot => {
            const data = childSnapshot.val();
            if (senderName && data.senderName.toLowerCase() === senderName.toLowerCase()) {
                nameExists = true;
                messages = data.senderName + " has already used " + data.Company + "!! Need to fill the Feedback.";
                document.getElementById('feedbackForm').style.display = "block";
            }
            if (senderPhone && data.senderPhone === senderPhone) {
                phoneExists = true;

                messagesPhone = data.senderPhone + " has already used " + data.Company + "!! Need to fill the Feedback.";
                document.getElementById('feedbackForm').style.display = "block";
            }
        });

        document.getElementById("alertNameExist").textContent = 
            nameExists ? messages : "";
        document.getElementById("alertPhoneExist").textContent = 
            phoneExists ? messagesPhone : "";

    } catch (error) {
        console.error("Error checking sender existence:", error);
        alert("An error occurred while checking sender information. Please try again.");
    }
}
