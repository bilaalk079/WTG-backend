const corsOption = {
    origin: 'http://localost:5173',
    methods: 'PUT,DELETE,POST,GET',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    exposedHeaders: ['Authorization'],
}

export default corsOption