import os
from flask import Flask, render_template, request, jsonify, redirect, url_for, flash
from flask_cors import CORS
from werkzeug.utils import secure_filename
import cv2
import numpy as np
from datetime import datetime
from PIL import Image
import matplotlib.pyplot as plt
import json
from sklearn.cluster import DBSCAN
import io
import base64

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def process_image(image_path):
    """Process the image to detect plastic waste and generate heatmap with improved detection."""
    # Read the image
    img = cv2.imread(image_path)
    
    # If OpenCV can't read it (e.g., WEBP), try using PIL to convert
    if img is None:
        try:
            # Try reading with PIL and converting to OpenCV format
            pil_img = Image.open(image_path)
            # Convert PIL image to RGB if needed
            if pil_img.mode != 'RGB':
                pil_img = pil_img.convert('RGB')
            # Convert PIL image to numpy array (OpenCV format)
            img = np.array(pil_img)
            # Convert RGB to BGR for OpenCV
            img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
        except Exception as e:
            return None, f"Error: Could not read the image - {str(e)}"
    
    if img is None:
        return None, "Error: Could not read the image"
    
    original = img.copy()
    height, width = img.shape[:2]
    min_contour_area = max(100, (width * height) * 0.0005)  # Dynamic minimum area based on image size
    
    # Convert to HSV color space for better color segmentation
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    
    # Define color ranges for common plastic bottle colors (blue, green, white, transparent)
    lower_blue = np.array([90, 50, 50])
    upper_blue = np.array([130, 255, 255])
    
    lower_green = np.array([40, 50, 50])
    upper_green = np.array([80, 255, 255])
    
    lower_white = np.array([0, 0, 200])
    upper_white = np.array([180, 30, 255])
    
    # Create masks for each color range
    mask_blue = cv2.inRange(hsv, lower_blue, upper_blue)
    mask_green = cv2.inRange(hsv, lower_green, upper_green)
    mask_white = cv2.inRange(hsv, lower_white, upper_white)
    
    # Combine masks
    combined_mask = cv2.bitwise_or(mask_blue, mask_green)
    combined_mask = cv2.bitwise_or(combined_mask, mask_white)
    
    # Apply morphological operations to clean up the mask
    kernel = np.ones((5,5), np.uint8)
    combined_mask = cv2.morphologyEx(combined_mask, cv2.MORPH_OPEN, kernel, iterations=1)
    combined_mask = cv2.morphologyEx(combined_mask, cv2.MORPH_CLOSE, kernel, iterations=2)
    
    # Find contours in the combined mask
    contours, _ = cv2.findContours(combined_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Filter contours based on area and shape
    plastic_contours = []
    for contour in contours:
        area = cv2.contourArea(contour)
        if area < min_contour_area:
            continue
            
        # Calculate contour properties
        x, y, w, h = cv2.boundingRect(contour)
        aspect_ratio = float(w) / h if h != 0 else 0
        extent = area / float(w * h) if (w * h) > 0 else 0
        
        # Filter based on shape properties (plastic bottles often have specific aspect ratios)
        is_rectangular = 0.2 < aspect_ratio < 5.0  # Bottles can be tall or wide
        is_solid = extent > 0.3  # Bottles are mostly solid
        
        if is_rectangular and is_solid:
            # Additional check for bottle-like shapes using convex hull
            hull = cv2.convexHull(contour)
            hull_area = cv2.contourArea(hull)
            if hull_area > 0:
                solidity = float(area) / hull_area
                if solidity > 0.5:  # Bottles are mostly convex
                    plastic_contours.append(contour)
    
    # Create a mask for plastic waste
    mask = np.zeros((height, width), dtype=np.uint8)
    cv2.drawContours(mask, plastic_contours, -1, 255, thickness=cv2.FILLED)
    
    # Apply the mask to the original image
    result = cv2.bitwise_and(original, original, mask=mask)
    
    # Generate heatmap with better visualization
    heatmap = cv2.applyColorMap(mask, cv2.COLORMAP_JET)
    
    # Create density map using DBSCAN with improved parameters
    points = []
    for contour in plastic_contours:
        M = cv2.moments(contour)
        if M["m00"] > 0:  # Only process if the contour has area
            cX = int(M["m10"] / M["m00"])
            cY = int(M["m01"] / M["m00"])
            points.append([cX, cY])
    
    # Calculate DBSCAN parameters based on image size
    dbscan_eps = max(30, int(min(width, height) * 0.05))  # Dynamic epsilon based on image size
    labels = None
    
    if len(points) > 1:  # Need at least 2 points for clustering
        points = np.array(points)
        
        # Use DBSCAN to find clusters of plastic waste
        clustering = DBSCAN(eps=dbscan_eps, min_samples=2).fit(points)
        labels = clustering.labels_
        
        # Count points in each cluster (ignore noise points with label=-1)
        unique_labels, counts = np.unique(labels[labels >= 0], return_counts=True)
        
        # Create a density map
        density_map = np.zeros((height, width), dtype=np.float32)
        
        if len(unique_labels) > 0:  # If we have any clusters
            for i, label in enumerate(unique_labels):
                if label != -1:  # Skip noise points
                    cluster_points = points[labels == label]
                    for point in cluster_points:
                        # Draw circles with radius proportional to cluster size
                        radius = int(20 + (counts[i] * 2))
                        cv2.circle(density_map, tuple(point), radius, (255,), -1, cv2.FILLED)
            
            # Apply Gaussian blur for smoother density visualization
            density_map = cv2.GaussianBlur(density_map, (51, 51), 0)
            
            # Normalize the density map
            density_map = cv2.normalize(density_map, None, 0, 255, cv2.NORM_MINMAX)
        
        density_map = density_map.astype(np.uint8)
        
        # Apply color map to density map with better contrast
        density_heatmap = cv2.applyColorMap(density_map, cv2.COLORMAP_JET)
        
        # Overlay the density map on the original image with transparency
        alpha = 0.6
        cv2.addWeighted(density_heatmap, alpha, original, 1 - alpha, 0, density_heatmap)
    else:
        density_heatmap = np.zeros_like(original)
    
    # Create results directory if it doesn't exist
    results_dir = os.path.join('static', 'results')
    os.makedirs(results_dir, exist_ok=True)
    
    # Generate unique filenames with timestamps
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    base_filename = f"{os.path.splitext(os.path.basename(image_path))[0]}_{timestamp}"
    
    # Save the processed images with unique names
    result_path = os.path.join(results_dir, f"{base_filename}_result.jpg")
    heatmap_path = os.path.join(results_dir, f"{base_filename}_heatmap.jpg")
    density_path = os.path.join(results_dir, f"{base_filename}_density.jpg")
    
    # Save images with optimized quality
    cv2.imwrite(result_path, result, [int(cv2.IMWRITE_JPEG_QUALITY), 90])
    cv2.imwrite(heatmap_path, heatmap, [int(cv2.IMWRITE_JPEG_QUALITY), 90])
    cv2.imwrite(density_path, density_heatmap, [int(cv2.IMWRITE_JPEG_QUALITY), 90])
    
    # Calculate statistics
    plastic_area = np.sum(mask > 0)
    total_area = mask.size
    plastic_percentage = (plastic_area / total_area) * 100
    
    # Get cluster information
    if points is not None and len(points) > 0 and labels is not None:
        num_clusters = len(np.unique(labels)) - (1 if -1 in labels else 0)
        avg_cluster_size = len(points) / num_clusters if num_clusters > 0 else 0
    else:
        num_clusters = 0
        avg_cluster_size = 0
    
    stats = {
        'plastic_area': int(plastic_area),
        'total_area': total_area,
        'plastic_percentage': round(plastic_percentage, 2),
        'num_objects': len(plastic_contours),
        'num_clusters': num_clusters,
        'avg_cluster_size': round(avg_cluster_size, 2) if num_clusters > 0 else 0,
        'result_image': result_path.replace('\\', '/'),
        'heatmap_image': heatmap_path.replace('\\', '/'),
        'density_image': density_path.replace('\\', '/')
    }
    
    return stats, None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    # Check if file is allowed by extension or MIME type
    is_allowed = False
    if file.filename and allowed_file(file.filename):
        is_allowed = True
    elif file.content_type:
        # Check by MIME type as fallback
        allowed_mimes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
        if file.content_type.lower() in allowed_mimes:
            is_allowed = True
    
    if file and is_allowed:
        # Generate a secure filename with proper extension
        if file.filename and allowed_file(file.filename):
            filename = secure_filename(file.filename)
        else:
            # Generate filename based on MIME type
            extension = 'jpg'  # default
            if file.content_type:
                content_type_lower = file.content_type.lower()
                if 'png' in content_type_lower:
                    extension = 'png'
                elif 'gif' in content_type_lower:
                    extension = 'gif'
                elif 'webp' in content_type_lower:
                    extension = 'webp'
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"upload_{timestamp}.{extension}"
        
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Process the image
        stats, error = process_image(filepath)
        
        if error:
            return jsonify({'error': error}), 500
        
        return jsonify({
            'message': 'File successfully uploaded and processed',
            'stats': stats
        })
    
    return jsonify({'error': 'File type not allowed. Please upload PNG, JPG, JPEG, GIF, or WEBP images.'}), 400

@app.route('/results')
def results():
    # This would typically show a list of all processed images
    # For now, just redirect to the index
    return redirect(url_for('index'))

if __name__ == '__main__':
    # Create results directory if it doesn't exist
    os.makedirs(os.path.join('static', 'results'), exist_ok=True)
    app.run(debug=True)
