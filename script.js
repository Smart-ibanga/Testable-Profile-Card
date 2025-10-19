// Function to update the current UTC time
function updateUTCTime() {
    const currentTimeElement = document.querySelector('.current-time-utc');
    const now = new Date();
    const utcTime = now.toUTCString();
    currentTimeElement.textContent = `Current UTC Time: ${utcTime}`;
  }
  
  // Update the UTC time immediately and every second
  updateUTCTime();
  setInterval(updateUTCTime, 1000);