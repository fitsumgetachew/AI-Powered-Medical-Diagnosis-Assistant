# AI-Powered Medical Diagnosis Assistant

## Project Overview
The AI-Powered Medical Diagnosis Assistant is an advanced platform designed to enhance diagnostic accuracy, democratize healthcare, optimize clinical workflows, empower patients, and facilitate data-driven healthcare decisions. By integrating AI-powered image analysis, symptom assessment, and comprehensive patient data analytics, this platform aims to improve early disease detection, accessibility to healthcare, efficiency in clinical workflows, personalized treatment recommendations, and overall patient care.

## Installation Instructions

### Prerequisites
- Git
- Python 3.8 or higher
- Node.js 18 (instructions included below)

### Backend Setup

1. **Clone the Repository**
    ```bash
    git clone https://github.com/fitsumgetachew/AI-Powered-Medical-Diagnosis-Assistant.git
    cd AI-Powered-Medical-Diagnosis-Assistant
    ```

2. **Create and Activate Virtual Environment**
    - **macOS/Linux:**
        ```bash
        python -m venv venv
        source venv/bin/activate
        ```
    - **Windows:**
        ```bash
        python -m venv venv
        .\venv\Scripts\activate
        ```

3. **Install Backend Dependencies**
    ```bash
    cd medical_diagnosis_assistant
    pip install -r requirements.txt
    ```

4. **Configure Environment Variables**
    Create a `.env` file in the `medical_diagnosis_assistant` directory and add the following:
    ```env
    MAIL_SERVER=smtp.gmail.com
    MAIL_USE_TLS=True
    MAIL_USERNAME=your_email@gmail.com
    MAIL_PASSWORD=your_email_password
    API_KEY=your_openai_api_key
    ```

5. **Run Backend Server**
    ```bash
    python manage.py runserver 8000
    ```

### Frontend Setup

1. **Install Node.js**
    - **macOS/Linux:**
        ```bash
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
        source ~/.bashrc  # or source ~/.zshrc for macOS
        nvm install 18
        nvm use 18
        ```
    - **Windows:**
        Download and install Node.js 18 from [nodejs.org](https://nodejs.org/)

2. **Install Frontend Dependencies**
    ```bash
    cd frontend/medical-assistant-frontend
    rm -rf node_modules package-lock.json  # Clean install
    npm install
    ```

3. **Run Frontend Development Server**
    ```bash
    npm run dev
    ```

### Accessing the Application
Once both servers are running, access the application through the URL provided by the frontend development server (typically http://localhost:5173 or similar).

### Troubleshooting
- **CORS Issues**: Ensure both frontend and backend servers are running
- **Authentication Errors**: Verify your `.env` configuration
- **Package Conflicts**: Try removing `node_modules` and running a fresh `npm install`

### Deployment
- **Google Cloud Platform (GCP)**
- **WSGI and Nginx**
- **Gunicorn for Django app**

## Collection of Tools, Technologies, and Frameworks Used

### Backend:
- **Django Rest Framework**: For building APIs.
- **LangChain**: For interacting with Large Language Models (LLMs).
- **Django Simple JWT**: For user authentication and authorization.
- **TensorFlow, Scikit-Learn, and OpenCV**: For medical image processing and developing deep learning models for disease detection.

### Frontend:
- **React**: For creating an interactive, modular, and component-based user interface.

### Testing:
- **Postman**: For API testing.

## Contact
For any inquiries or issues, please contact us at [fitsumgetachewtola@gmail.com](mailto:your_email@gmail.com).
