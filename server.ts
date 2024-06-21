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

// Delete endpoint
app.delete('/delete', (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    // Read existing submissions
    let submissions: any[] = [];
    if (fs.existsSync(submissionsFilePath)) {
        const submissionsData = fs.readFileSync(submissionsFilePath, 'utf8');
        submissions = JSON.parse(submissionsData);
    }

    // Filter out the submission with the given email
    const newSubmissions = submissions.filter(submission => submission.email !== email);

    if (newSubmissions.length === submissions.length) {
        return res.status(404).json({ error: 'No submission found for the given email' });
    }

    // Write updated submissions back to file
    fs.writeFileSync(submissionsFilePath, JSON.stringify(newSubmissions, null, 2));

    res.json({ message: 'Submission deleted successfully' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
