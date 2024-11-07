const firebaseConfig = {
    apiKey: "AIzaSyDzVZ52Y1XL_Gw9PlQxQFhGBXOcWitm7gQ",
    authDomain: "courierservicedb.firebaseapp.com",
    databaseURL: "https://courierservicedb-default-rtdb.firebaseio.com",
    projectId: "courierservicedb",
    storageBucket: "courierservicedb.appspot.com",
    messagingSenderId: "361882622021",
    appId: "1:361882622021:web:209f03670c2b39392a6b2c",
    measurementId: "G-N35XF5XX0N"
  };
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();



function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

// Function to handle profile updates and save them to Firebase
function saveProfileChanges(event) {
    event.preventDefault(); // Prevent form submission and page reload

    // Get updated profile data from the form
    const updatedName = document.getElementById("editName").value;
    const updatedEmail = document.getElementById("editEmail").value;
    const updatedPhone = document.getElementById("editPhone").value;
    const updatedImage = document.getElementById("editImage").value;

    // Update the profile page with the new data
    document.getElementById("userName").innerText = updatedName;
    document.getElementById("userEmail").innerText = updatedEmail;
    document.getElementById("userPhone").innerText = updatedPhone;


    // Store the updated profile in Firebase Firestore
    const userProfile = {
        email: updatedEmail,
    };

    // Assuming you have a user ID to uniquely identify the profile (e.g., userUID)
    const userUID =getCookie('userUID');

    // Save the profile data to Firestore
    db.collection("users").doc(userUID).set(userProfile)
        .then(() => {
            console.log("Profile updated successfully in Firestore!");
        })
        .catch((error) => {
            console.error("Error updating profile in Firestore: ", error);
        });

    // Close the modal
    closeModal();
}



window.onload = function() {

    console.log(userUID);

    // Fetch the user's data from Firestore
    db.collection("users").doc(userUID).get()
        .then((doc) => {
            if (doc.exists) {
                const userProfile = doc.data();
                document.getElementById("userUID").innerText = getCookie('userUID');
                document.getElementById("userName").innerText = userProfile.name;
                document.getElementById("userEmail").innerText = userProfile.email;
                document.getElementById("userPhone").innerText = userProfile.phone;
                document.getElementById("profileImage").src = userProfile.profileImage || "default-avatar.jpg";
            } else {
                console.log("No user found with the given UID.");
            }
        })
        .catch((error) => {
            console.error("Error getting user data: ", error);
        });
};
