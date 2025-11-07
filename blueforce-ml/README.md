# Plastic Density Heatmap Generator

A machine learning-powered tool that analyzes beach photos to detect and visualize plastic waste distribution through heatmaps. This project is part of the Blue Force beach cleanup initiative.

## Features

- **Image Upload**: Drag and drop or click to upload beach photos
- **Plastic Detection**: Uses computer vision to identify potential plastic waste
- **Heatmap Generation**: Creates visual heatmaps showing plastic density
- **Density Analysis**: Identifies clusters of plastic waste
- **Interactive UI**: User-friendly interface with real-time processing feedback
- **Detailed Reports**: Provides statistics and analysis of detected plastic waste

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Virtual environment (recommended)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/blueforce-ml.git
   cd blueforce-ml
   ```

2. **Create and activate a virtual environment**
   ```bash
   # On Windows
   python -m venv venv
   .\venv\Scripts\activate
   
   # On macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

## Usage

1. **Run the application**
   ```bash
   python app.py
   ```

2. **Open your web browser** and navigate to:
   ```
   http://127.0.0.1:5000
   ```

3. **Upload a beach photo** by dragging and dropping or clicking the upload area

4. **View the analysis** including heatmaps, density maps, and statistics

## How It Works

1. **Image Processing**: The system uses OpenCV to process the uploaded image
2. **Plastic Detection**: Computer vision techniques identify potential plastic waste
3. **Density Analysis**: DBSCAN clustering algorithm identifies clusters of plastic waste
4. **Visualization**: Generates heatmaps and density maps using color gradients
5. **Statistics**: Calculates metrics like plastic coverage percentage and cluster information

## Project Structure

```
blueforce-ml/
├── app.py                # Main application file
├── requirements.txt      # Python dependencies
├── static/               # Static files (CSS, JS, images)
│   ├── css/              # CSS styles
│   ├── js/               # JavaScript files
│   ├── uploads/          # Uploaded images
│   └── results/          # Processed images and results
└── templates/            # HTML templates
    └── index.html        # Main web interface
```

## Integration with Blue Force Platform

This module can be integrated into the Blue Force platform by:

1. Adding the analysis endpoint to your existing Flask application
2. Storing analysis results in your database
3. Displaying heatmaps in the volunteer and NGO dashboards
4. Using the data to plan and prioritize cleanup efforts

## API Endpoints

- `GET /`: Main application interface
- `POST /upload`: Upload and process an image
- `GET /results`: View analysis results (currently redirects to home)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenCV for image processing
- scikit-learn for machine learning algorithms
- Bootstrap for the responsive UI
- Font Awesome for icons
