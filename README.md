# ImageGenie

**ImageGenie** is an AI-powered photo clustering and haring web application, designed to help photographers automatically group event photos into clusters based on faces and share them securely with users via unique Room IDs. This app uses **face detection, clustering, and retrieval  through face recognition and clustering technology**  for real-world applications such as weddings, parties, and events.

## 🛠️ Technologies Used

- **Frontend**: HTML, CSS, JavaScript, EJS
- **Backend**: Node.js, Express.js
- **File Upload**: Multer
- **Database**: MongoDB (Mongoose)
- **Machine Learning**: Python (OpenCV, TensorFlow, KMeans)
- **File Handling**: Python's `exec` (for running the ML script)

## ✨ Key Features

- **Photographer Signup**: Sign up and authenticate photographers securely using JWT and bcrypt.
- **Image Upload**: Upload multiple event photos, which are then processed for face clustering.
- **Face Clustering**: Automatically detects and groups faces using OpenCV and TensorFlow.
- **Room ID**: A unique 6-digit Room ID is generated for each photographer and shared with users.
- **User Search**: Users can search photos by entering the Room ID to view the event's photo collection.
- **Secure Session Management**: Photographer authentication and session management using JWT and MongoDB.
  
## 🚀 Getting Started

To run this project locally:

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/imagegenie.git
    cd imagegenie
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Install Python dependencies (for the ML part):

    ```bash
    pip install -r requirements.txt
    ```

4. Configure environment variables:

    Create a `.env` file in the root directory and add your MongoDB connection string and other required configurations like:

    ```env
    MONGO_URI=your-mongodb-connection-string
    JWT_SECRET=your-jwt-secret
    SESSION_SECRET=your-session-secret
    ```

5. Run the application:

    ```bash
    node server.js
    ```

Visit [http://localhost:3000](http://localhost:3000) in your browser to explore ImageGenie locally.

## Contribution

Feel free to contribute to this project by opening issues or creating pull requests. Your feedback and contributions are highly appreciated!
