# Boardly
Boardly is a collaborative project management tool that uses boards, lists, and cards to help individuals and teams organize and prioritize tasks. It provides a visual and flexible way to track progress, assign responsibilities, and manage workflows. It integrates OpenAI to foster the creation of detailed, quality boards. 

## Dependencies, Installation, and Setup
### Frontend
Clone repository in VS Code
```
cd frontend
npm install
npm start 
```

Frontend accessible at https://localhost:3000

### Backend 
Clone repository in VS Code
```
cd backend
python -m venv venv
.\venv\Scripts\activate # MacOS + Linux: source venv/bin/activate
pip install -r requirements.txt (may need to include --user)
```

Start the FastAPI server
```
uvicorn main:app --reload
```
FastAPI server accessible at http://localhost:8000

When finished with development, deactivate the virtual environment.
```
.\venv\Scripts\deactivate # MacOS + Linux: deactivate
```

## Accessing API endpoints

Follow steps for backend setup. Launch http://localhost:8000/docs

This is the swaggerUI page, where you can see request parameters, response formats, and the URLs to connect backend to frontend. 

Click the dropdown for a given API, click Try It Out, click execute, grab the URL beneath "curl"

## Contibuting 
Create a fork of the repository. From your fork, you can work on your main branch or create sub-branches for functionality. Submit pull requests to main branch, then merge if you don't want a code review.  
