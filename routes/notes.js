const express = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");
const router = express.Router();

const noteSchema = Joi.object({
  title: Joi.string().min(5).required(),
  content: Joi.string().min(10).required(),
  label: Joi.string().min(5).required(),
});

const schemaValidator = (body) => {
  return noteSchema.validate(body);
};
const schema = new mongoose.Schema({
  title: String,
  content: String,
  label: String,
});
//model
const Note = mongoose.model("Note", schema);

router.post("/", (res, req) => {
  const { error } = schemaValidator(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const note = new Note({
    title: res.body.title,
    content: res.body.content,
    label: res.body.label,
  });
  note.save();
  return getNotes();
});
async function getNotes() {
  const pageNumber = 1;
  const pageSize = 10;
  const note = await Note.find()
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .sort("title")
    .select("title label content");
  return note;
}

router.delete("/:id", async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    return res.send(deletedNote);
  } catch (error) {
    return res.status(404).send("Note does not found");
  }
});

router.get("/", async (req, res) => {
  const data = await getNotes();
  return res.send(data);
});
router.get("/:id", async (req, res) => {
  try {
    const noteById = await Note.findById(req.params.id);
    return res.send(noteById);
  } catch (error) {
    return res.status(404).send("Please provide a valid ID");
  }
});
router.put("/:id", async (req, res) => {
  try {
    const { title, content, label } = req.body;
    if (!title && !content && !label) {
      return res.status(400).send("ERROR: Missing required field");
    }
    let note = await Note.findById(req.params.id);
    if (!note) {
      res.status(404).send("ERROR: Note not found");
    } else {
      note.title = title ? title : note.title;
      note.content = content ? content : note.content;
      note.label = label ? label : note.label;
      note.save();
      return res.send(note);
    }
  } catch (error) {
    return res.status(404).send("Error: Failed in update");
  }
});
module.exports = router;
