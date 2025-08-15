const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/apiRoutes');
const apiOps = require('./routes/operations');
const statusRoutes = require('./routes/statusRoutes');

const app = express();
app.use(bodyParser.json());

// Enable CORS for the admin panel
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

// Add logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.use('/api', apiRoutes);
app.use('/liveapi', apiOps);
app.use('', statusRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('API Error:', error);
    res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`API Server running on port ${PORT}`);
});
