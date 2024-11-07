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

firebase.initializeApp(firebaseConfig);
const database = firebase.database();



function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}


const userUID = getCookie('userUID'); // Ensure userUID is set correctly

// Fetch Delivery Data
async function fetchDeliveryData() {
  try {
    const userDeliveryRef = database.ref(`users/${userUID}/deliveryInformation`);
    const snapshot = await userDeliveryRef.once("value");
    const deliveries = snapshot.val();

    if (deliveries) {
      populateDeliveryTable(deliveries);
    } else {
      console.log("No deliveries found.");
    }
  } catch (error) {
    console.error("Error fetching delivery data:", error);
  }
}

// Populate the Delivery Table
function populateDeliveryTable(deliveries) {
  const tableBody = document.getElementById("deliveryTableBody");
  tableBody.innerHTML = "";

  Object.keys(deliveries).forEach((key, index) => {
    const delivery = deliveries[key];
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${delivery.courierId}</td>
      <td>${delivery.recipientName}</td>
      <td>${delivery.recipientPhone}</td>
      <td>${delivery.recipientAddress}</td>
      <td>${delivery.deliveryPersonName}</td>
      <td class="${delivery.status || "pending"}">${delivery.status || "Pending"}</td>
      <td><button class="moreBtn" onclick="showDetails('${key}')">More Details</button></td>
      <td>
        <button class="editBtn" onclick="editDelivery('${key}')">Edit</button>
        <button style="background:#E32636; color:#fff" onclick="deleteColumn('${key}')"><i class="fa fa-trash"></i></button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Show Delivery Details
function showDetails(deliveryId) {
  const deliveryRef = database.ref(`users/${userUID}/deliveryInformation`).child(deliveryId);
  deliveryRef.once("value", (snapshot) => {
    const delivery = snapshot.val();
    if (delivery) {
      document.getElementById("detailsCourierId").textContent = delivery.courierId;
      document.getElementById("detailsRecipientName").textContent = delivery.recipientName;
      document.getElementById("detailsRecipientPhone").textContent = delivery.recipientPhone;
      document.getElementById("detailsRecipientAddress").textContent = delivery.recipientAddress;
      document.getElementById("detailsStatus").textContent = delivery.status || "Pending";
      document.getElementById("detailsCreatedAt").textContent = new Date(delivery.createdAt).toLocaleString();
      document.getElementById("detailsUpdatedAt").textContent = new Date(delivery.updatedAt).toLocaleString();
      document.getElementById("detailsModal").style.display = "block";
    }
  });
}

// Edit Delivery Information
function editDelivery(deliveryId) {
  const deliveryRef = database.ref(`users/${userUID}/deliveryInformation`).child(deliveryId);
  deliveryRef.once("value", (snapshot) => {
    const delivery = snapshot.val();
    if (delivery) {
      document.getElementById("editCourierId").value = delivery.courierId;
      document.getElementById("editRecipientName").value = delivery.recipientName;
      document.getElementById("editRecipientPhone").value = delivery.recipientPhone;
      document.getElementById("editRecipientAddress").value = delivery.recipientAddress;
      document.getElementById("editStatus").value = delivery.status || "Pending";
      document.getElementById("editRowIndex").value = deliveryId;
      document.getElementById("editModal").style.display = "block";
    }
  });
}

// Save Updated Delivery Info
function saveNewDeliveryInfo(event) {
  event.preventDefault();
  const courierId = document.getElementById("editCourierId").value;
  const recipientName = document.getElementById("editRecipientName").value;
  const recipientPhone = document.getElementById("editRecipientPhone").value;
  const recipientAddress = document.getElementById("editRecipientAddress").value;
  const status = document.getElementById("editStatus").value;
  const updatedAt = new Date().toUTCString();
  let Delivery_Date = "";

  if (status == "Delivered") {
    Delivery_Date = new Date().toUTCString();
  }

  const deliveryData = {
    courierId,
    recipientName,
    recipientPhone,
    recipientAddress,
    status,
    updatedAt,
    Delivery_Date,
  };

  const userDeliveryRef = database.ref(`users/${userUID}/deliveryInformation/${courierId}`);
  userDeliveryRef.set(deliveryData)
    .then(() => {
      alert("Delivery Information Saved Successfully");
      document.getElementById("editForm").reset();
      closeModal("editModal");
      fetchDeliveryData();
    })
    .catch((error) => {
      alert("Error saving delivery information: " + error.message);
    });
}

// Delete Delivery Data
window.deleteColumn = async function (deliveryId) {
  const confirmation = confirm("Are you sure you want to delete this drop-off entry?");
  if (confirmation) {
    try {
      await database.ref(`users/${userUID}/deliveryInformation/${deliveryId}`).remove();
      alert("Delivery information deleted successfully!");
      fetchDeliveryData(); // Refresh the data after deletion
    } catch (error) {
      console.error("Error deleting delivery information:", error);
      alert("Failed to delete delivery information.");
    }
  }
};

// Close Modals
function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

// Event listener for DOM content loaded
document.addEventListener("DOMContentLoaded", fetchDeliveryData);

// Handle click events to close modals
window.onclick = function (event) {
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
};

