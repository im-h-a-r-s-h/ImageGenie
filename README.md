# ImageGenie
ImageGenie is an AI-powered image clustering and sharing platform designed for event photo management. It allows users to **upload multiple photos**, **automatically cluster faces**, and **search for images within a specific cluster** using their single reference photo. Users can also **download entire clusters as ZIP files**.

## Project Screenshots

Main Page
![ImageGenie Screenshot 1](./public/photo/Screenshot%202025-10-20%20160214.png)
Upload Page
![ImageGenie Screenshot 2](./public/photo/Screenshot%202025-10-20%20170616.png)
Search Page
![ImageGenie Screenshot 3](./public/photo/Screenshot%202025-10-20%20162345.png)
Result Page
![ImageGenie Screenshot 4](./public/photo/Screenshot%202025-10-20%20162744.png)



## Features
🔹 **Upload multiple photos** at once  
🔹 **Automatic face clustering** using DBSCAN and face embeddings  
🔹 **Search images by uploading a reference photo(selfie)**  
🔹 **Download entire clusters as ZIP files**  
🔹 **Room-based organization**: All images are organized by unique Room IDs  
🔹 **Clean and responsive UI** for easy navigation

## Tech Stack
- **Frontend**: HTML, CSS, JavaScript  
- **Backend**: Node.js, Express.js  
- **Machine Learning / Face Recognition**: Python, OpenCV, face_recognition, scikit-learn  
- **File Uploads**: Multer  
- **Data Storage**: Local file system (organized by `uploads/` and `clusters/` folders)  

## Setup Instructions
1. Clone the repository:
```bash
git clone https://github.com/im-h-a-r-s-h/ImageGenie.git
```
2. Navigate to the project folder:
```bash
cd ImageGenie
```
3. Install Node.js dependencies:
```bash
npm install
```
4. Create a virtual environment (Python 3.8) only work on 3.8:
```bash
py -3.8 -m venv .env
.env\Scripts\activate
```
5. Install Python dependencies:
```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```
6. Start the Node.js server with nodemon:
```bash
nodemon app.js
```
7. Server started at http://localhost:3000

## Usage
Upload photos to create clusters.
Enter a Room ID to search within a specific set of photos.
View images in clusters and download them as ZIP files.

## 📧 Contact
If you'd like to learn more, collaborate, or request access to the repository:  
Email: [2k22.cse.2213543@gmail.com]  
LinkedIn: [linkedin.com/in/h-a-r-s-h]


