import express from "express";
import pgk  from "pg";
import cors from "cors";
import bcrypt from "bcrypt";
import path from "path";
import { fileURLToPath } from 'url';

const app = express();
const {Pool} = pgk;
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const pool = new Pool({
    user: 'postgres',
    host:'localhost',
    database: 'autodiag',
    password: 'Bescious_98',
    port:5432,
})

pool.connect();


app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.post('/api/post', async(req,res)=>{
    const {name,email,password_hash,category} = req.body
    try{
        const hashedPassword= await bcrypt.hash(password_hash,10)
        const insertQuery = `
            INSERT INTO users (name, email , password_hash, category)
            VALUES($1, $2, $3, $4)
            RETURNING id, name, email, category;
             
        `;
        const newUser = await pool.query(insertQuery, [name, email, hashedPassword, category]);
        res.status(201).json({
            message: 'User registered successfully',
            user: newUser.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        if (err.code === '23505') { 
            return res.status(400).json({ error: 'An account with this email already exists.' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/login', async(req,res)=>{
   const {email, password_hash} = req.body;

 
   try{
    const userSign = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

    if(userSign.rows.length === 0){
        return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = userSign.rows[0];

    console.log('Found User in DB:', user.email);
        console.log('Entered Password:', password_hash);
        console.log('Stored DB Hash:', user.password_hash);

    const isPasswordValid = await bcrypt.compare(password_hash, user.password_hash);

    if(!isPasswordValid){
        return res.status(400).json({ error: 'Invalid email or password' });
    }
    res.status(200).json({
        message: 'Login successful',
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            category: user.category
        }
    }); 

}  
 catch (err) {
        console.error('Login database error:', err.message);
        res.status(500).json({ error: 'Internal server error' });

}
});


app.listen(port, () => {
    console.log('Server running on port 3000');
});
