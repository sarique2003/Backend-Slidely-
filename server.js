"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const submissionsFilePath = path_1.default.join(__dirname, 'submission.json');
app.use(express_1.default.json());
// Ping endpoint
app.get('/ping', (req, res) => {
    res.send('Server is running');
});
// Submit endpoint
app.post('/submit', (req, res) => {
    const { name, email, phoneNo, githubLink } = req.body;
    if (!name || !email || !phoneNo || !githubLink) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    // Read existing submissions
    let submissions = [];
    if (fs_1.default.existsSync(submissionsFilePath)) {
        const submissionsData = fs_1.default.readFileSync(submissionsFilePath, 'utf8');
        submissions = JSON.parse(submissionsData);
    }
    // Add new submission
    const newSubmission = { name, email, phoneNo, githubLink };
    submissions.push(newSubmission);
    // Write updated submissions back to file
    fs_1.default.writeFileSync(submissionsFilePath, JSON.stringify(submissions, null, 2));
    res.json({ message: 'Submission added successfully', submission: newSubmission });
});
// Read endpoint
app.get('/read', (req, res) => {
    if (fs_1.default.existsSync(submissionsFilePath)) {
        const submissionsData = fs_1.default.readFileSync(submissionsFilePath, 'utf8');
        const submissions = JSON.parse(submissionsData);
        res.json(submissions);
    }
    else {
        res.status(404).json({ error: 'No submissions found' });
    }
});
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
