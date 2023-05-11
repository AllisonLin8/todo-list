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
        },
        raw: true,
        nest: true
    })
        .then(todo => res.render('detail', { todo }))
        .catch(err => console.log(err))
})
router.get('/:id/edit', (req, res) => {
    const id = req.params.id
    const UserId = req.user.id
    return Todo.findOne({
        where: {
            id,
            UserId
        },
        raw: true,
        nest: true
    })
        .then(todo => res.render('edit', { todo }))
        .catch(err => console.log(err))
})
router.put('/:id', (req, res) => {
    const id = req.params.id
    const UserId = req.user.id
    const { name, isDone } = req.body
    if (!name) {
        req.flash('warning_msg', '待辦事項欄位為必填。')
        res.redirect(`/todos/${id}/edit`)
    }
    return Todo.update({ name, isDone: isDone === "on" }, {
        where: {
            id,
            UserId
        }
    }
    )
        .then(() => res.redirect(`/todos/${id}`))
        .catch(err => console.log(err))
})
router.delete('/:id', (req, res) => {
    const id = req.params.id
    const UserId = req.user.id
    return Todo.destroy({
        where: {
            id,
            UserId
        }
    })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
})

module.exports = router