const express = require('express');
const router = express.Router();

router.get('/:file', (req, res) => {
    const file = req.params.file;
    res.render(file);
});


module.exports = router;