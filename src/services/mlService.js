const ML_API_BASE_URL = 'http://localhost:5000';

class MLService {
  async handleResponse(response) {
    const json = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(json.error || `HTTP ${response.status}`);
      error.status = response.status;
      error.response = json;
      throw error;
    }
    return json;
  }

  async analyzeImage(file) {
    const formData = new FormData();
    
    // Ensure the file has a proper name with extension
    let fileToSend = file;
    if (!file.name || !file.name.includes('.')) {
      // If file doesn't have a name or extension, create a new File with proper name
      let extension = 'jpg'; // default
      if (file.type) {
        const mimeParts = file.type.split('/');
        if (mimeParts.length > 1) {
          extension = mimeParts[1];
          // Handle special cases
          if (extension === 'jpeg') extension = 'jpg';
        }
      }
      const fileName = `image.${extension}`;
      fileToSend = new File([file], fileName, { type: file.type });
    }
    
    formData.append('file', fileToSend);
    
    const resp = await fetch(`${ML_API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });
    
    const json = await this.handleResponse(resp);
    return json.stats || json;
  }

  getImageUrl(imagePath) {
    // Convert relative path to full URL
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    // If path starts with static/, use the ML API base URL
    if (imagePath.startsWith('static/')) {
      return `${ML_API_BASE_URL}/${imagePath}`;
    }
    // Otherwise, assume it's a relative path from static/
    return `${ML_API_BASE_URL}/static/${imagePath}`;
  }
}

export const mlService = new MLService();
export default mlService;

