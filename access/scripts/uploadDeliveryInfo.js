document.addEventListener("DOMContentLoaded", function() {
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();
  
    function generateCourierId() {
        const randomNumber = Math.floor(Math.random() * 900000) + 100000;
        return `C${randomNumber}`;
    }
    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    }
  
    const userUID = getCookie('userUID'); // Get the user's UID from the cookie
  
    // Check if userUID exists
    if (!userUID) {
      alert("User not authenticated. Please log in.");
      window.location.href = './auth/'; // Redirect to login if no UID is found
      return;
    }
  
    const form = document.getElementById('deliveryForm');
  
    if (form) {
      form.addEventListener('submit', function(event) {
        event.preventDefault();
  
        const courierId = generateCourierId();
        const deliveryPersonName = document.getElementById('deliveryPerson').value;
        const recipientName = document.getElementById('recipientName').value;
        const recipientAddress = document.getElementById('recipientAddress').value;
        const recipientPhone = document.getElementById('recipientPhone').value;
  
        const deliveryData = {
          Company: "ABC Company",
          createdAt: new Date().toISOString(),
          courierId: courierId,
          deliveryPersonName: deliveryPersonName,
          recipientName: recipientName,
          recipientAddress: recipientAddress,
          recipientPhone: recipientPhone,
          updatedAt: new Date().toISOString() || "-",
          Delivery_Date: "-",
        };
  
        // Save data under the userUID
        const userDeliveryRef = database.ref(`users/${userUID}/deliveryInformation/${courierId}`);
  
        userDeliveryRef.set(deliveryData)
          .then(() => {
            alert('Delivery Information Saved Successfully');
            form.reset();
          })
          .catch((error) => {
            alert('Error saving delivery information: ' + error.message);
          });
      });
    } else {
      console.error('Form not found');
    }
  });
  