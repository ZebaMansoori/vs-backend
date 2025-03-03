// const express = require('express');
// const fs = require('fs');

// const app = express();
// const cors = require('cors');

// app.use(express.json());
// app.use(express.urlencoded({extended:true}));
// app.use(cors({
//     origin: ['http://localhost:3000','http://localhost:5173'],
//     methods: ['GET', 'POST'],
//     credentials: true,
//     allowedHeaders: ['Content-Type', 'Authorization']
//  }));

// app.get('/', (req, res) => {
    
//     res.send('Hello World');
// });

// app.post('/create', (req, res) => {
    
//     const {fileName, fileData} = req.body;
//     console.log(req.body);

//     const filePath = "./uploads/" + fileName;

//     fs.writeFile(filePath, fileName, (err) => {
//         if(err){
//             console.error(err);
//             res.send('Error creating file');
//         }
//         else{
//             res.send('File created successfully');
//         }

//     })
    
// });

// app.get('/read/:fileName', (req,res) => {
    
//     const fileName = req.params.fileName;

//     const filePath = "./uploads/" + fileName;

//     fs.readFile(filePath, 'utf8', (err, data) => {
//         if(err){
//             console.error(err);
//             res.send('Error reading file');
//         }
//         else{
//             res.send(data);
//         }
//     })    
// })

// app.patch('/update/:fileName', (req,res)=>{
    
//     const fileData = req.body.fileData
//     const fileName = req.params.fileName
//     const filePath = "./uploads/" + fileName;

//     fs.writeFile(filePath, fileData, (err) => {
//         if(err){
//             console.error(err);
//             res.send('Error updating file');
//         }
//         else{
//             res.send('File updated successfully');
//         }
//     })    
// })

// app.delete('/delete/:fileName', (req,res) => {
    
//     const fileName = req.params.fileName;
//     const filePath = "./uploads/" + fileName;

//     fs.unlink(filePath, (err) => {
//         if(err){
//             console.error(err);
//             res.send('Error deleting file');
//         }
//         else{
//             res.send('File deleted successfully');
//         }
//     }) 
// })   

// app.get('/get-all', (req,res) => {

//     fs.readdir("./uploads",(err, files) =>{
//         if(err){
//             console.error(err);
//             res.send('Error reading directory');
//         }
//         else{
//             res.send(files);
//         }
//     })
// })





// app.listen(3000, () =>{
//     console.log("Server is running on port 3000")
// })




const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const cors = require('cors');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true
}));

// Ensure "uploads" directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

app.get('/', (req, res) => {
    res.send('Hello World');
});

// Create a new file
app.post('/create', (req, res) => {
    const { fileName } = req.body;
    console.log("Received Request:", req.body);

    if (!fileName) {
        return res.status(400).json({ error: "fileName and fileData are required" });
    }

    const filePath = path.join(uploadDir, fileName);

    fs.writeFile(filePath,"", (err) => {
        if (err) {
            console.error("Error writing file:", err);
            return res.status(500).json({ error: "Error creating file" });
        }
        res.json({ message: "File created successfully", path: filePath });
    });
});

// Read a file
app.get('/read/:fileName', (req, res) => {
    const filePath = path.join(uploadDir, req.params.fileName);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(404).json({ error: "File not found" });
        }
        res.json({ fileName: req.params.fileName, content: data });
    });
});

// Update a file
app.patch('/update/:fileName', (req, res) => {
    const filePath = path.join(uploadDir, req.params.fileName);
    const { fileData } = req.body;

    if (!fileData) {
        return res.status(400).json({ error: "fileData is required" });
    }

    fs.writeFile(filePath, fileData, (err) => {
        if (err) {
            console.error("Error updating file:", err);
            return res.status(500).json({ error: "Error updating file" });
        }
        res.json({ message: "File updated successfully" });
    });
});

// Delete a file
app.delete('/delete/:fileName', (req, res) => {
    const filePath = path.join(uploadDir, req.params.fileName);

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error("Error deleting file:", err);
            return res.status(404).json({ error: "File not found" });
        }
        res.json({ message: "File deleted successfully" });
    });
});

// Get all files in the "uploads" directory
app.get('/get-all', (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            console.error("Error reading directory:", err);
            return res.status(500).json({ error: "Error reading directory" });
        }
        res.json({ files });
    });
});

// Start server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
