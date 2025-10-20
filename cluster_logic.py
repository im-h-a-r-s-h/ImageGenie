# cluster_logic.py
import cv2
import os
import numpy as np
from sklearn.cluster import DBSCAN
import shutil
import sys
import json

# Import face_recognition
import face_recognition

# Paths
base_dir = os.path.dirname(os.path.abspath(__file__))
all_photos_path = os.path.join(base_dir, 'uploads', 'all_photos')
search_photo_path = os.path.join(base_dir, 'uploads', 'search_photo')
clusters_path = os.path.join(base_dir, 'clusters')
os.makedirs(clusters_path, exist_ok=True)

# Face detection
def extract_face(img_path):
    img = cv2.imread(img_path)
    if img is None:
        return []
    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    boxes = face_recognition.face_locations(rgb, model="hog")
    encodings = face_recognition.face_encodings(rgb, boxes)
    faces = []
    for (box, enc) in zip(boxes, encodings):
        top, right, bottom, left = box
        face_img = img[top:bottom, left:right]
        face_img = cv2.resize(face_img, (96, 96))
        faces.append({"face_img": face_img, "encoding": enc})
    return faces

# Determine mode and roomId
# Determine mode and roomId
# Determine mode and roomId
mode = 'cluster' if len(sys.argv) < 2 else sys.argv[1]

if len(sys.argv) < 3:
    print(f"[ERROR] Room ID is required for {mode}.")
    sys.exit(1)

roomId = sys.argv[2]
room_cluster_path = os.path.join(clusters_path, roomId)

if mode == 'cluster':
    os.makedirs(room_cluster_path, exist_ok=True)

elif mode == 'search':
    if not os.path.exists(room_cluster_path):
        print(f"[ERROR] Room ID folder not found: {roomId}")
        sys.exit(1)



if mode != 'search':
    # Clustering mode
    face_embeddings = []
    image_face_map = []

    for filename in os.listdir(all_photos_path):
        path = os.path.join(all_photos_path, filename)
        faces = extract_face(path)
        if not faces:
            print(f"[ERROR] No faces in {filename}")
            continue
        for face_data in faces:
            face_embeddings.append(face_data["encoding"])
            image_face_map.append((filename, face_data["face_img"]))

    if len(face_embeddings) == 0:
        print("[ERROR] No faces detected in any photo.")
        sys.exit(1)

    # DBSCAN clustering
    clt = DBSCAN(metric="cosine", n_jobs=-1, min_samples=1, eps=0.06)
    clt.fit(face_embeddings)
    labels = clt.labels_

    for idx, label in enumerate(labels):
        folder = os.path.join(room_cluster_path, f'cluster_{label}')
        os.makedirs(folder, exist_ok=True)
        original_name = image_face_map[idx][0]
        src_path = os.path.join(all_photos_path, original_name)
        dst_path = os.path.join(folder, original_name)
        shutil.copy(src_path, dst_path)

    print(f"[SUCCESS] Clustering complete. Check clusters/{roomId}/ folder.")

    # Delete all photos after clustering
    for f in os.listdir(all_photos_path):
        os.remove(os.path.join(all_photos_path, f))
    print("[INFO] uploads/all_photos cleared.")

    
elif mode == 'search':
    if len(sys.argv) < 3:
        print("[ERROR] Room ID required for search.", file=sys.stderr)
        sys.exit(1)
    roomId = sys.argv[2]
    cluster_path = os.path.join(clusters_path, roomId)
    if not os.path.exists(cluster_path):
        print("[ERROR] Room cluster not found.", file=sys.stderr)
        sys.exit(1)

    search_imgs = os.listdir(search_photo_path)
    if len(search_imgs) == 0:
        print("[ERROR] No photo provided for search.", file=sys.stderr)
        sys.exit(1)

    search_path = os.path.join(search_photo_path, search_imgs[0])
    faces = extract_face(search_path)
    if not faces:
        print("[ERROR] No face detected in search image.", file=sys.stderr)
        sys.exit(1)

    query_embedding = faces[0]["encoding"]

    # Find closest cluster in this room only
    cluster_dirs = [d for d in os.listdir(cluster_path) if os.path.isdir(os.path.join(cluster_path, d))]
    cluster_centers = []
    cluster_names = []

    for folder in cluster_dirs:
        folder_path = os.path.join(cluster_path, folder)
        embeddings = []
        for img_name in os.listdir(folder_path):
            img_path = os.path.join(folder_path, img_name)
            face_list = extract_face(img_path)
            if face_list:
                embeddings.append(face_list[0]["encoding"])
        if embeddings:
            cluster_mean = np.mean(embeddings, axis=0)
            cluster_centers.append(cluster_mean)
            cluster_names.append(folder)

    if not cluster_centers:
        print(json.dumps({"cluster": None, "images": []}))
        sys.exit(0)

    distances = [np.linalg.norm(query_embedding - center) for center in cluster_centers]
    min_idx = np.argmin(distances)
    match_folder = cluster_names[min_idx]
    match_folder_path = os.path.join(cluster_path, match_folder)

    result = {
        "cluster": match_folder,
        "images": os.listdir(match_folder_path)
    }
    print(json.dumps(result))  # ✅ Only JSON output



else:
    print("[ERROR] Invalid mode. Use 'cluster' or 'search'.")


