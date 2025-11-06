 # Waste Segregation Vision Model (Zero-shot)
 
 A FastAPI service that classifies images into waste categories using a zero-shot CLIP model. Default labels:
 
 - hazardous
 - non-hazardous
 - dry waste
 - wet waste
 - recyclable
 - organic
 
 You can edit `labels.json` to change labels and text prompts.
 
 ## Quickstart
 
 ```bash
 # from the model/ directory
 python -m venv .venv
 .venv\Scripts\activate  # on Windows PowerShell: .venv\Scripts\Activate.ps1
 pip install -r requirements.txt
 python main.py
 ```
 
 The server starts on `http://0.0.0.0:8083`.
 
 ### Predict
 
 ```bash
 curl -X POST "http://localhost:8083/predict" \
   -H "Content-Type: multipart/form-data" \
   -F "file=@sample.jpg"
 ```
 
 Response:
 
 ```json
 {
   "label": "dry waste",
   "score": 0.62,
   "scores": {"dry waste": 0.62, "wet waste": 0.10, ...}
 }
 ```
 
 ## Notes
 - Zero-shot classification works without training but may benefit from better prompts.
 - GPU is used automatically if available (CUDA); otherwise CPU.
 - For production, consider pinning a model snapshot and adding auth/rate limiting.
 

