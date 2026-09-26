import express from 'express';
const app = express();
const PORT = 3000;

// Middleware สำหรับแปลง Request Body เป็น JSON
app.use(express.json());

// 1. Array ข้อมูลอย่างน้อย 4 ตัว
let TODOS = [
  { id: 1, title: 'Learn Node.js', done: true, priority: 'high' },
  { id: 2, title: 'Learn Express.js', done: false, priority: 'high' },
  { id: 3, title: 'Do Workshop Week 5', done: false, priority: 'medium' },
  { id: 4, title: 'Test with Postman', done: false, priority: 'low' }
];

// 3. Middleware function validateTodo
const validateTodo = (req, res, next) => {
  const { title, done, priority } = req.body;
  if (!title || done === undefined || !priority) {
    return res.status(400).json({ 
      message: 'Missing required fields: title, done, and priority are required.' 
    });
  }
  next();
};

// 2. Group Router ชื่อ todoRouter
const todoRouter = express.Router();

// 1) Method GET: /health
todoRouter.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 2) Method GET: / (เรียกข้อมูลทั้งหมด)
todoRouter.get('/', (req, res) => {
  res.json(TODOS);
});

// 3) Method GET: /:id (เรียกข้อมูลเฉพาะ id นั้นๆ)
todoRouter.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = TODOS.find(t => t.id === id);

  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  res.json(todo);
});

// 4) Method POST: /todos (หรือ / เมื่อ mount ภายใต้ /api/v1/todos)
// หมายเหตุ: ตามโจทย์ หากตั้ง app.use("/api/v1/todos", todoRouter) แล้ว
// Path ใน router ตรงนี้ใช้ "/" หรือ "/todos" ขึ้นอยู่กับการออกแบบ API 
// ในที่นี้กำหนดเป็น "/" เพื่อให้เมื่อยิง POST ไปที่ /api/v1/todos จะทำงานตรงกัน
todoRouter.post('/', validateTodo, (req, res) => {
  const { title, done, priority } = req.body;
  
  const newTodo = {
    id: TODOS.length > 0 ? TODOS[TODOS.length - 1].id + 1 : 1,
    title,
    done,
    priority
  };

  TODOS.push(newTodo);
  res.status(201).json(newTodo);
});

// Mount router ไปที่ /api/v1/todos
app.use('/api/v1/todos', todoRouter);

// 4. รันบน port 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});