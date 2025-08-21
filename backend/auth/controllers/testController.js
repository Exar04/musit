const test = async (req, res) => {
    res.status(200).json({ message: 'Test route is working' });
};

export { test }