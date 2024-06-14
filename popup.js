// Create a new Broadcast Channel with the same unique name
const channel = new BroadcastChannel('extension_channel');

var company_icon;

// Listen for messages from the background script
channel.onmessage = function(event) {
  // Update the URL holder element with the received page URL
  if ((event.data.pageURL.indexOf('.myworkdayjobs')) + 1) {
    //console.log(event.data.pageURL.indexOf('.myworkdayjobs') + 1);
    var workday_form = document.getElementById("cred_store_form");
    workday_form.style.display = "block";
    document.getElementById("company_url").value = event.data.pageURL;
    document.querySelector('.company_logo').src = event.data.imageURL;

    company_icon = event.data.imageURL;

    // Populate the password field if data already exists
    chrome.storage.local.get(event.data.pageURL, function(data) {
      if (data[event.data.pageURL]) {
        var storedData = JSON.parse(data[event.data.pageURL]);
        document.getElementById("company_email").value = storedData.email;
        document.getElementById("pwd").value = storedData.password;
      }
    });
  } else {
    var workday_form = document.getElementById("cred_store_form");
    workday_form.style.display = "none";
    var error_page = document.getElementById("error_message");
    error_page.style.display = "block";
  }
};

// Store data using Chrome storage API
document.getElementById("save_button").addEventListener("click", function(event) {
  event.preventDefault(); // Prevent default form submission

  // Get values from the form
  var companyUrl = document.getElementById("detail-url").value;
  var email = document.getElementById("detail-email").value;
  var password = document.getElementById("detail-pwd").value;
  //var email = document.getElementById()
  var company_icon = document.getElementById("detail-img").src;

  if(email!=null && email!="" && password!=null && password!=""){

    // Retrieve existing data from Chrome storage (if any)
    chrome.storage.local.get({ [companyUrl]: '{}' }, function(data) {
      var existingData = data[companyUrl] ? JSON.parse(data[companyUrl]) : {};


      //console.log(company_icon);

      existingData.imageURL = company_icon;
      existingData.email = email;
      existingData.password = password;
      existingData.companyName = companyUrl.slice(8,companyUrl.indexOf('.wd')).toUpperCase();
      existingData.companyUrl = companyUrl;

      // Convert the updated data back to JSON
      var updatedData = JSON.stringify(existingData);

      // Save updated data to Chrome storage
      chrome.storage.local.set({ [companyUrl]: updatedData }, function() {
        //console.log('Data for ' + companyUrl + ' saved successfully');
        alert('Data saved successfully');
        /*chrome.storage.local.get(null, function(data) {
          console.log('All data retrieved:', data);
        });*/

        document.getElementById("company_email").value = email;
        document.getElementById("pwd").value = password;

      });
    });
  }
  
});

// Add password viewer functionality
document.addEventListener('DOMContentLoaded', function () {
  // Get references to the elements
  var homePageLink = document.getElementById('home_page');
  var listPageLink = document.getElementById('list_page');

  document.getElementById("closeDetailsPage").addEventListener("click", () => {
    document.getElementById("details_page").style.display = "none";
    document.getElementById("cred_store_form").style.display = "block";
  });

  document.getElementById("save_button").disabled = 'true';

  document.getElementById("detail-pwd").addEventListener("input", ()=>{
    
    if(document.getElementById("detail-pwd").value!=null && document.getElementById("detail-pwd").value!=""){
      document.getElementById("save_button").disabled = false;
    }
    else{
      document.getElementById("save_button").disabled = true;
    }

  });

  document.getElementById("detail-email").addEventListener("input", ()=>{
    
    if(document.getElementById("detail-email").value!=null && document.getElementById("detail-email").value!=""){
      document.getElementById("save_button").disabled = false;
    }
    else{
      document.getElementById("save_button").disabled = true;
    }

  });

  // Add click event listeners
  homePageLink.addEventListener('click', function () {
      switchPage('home');
  });

  listPageLink.addEventListener('click', function () {
      switchPage('list');
  });

  // Password toggle functionality
  const togglePassword = document.querySelector('#togglePassword');
  const passwordField = document.querySelector('#pwd');

  togglePassword.addEventListener('click', function() {
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);

    // Toggle classes on the icon itself
    const icon = this.querySelector('i'); // Get the icon element inside the button
    icon.classList.toggle('fa-eye-slash');
    icon.classList.toggle('fa-eye');
  });

  // Password toggle functionality
  const toggleDetailPassword = document.querySelector('#detail-togglePassword');
  const passwordDetailField = document.querySelector('#detail-pwd');

  toggleDetailPassword.addEventListener('click', function() {
    const type = passwordDetailField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordDetailField.setAttribute('type', type);

    // Toggle classes on the icon itself
    const icon1 = this.querySelector('i'); // Get the icon element inside the button
    icon1.classList.toggle('fa-eye-slash');
    icon1.classList.toggle('fa-eye');
  });

});


function getCredsData(){
  // Function to display all data in the list
  chrome.storage.local.get(null, function(data) {
    var dataList = document.getElementById('company_data');
    dataList.innerHTML = ''; // Clear the list before adding new items
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        let listItem = document.createElement('li');
        listItem.className = 'list-item';
        let itemData = JSON.parse(data[key]);

        listItem.innerHTML = `
          <img src="${itemData.imageURL}">
          <!--<p>${itemData.companyName}</p>-->
          <button class="edit-button" data-key="${key}"><i class="fas fa-pen"></i></button>
          <button class="delete-button" data-key="${key}"><i class="fas fa-trash"></i></button>
        `;
        
        dataList.appendChild(listItem);
      }
    }

    
    document.querySelectorAll('.delete-button').forEach(button => {
      button.addEventListener('click', function() {
        var key = this.getAttribute('data-key');
        chrome.storage.local.remove(key, function() {
          //console.log('Data for ' + key + ' deleted successfully');
          // Refresh the list after deletion
          chrome.storage.local.get(key, function(data) {
            if (data[key]) {
              var storedData = JSON.parse(data[key]);
              document.getElementById("company_email").value = storedData.email;
              document.getElementById("pwd").value = storedData.password;
            }
            else{
              document.getElementById("company_email").value = "";
              document.getElementById("pwd").value = "";
            }
          });
          getCredsData();
        });
      });
    });

    document.querySelectorAll('.edit-button').forEach(button => {
      button.addEventListener('click', function() {
        document.getElementById("cred_store_form").style.display = "none";
        document.getElementById("details_page").style.display = "block";
        var key = this.getAttribute('data-key');
        chrome.storage.local.get(key, function(data) {
          if (data[key]) {
            var storedData = JSON.parse(data[key]);
            document.getElementById("detail-img").src = storedData.imageURL;
            document.getElementById("detail-email").value = storedData.email;
            document.getElementById("detail-pwd").value = storedData.password;
            document.getElementById("detail-url").value = storedData.companyUrl;
            document.getElementById("detail-url-target").addEventListener("click", () => {
              window.open(storedData.companyUrl, '_blank');
            });

          }
        });
      });
    });



  });
}


function switchPage(pageId) {
  var homePage = document.getElementById('home');
  var listPage = document.getElementById('list');

  if (pageId === 'home') {
      homePage.style.display = 'block';
      listPage.style.display = 'none';
  } else if (pageId === 'list') {
      homePage.style.display = 'none';
      listPage.style.display = 'block';
      getCredsData();
  }
}

// When the popup is opened, send a message to the background script to request the page URL
chrome.runtime.sendMessage({ action: "requestPageURL" });
