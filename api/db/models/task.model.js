const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        index: true
    },
    date: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    _userId: {
        type: mongoose.Types.ObjectId,
        required: true
    }
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = {
    Task
};