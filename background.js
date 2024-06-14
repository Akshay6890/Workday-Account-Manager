// background.js

// Create a new Broadcast Channel with a unique name
const channel = new BroadcastChannel('extension_channel');

// Listen for messages from content scripts and popups
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  // Check if the message is a request for the page URL from the popup
  if (message.action === "requestPageURL") {
    // Send a message to the content script to request the page URL
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "getPageURL" });
    });
  } else {
    // Broadcast the received message to other parts of the extension
    channel.postMessage(message);
  }
});
