# Prosthetic Designer

This project is a full-stack application for the automatic design of prosthetic limbs from 2D images.

## Tech Stack

- **Frontend:** Next.js, TypeScript, Three.js
- **Backend:** Python (Flask/FastAPI), OpenCV, PyTorch/TensorFlow

## Goal

The application will allow a user to upload a 2D image of a residual limb. The backend will then:
1.  Analyze the image to extract key measurements and anatomical points.
2.  Generate a custom-fit 3D model of a prosthetic socket.
3.  Send the model back to the frontend to be displayed.
