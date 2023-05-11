const express = require('express')
const router = express.Router()
const db = require('../../models')
const Todo = db.Todo
const User = db.User
router.get('/new', (req, res) => {
    return res.render('new')
})
router.post('/', (req, res) => {
    const name = req.body.name
    const UserId = req.user.id
    const errors = []
    if (!name) {
        errors.push({ message: '請填入待辦事項。' })
    }
    if (errors.length) {
        return res.render('new', { errors })
    }
    return Todo.create({ name, UserId })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
})
router.get('/:id', (req, res) => {
    const id = req.params.id
    const UserId = req.user.id
    return Todo.findOne({
        where: {
            id,
            UserId
        }
    })
        .then(todo => res.render('detail', { todo: todo.toJSON() }))
        .catch(err => console.log(err))
})

module.exports = router