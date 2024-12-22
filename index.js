import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let posts = []; // Array untuk menyimpan posting sementara

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Welcome to My Blog' });
});

app.get('/home', (req, res) => {
    res.render('home', { title: 'All Posts', posts });
});

app.get('/form', (req, res) => {
    res.render('form', { title: 'Create New Post', post: null });
});

app.post('/form', (req, res) => {
    const { title, content } = req.body;
    posts.push({ id: Date.now(), title, content });
    res.redirect('/home');
});

app.get('/edit/:id', (req, res) => {
    const post = posts.find(p => p.id == req.params.id);
    res.render('form', { title: 'Edit Post', post });
});

app.post('/edit/:id', (req, res) => {
    const { id, title, content } = req.body;
    const postIndex = posts.findIndex(p => p.id == id);
    if (postIndex !== -1) {
        posts[postIndex] = { id: Number(id), title, content };
    }
    res.redirect('/home');
});

app.post('/delete/:id', (req, res) => {
    posts = posts.filter(p => p.id != req.params.id);
    res.redirect('/home');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
