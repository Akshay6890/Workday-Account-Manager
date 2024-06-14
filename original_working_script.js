
var company_name;


// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "getPageURL") {
    var img_url = window.location.href.slice(0, window.location.href.indexOf('.com/') + 4) + document.querySelector('.css-1t8sqvc').getAttribute('src');
    chrome.runtime.sendMessage({ pageURL: window.location.href, imageURL: img_url });
  }
});

function addInputListeners() {
  const emailField = document.getElementById('input-4');
  const passwordField = document.getElementById('input-5');

  if (emailField) {
    emailField.addEventListener('input', () => {
      console.log('Email:', emailField.value);
    });
  } else {
    console.log('Email field not found');
  }

  if (passwordField) {
    passwordField.addEventListener('input', () => {
      console.log('Password:', passwordField.value);
    });
  } else {
    console.log('Password field not found');
  }
}

function injectModal() {
  const modalHTML = `

    <div id="saveModal">
  <div id="modalContent">
    <header id="modalHeader">
      <img src="chrome-extension://ccbdkfokllnhpifafnhoeingeidigkgl/images/password-manager.png"><h3>SAVE LOGIN DETAILS FOR ${company_name}?</h3>
      <span id="closeModal">&times;</span>
    </header>
    <main id="modalMain">
      <div class="modalRow">
        <label for="modalEmail">EMAIL</label>
        <input type="text" id="modalEmail" placeholder="Enter your email">
      </div>
      <div class="modalRow">
        <label for="modalPassword">PASSWORD</label>
        <div class="passwordContainer">
          <input type="password" id="modalPassword" placeholder="Enter your password">
          <button type="button" id="togglePassword">
            <span class="eye-icon-container">
              <svg viewBox="0 0 20 20" class="eye-icon" aria-hidden="true">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M10 11.5C10.8284 11.5 11.5 10.8284 11.5 10C11.5 9.17157 10.8284 8.5 10 8.5C9.17157 8.5 8.5 9.17157 8.5 10C8.5 10.8284 9.17157 11.5 10 11.5ZM10 13C11.6569 13 13 11.6569 13 10C13 8.34315 11.6569 7 10 7C8.34315 7 7 8.34315 7 10C7 11.6569 8.34315 13 10 13Z"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M18 10.0001C18 10.0001 16 4 10 4C4 4 2 10.0001 2 10.0001C2 10.0001 4 16 10 16C16 16 18 10.0001 18 10.0001ZM3.62005 10.0001C3.65718 10.0811 3.69973 10.1704 3.74789 10.2668C3.9914 10.7538 4.36904 11.3998 4.90232 12.0398C5.95964 13.3085 7.57163 14.5 10 14.5C12.4284 14.5 14.0404 13.3085 15.0977 12.0398C15.631 11.3998 16.0086 10.7538 16.2521 10.2668C16.3003 10.1705 16.3428 10.0811 16.38 10.0001C16.3428 9.9191 16.3003 9.82974 16.2521 9.73341C16.0086 9.24637 15.6309 8.60028 15.0977 7.96032C14.0403 6.69151 12.4283 5.5 10 5.5C7.57166 5.5 5.95967 6.69151 4.90234 7.96032C4.36905 8.60028 3.99141 9.24637 3.7479 9.73341C3.69973 9.82974 3.65718 9.9191 3.62005 10.0001Z"/>
              </svg>
              <i class="eye-slash-icon fa-eye fa-eye-slash" style="display: none;"></i>
            </span>
          </button>
        </div>
      </div>
    </main>
    <footer id="modalFooter">
      <button id="saveDetails">Save</button>
      <button id="cancelDetails">Cancel</button>
    </footer>
  </div>
</div>


  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function showModal(email, password) {
  const modal = document.getElementById('saveModal');
  const modalEmail = document.getElementById('modalEmail');
  const modalPassword = document.getElementById('modalPassword');

  modalEmail.value = email;
  modalPassword.value = password;

  modal.style.display = 'block';

  document.getElementById('closeModal').onclick = function() {
    modal.style.display = 'none';
  };

  document.getElementById('cancelDetails').onclick = function() {
    modal.style.display = 'none';
  };

  document.getElementById('togglePassword').addEventListener('click', function () {
    const passwordInput = document.getElementById('modalPassword');
    const passwordType = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', passwordType);
  
    // Toggle eye icon
    const eyeIcon = this.querySelector('.eye-icon');
    const eyeSlashIcon = this.querySelector('.eye-slash-icon');
  
    if (passwordType === 'text') {
      eyeIcon.style.display = 'none';
      eyeSlashIcon.style.display = 'block';
    } else {
      eyeIcon.style.display = 'block';
      eyeSlashIcon.style.display = 'none';
    }
  });
  
  

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };

  document.getElementById('saveDetails').onclick = function() {
    const updatedEmail = modalEmail.value;
    const updatedPassword = modalPassword.value;
    const companyUrl = window.location.href;

    const dataToSave = {
      email: updatedEmail,
      password: updatedPassword
    };

    chrome.storage.local.set({ [companyUrl]: JSON.stringify(dataToSave) }, function() {
      console.log('Data saved for ' + companyUrl);
      modal.style.display = 'none';
    });
  };
}

function setupFormSubmitListener() {
  const form = document.querySelector('form');
  if (form) {
    console.log('Form found, adding submit event listener');
    form.addEventListener('submit', (event) => {
      const emailField = document.getElementById('input-4');
      const passwordField = document.getElementById('input-5');
      const email = emailField ? emailField.value : '';
      const password = passwordField ? passwordField.value : '';

      if (email && password) {
        setTimeout(() => {
          showModal(email, password);
        }, 1); // Adjust the delay as needed
      }
    });
  } else {
    console.log('Form not found');
  }
}

window.addEventListener('load', () => {


  var font_awesome = document.createElement('style');

  font_awesome.href = 'chrome-extension://ccbdkfokllnhpifafnhoeingeidigkgl/all.min.css';

  document.head.appendChild(font_awesome);
  


  console.log('Page loaded');

  company_name = window.location.href.slice(8,window.location.href.indexOf('.wd'));

  company_name = company_name.toUpperCase();

  const style = document.createElement('style');
  style.textContent = `

    #saveModal {
      display: none;
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      overflow: auto;
      background: rgba(0, 0, 0, 0.4);
      animation: 0.5s slideIn;
      font-family: Roboto;
      background: none;
    }

    #modalContent {
      background-color: #fff;
      margin: 10% auto;
      padding: 20px;
      border-radius: 12px;
      width: 80%;
      max-width: 400px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
      display: flex;
      flex-direction: column;
    }

    #modalHeader {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #eaeaea;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }

    #modalHeader img {
      height:40px;
      width:40px;
    }

    #modalHeader h3 {
      margin: 0;
      font-size: 13px;
    }

    #closeModal {
      color: #aaa;
      font-size: 24px;
      font-weight: bold;
      cursor: pointer;
      transition: color 0.3s;
    }

    #closeModal:hover,
    #closeModal:focus {
      color: #000;
    }

    #modalMain {
      flex-grow: 1;
    }

    .modalRow {
      margin-bottom: 15px;
    }

    .modalRow label {
      display: block;
      font-size: 14px;
      color: #333;
      margin-bottom: 5px;
    }

    .modalRow input {
      width: 100%;
      padding: 10px;
      border: 1px solid #eaeaea;
      border-radius: 5px;
      font-size: 14px;
      box-sizing: border-box;
      height: 45px;
    }

    .passwordContainer {
      position: relative;
    }

    .passwordContainer input {
      padding-right: 40px;
    }

    #togglePassword {
      position: absolute;
      right: 1px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      cursor: pointer;
      height: 45px;
      border: none;
    }

    .eye-icon-container {
      display: flex;
      align-items: center;
    }

    .eye-icon, .eye-slash-icon {
      width: 20px;
      height: 20px;
      fill: #aaa;
    }

    #modalFooter {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      border-top: 1px solid #eaeaea;
      padding-top: 10px;
      margin-top: 20px;
    }

    #saveDetails, #cancelDetails {
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    #saveDetails {
      background-color: #63aeff;
      color: #ffffff;
    }

    #saveDetails:hover {
      background-color: #0056b3;
    }

    #cancelDetails {
      background-color: #f5f5f5;
      color: #333;
    }

    #cancelDetails:hover {
      background-color: #e0e0e0;
    }

    @keyframes slideIn {
      from {
        transform: scale(0);
      }
      to {
        transform: scale(1);
      }
    }   

  `;
  document.head.appendChild(style);

  if (window.location.href.indexOf('/login?') !== -1 || window.location.href.indexOf('/login') !== -1) {
    injectModal();
    addInputListeners();
    setupFormSubmitListener();

    const observer = new MutationObserver(() => {
      addInputListeners();
      setupFormSubmitListener();
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }
});
