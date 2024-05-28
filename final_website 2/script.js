const videoElement = document.getElementById("videoElement");
const captureButton = document.getElementById("captureButton");
const canvasElement = document.getElementById("canvasElement");
const ctx = canvasElement.getContext("2d");

// Request access to the user's camera
navigator.mediaDevices
  .getUserMedia({ video: true })
  .then(function (stream) {
    // Attach the stream to the video element
    videoElement.srcObject = stream;

    // Set up the capture button to take a picture
    captureButton.addEventListener("click", function () {
      // Set the canvas size to match the video element
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;

      // Draw the current video frame to the canvas
      ctx.drawImage(videoElement, 0, 0);

      // Save the image to the user's device
      const imageURL = canvasElement.toDataURL("image/jpeg");
      //   const a = document.createElement("a");
      //   a.href = imageURL;
      //   a.download = "camera_capture.jpg";
      //   a.click();

      //New Code For API
      // Convert imageURL to Blob
      fetch(imageURL)
        .then((response) => response.blob())
        .then((blob) => {
          // Create a File object from the Blob
          const file = new File([blob], "camera_capture.jpg", {
            type: "image/jpeg",
          });

          // Append the File object to the FormData
          let formData = new FormData();
          formData.append("file", file);

          // Send the FormData to the server
          fetch("https://ml-api-0rbc.onrender.com/disease-predict", {
            method: "POST",
            body: formData,
          })
            .then((response) => response.json())
            .then((result) => {
              const result_data = result.prediction;
              const pElement = document.createElement("p");
              // Set the text content of the <p> element to the result_data
              pElement.innerHTML = result_data;

              // Append the <p> element to the body or any other container in your HTML
              document.body.appendChild(pElement);
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        })
        .catch((error) =>
          console.error("Error converting imageURL to Blob:", error)
        );
    });
  })
  .catch(function (error) {
    console.error("Error accessing the camera:", error);
  });

// Get the file input element
const uploadButton = document.getElementById("uploadButton");

// Add an event listener for the file input
uploadButton.addEventListener("change", function (event) {
  // Get the selected file
  const file = event.target.files[0];

  // Create a FormData object
  let formData = new FormData();
  // Append the file to the FormData
  formData.append("file", file);

  // Send the FormData to the server
  fetch("https://ml-api-0rbc.onrender.com/disease-predict", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((result) => {
      // Handle the result from the API
      const result_data = result.prediction;
      const pElement = document.createElement("p");
      // Set the text content of the <p> element to the result_data
      pElement.innerHTML = result_data;

      // Append the <p> element to the body or any other container in your HTML
      document.body.appendChild(pElement);
      // For example, you can display the result in the console or update the UI
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
