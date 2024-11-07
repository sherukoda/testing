// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDzVZ52Y1XL_Gw9PlQxQFhGBXOcWitm7gQ",
    authDomain: "courierservicedb.firebaseapp.com",
    databaseURL: "https://courierservicedb-default-rtdb.firebaseio.com",
    projectId: "courierservicedb",
    storageBucket: "courierservicedb.appspot.com",
    messagingSenderId: "361882622021",
    appId: "1:361882622021:web:209f03670c2b39392a6b2c",
    measurementId: "G-N35XF5XX0N",
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();

// Function to fetch and display drop-off data
async function fetchDropOffData() {
    try {
        const snapshot = await database.ref(`users/${userUID}/dropOffs`).once("value");
        const dropOffListDiv = document.querySelector(".dropOffList");

        if (snapshot.exists()) {
            const dropOffs = snapshot.val();
            let tableHtml = `
                <h2>Drop Off List</h2>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Courier ID</th>
                           
                            <th>Recipient Name</th>
                            <th>Recipient Address</th>
                            <th>Recipient Phone</th>
                           
                            <th>Status</th>
                            <th>More Details</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>`;

            let count = 1;
            for (const dropOffId in dropOffs) {
                const dropOff = dropOffs[dropOffId];
                tableHtml += `
                    <tr>
                        <td>${count++}</td>
                        <td>${dropOff.courierId}</td>
                       
                        <td>${dropOff.recipientName}</td>
                        <td>${dropOff.recipientAddress}</td>
                        <td>${dropOff.recipientPhone}</td>

                        <td class="${dropOff.status || "pending"}">${dropOff.status || "Pending"}</td>
                        <td><button onclick="showDetails('${dropOffId}')">Details</button></td>
                        <td>
                            <button onclick="openEditModal('${dropOffId}')">Edit</button>
                            <button style="background:#E32636; color:#fff" onclick="deleteColumn('${dropOffId}')"><i class="fa fa-trash"></i></button>
                        </td>
                    </tr>
                `;
            }

            tableHtml += `</tbody></table>`;
            dropOffListDiv.innerHTML = tableHtml;
        } else {
            dropOffListDiv.innerHTML = "<p>No drop-off information available.</p>";
        }
    } catch (error) {
        console.error("Error fetching drop-off data:", error);
    }
}

// Function to show details in a modal
window.showDetails = async function(dropOffId) {
    try {
        const snapshot = await database.ref(`users/${userUID}/dropOffs/${dropOffId}`).once("value");
        const dropOff = snapshot.val();

        document.getElementById("detailsCourierId").innerText = dropOff.courierId;

        document.getElementById("detailsRecipientName").innerText = dropOff.recipientName;
        document.getElementById("detailsRecipientPhone").innerText = dropOff.recipientPhone;
        document.getElementById("detailsRecipientAddress").innerText = dropOff.recipientAddress;
        
        document.getElementById("detailsStatus").innerText = dropOff.status || "Pending";
        document.getElementById("detailsCreatedAt").innerText = dropOff.CreatedAt || "N/A";
        document.getElementById("detailsUpdatedAt").innerText = dropOff.updatedAt || "N/A";

        document.getElementById("detailsModal").style.display = "block"; // Show the modal
    } catch (error) {
        console.error("Error showing details:", error);
    }
};



function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

const userUID = getCookie('userUID');

// Function to open the edit modal and populate fields
window.openEditModal = async function(dropOffId) {
    try {
        const snapshot = await database.ref(`users/${userUID}/dropOffs/${dropOffId}`).once("value");
        const dropOff = snapshot.val();

        document.getElementById("editCourierId").value = dropOff.courierId;

        document.getElementById("editRecipientName").value = dropOff.recipientName;
        document.getElementById("editRecipientPhone").value = dropOff.recipientPhone;
        document.getElementById("editRecipientAddress").value = dropOff.recipientAddress;

        document.getElementById("editStatus").value = dropOff.status || "Pending";

        document.getElementById("editModal").style.display = "block"; // Show the edit modal
    } catch (error) {
        console.error("Error opening edit modal:", error);
    }
};

// Function to save the edited delivery information
window.saveNewDeliveryInfo = async function(event) {
    event.preventDefault(); // Prevents page reload

    const dropOffId = document.getElementById("editCourierId").value;
    const status = document.getElementById("editStatus").value;
    const deliveryDate = status === "Completed" ? new Date().toISOString().split('T')[0] : "-";

    const updatedData = {
    
        recipientName: document.getElementById("editRecipientName").value.trim(),
        recipientPhone: document.getElementById("editRecipientPhone").value.trim(),
        recipientAddress: document.getElementById("editRecipientAddress").value.trim(),
      
        status: status,
        updatedAt: new Date().toISOString(),
        deliveryDate: deliveryDate,
    };

    try {
        
        await database.ref(`users/${userUID}/dropOffs/${dropOffId}`).update(updatedData);
        alert("Drop-off information updated successfully!");
        document.getElementById("editModal").style.display = "none"; // Hide the modal
        fetchDropOffData(); // Refresh data
    } catch (error) {
        console.error("Error updating drop-off information:", error);
        alert("Failed to update drop-off information.");
    }
};


// Function to delete a drop-off entry
window.deleteColumn = async function(dropOffId) {
    const confirmation = confirm("Are you sure you want to delete this drop-off entry?");
    if (confirmation) {
        try {
            await database.ref(`dropOffs/${dropOffId}`).remove();
            alert("Drop-off information deleted successfully!");
            fetchDropOffData(); // Refresh the data after deletion
        } catch (error) {
            console.error("Error deleting drop-off information:", error);
            alert("Failed to delete drop-off information.");
        }
    }
};

// Function to close modals
window.closeModal = function(modalId) {
    document.getElementById(modalId).style.display = "none";
};

// Call the function to fetch drop-off data on page load
window.onload = fetchDropOffData;
