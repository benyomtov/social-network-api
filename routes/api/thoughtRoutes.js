const router = require('express').Router();

const {

    getThoughts,
    getOneThought,
    addThought,
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction,

} = require('../../controllers/thoughtController');

router.route('/')
.get(getThoughts)
.post(addThought);

router.route('/:thoughtId')
.get(getOneThought)
.put(updateThought)
.delete(deleteThought);

router.route('/:thoughtId/reactions')
.post(addReaction);

router.route('/:thoughtId/reactions/:reactionId')
.delete(deleteReaction);
