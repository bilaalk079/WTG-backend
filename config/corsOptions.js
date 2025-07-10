const corsOption = {
    origin: 'https://front-end-task-hero.vercel.app',
    methods: 'PUT,DELETE,POST,GET',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    exposedHeaders: ['Authorization'],
}

export default corsOption