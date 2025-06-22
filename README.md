# RAG LLM Frontend

## Build
`npm install`

## Run
```
npm run dev
```

## File Management Features
- Upload PDF and DOCX files to the RAG system
- View all processed documents
- Delete files from both filesystem and vector store
- Navigate to `/ragdocs` for document management interface

## Git Configuration

This repository is configured to push to both GitHub and UT Austin remotes simultaneously.

### Current Remote Setup
- **UT Austin**: `git@github.austin.utexas.edu:kk33964/cii-llm-frontend.git`
- **GitHub**: `git@github.com:yourusername/cii-llm-frontend.git` (update with actual URL)

### Push to Both Remotes
When you run `git push`, it will push to both remotes automatically:
```bash
git push
```

### Individual Remote Operations
If you need to push to a specific remote:
```bash
git push github main    # Push to GitHub only
git push ut main        # Push to UT Austin only (if configured as separate remote)
```

### Verify Remote Configuration
```bash
git remote -v
```

### Update GitHub URL
Replace the placeholder GitHub URL with your actual repository:
```bash
git remote set-url github git@github.com:yourusername/cii-llm-frontend.git
```