// server.ts
import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;
const submissionsFilePath = path.join(__dirname, 'submission.json');

app.use(express.json());

// Ping endpoint
app.get('/ping', (req: Request, res: Response) => {
    res.send('Server is running');
});

// Submit endpoint
app.post('/submit', (req: Request, res: Response) => {
    const { name, email, phoneNo, githubLink } = req.body;

    if (!name || !email || !phoneNo || !githubLink) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Read existing submissions
    let submissions: any[] = [];
    if (fs.existsSync(submissionsFilePath)) {
        const submissionsData = fs.readFileSync(submissionsFilePath, 'utf8');
        submissions = JSON.parse(submissionsData);
    }

    // Add new submission
    const newSubmission = { name, email, phoneNo, githubLink };
    submissions.push(newSubmission);

    // Write updated submissions back to file
    fs.writeFileSync(submissionsFilePath, JSON.stringify(submissions, null, 2));

    res.json({ message: 'Submission added successfully', submission: newSubmission });
});

// Read endpoint
app.get('/read', (req: Request, res: Response) => {
    if (fs.existsSync(submissionsFilePath)) {
        const submissionsData = fs.readFileSync(submissionsFilePath, 'utf8');
        const submissions = JSON.parse(submissionsData);
        res.json(submissions);
    } else {
        res.status(404).json({ error: 'No submissions found' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
