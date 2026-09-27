import noteModel from "../../DB/models/note.model.js";
import mongoose from "mongoose";

export const createNote = async (req, res, next) => {
    try {

        const newNote = await noteModel.create({
            title: req.body.title,
            content: req.body.content,
            userId: req.query.userId
        })

        return res.status(201).json({
            message: "Note created successfully",
            data: newNote
        });


    } catch (error) {

        return res.status(500).json({
            message: " Could'nt create Note",
            error: error.message
        });

    }
};

export const updateNote = async (req, res, next) => {

    try {

        const note = await noteModel.findById(req.params.noteId);

        if (!note) {

            return res.status(404).json({
                message: "Note not found"
            });
        }

        if (note.userId.toString() !== req.query.userId) {

            return res.status(403).json({
                message: "You are not the owner of this note"
            });
        }

        const updatedNote = await noteModel.findByIdAndUpdate(
            req.params.noteId,
            req.body,
            { returnDocument: "after" }
        );

        return res.status(200).json({
            message: "Note updated successfully",
            data: updatedNote
        });

    } catch (error) {

        return res.status(500).json({
            message: "Couldn't update note",
            error: error.message
        });
    }
};

export const replaceNote = async (req, res, next) => {

    try {

        const note = await noteModel.findById(req.params.noteId);

        if (!note) {

            return res.status(404).json({
                message: "Note not found"
            });
        }

        if (note.userId.toString() !== req.query.userId) {

            return res.status(403).json({
                message: "You are not the owner of this note"
            });
        }

        const replacedNote = await noteModel.findOneAndReplace(
            { _id: req.params.noteId },
            {
                title: req.body.title,
                content: req.body.content,
                userId: req.query.userId
            },
            { returnDocument: "after" }
        );

        return res.status(200).json({
            message: "Note replaced successfully",
            data: replacedNote
        });

    } catch (error) {

        return res.status(500).json({
            message: "Couldn't replace note",
            error: error.message
        });
    }
};

export const updateAllNotes = async (req, res, next) => {

    try {

        const result = await noteModel.updateMany(
            { userId: req.query.userId },
            { title: req.body.title }
        );

        return res.status(200).json({
            message: "All notes updated successfully",
            data: result
        });

    } catch (error) {

        return res.status(500).json({
            message: "Couldn't update notes",
            error: error.message
        });
    }
};

export const deleteNote = async (req, res, next) => {

    try {

        const note = await noteModel.findById(req.params.noteId);

        if (!note) {

            return res.status(404).json({
                message: "Note not found"
            });
        }

        if (note.userId.toString() !== req.query.userId) {

            return res.status(403).json({
                message: "You are not the owner of this note"
            });
        }

        const deletedNote = await noteModel.findByIdAndDelete(
            req.params.noteId
        );

        return res.status(200).json({
            message: "Note deleted successfully",
            data: deletedNote
        });

    } catch (error) {

        return res.status(500).json({
            message: "Couldn't delete note",
            error: error.message
        });
    }
};

export const paginateAndSortNotes = async (req, res, next) => {

    try {

        const notes = await noteModel.find({
            userId: req.query.userId
        })
        .sort({ createdAt: -1 })
        .skip(req.query.page)
        .limit(req.query.limit);

        return res.status(200).json({
            message: "Notes fetched successfully",
            data: notes
        });

    } catch (error) {

        return res.status(500).json({
            message: "Couldn't fetch notes",
            error: error.message
        });
    }
};

export const getNoteById = async (req, res, next) => {

    try {

        const note = await noteModel.findById(req.params.id);

        if (!note) {

            return res.status(404).json({
                message: "Note not found"
            });
        }

        if (note.userId.toString() !== req.query.userId) {

            return res.status(403).json({
                message: "You are not the owner of this note"
            });
        }

        return res.status(200).json({
            message: "Note fetched successfully",
            data: note
        });

    } catch (error) {

        return res.status(500).json({
            message: "Couldn't fetch note",
            error: error.message
        });
    }
};

export const getNoteByContent = async (req, res, next) => {

    try {

        const note = await noteModel.findOne({
            content: req.query.content,
            userId: req.query.userId
        });

        if (!note) {

            return res.status(404).json({
                message: "Note not found"
            });
        }

        return res.status(200).json({
            message: "Note fetched successfully",
            data: note
        });

    } catch (error) {

        return res.status(500).json({
            message: "Couldn't fetch note",
            error: error.message
        });
    }
};

export const getNotesWithUser = async (req, res, next) => {

    try {

        const notes = await noteModel.find(
            { userId: req.query.userId },
            {
                title: 1,
                userId: 1,
                createdAt: 1,
                _id: 0
            }
        ).populate("userId", "email");

        return res.status(200).json({
            message: "Notes fetched successfully",
            data: notes
        });

    } catch (error) {

        return res.status(500).json({
            message: "Couldn't fetch notes",
            error: error.message
        });
    }
};

export const aggregateNotes = async (req, res, next) => {

    try {

        const match = {
            userId: new mongoose.Types.ObjectId(req.query.userId)
        };

        if (req.query.title) {
            match.title = req.query.title;
        }

        const notes = await noteModel.aggregate([
            {
                $match: match
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $project: {
                    title: 1,
                    content: 1,
                    createdAt: 1,
                    "user.name": 1,
                    "user.email": 1
                }
            }
        ]);

        return res.status(200).json({
            message: "Notes fetched successfully",
            data: notes
        });

    } catch (error) {

        return res.status(500).json({
            message: "Couldn't fetch notes",
            error: error.message
        });
    }
};

export const deleteAllNotes = async (req, res, next) => {

    try {

        const result = await noteModel.deleteMany({
            userId: req.query.userId
        });

        return res.status(200).json({
            message: "All notes deleted successfully",
            data: result
        });

    } catch (error) {

        return res.status(500).json({
            message: "Couldn't delete notes",
            error: error.message
        });
    }
};