require("dotenv").config({ path: ".env" });
const express = require("express");
const cors = require("cors");
const supabase = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3211;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;

const db = supabase.createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

// GET all projects
app.get("/projects", async (req, res) => {
  try {
    const { data, error } = await db.from("projects").select("*");
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create a new project
app.post("/projects", async (req, res) => {
  try {
    const projectData = req.body;
    const { data, error } = await db
      .from("projects")
      .insert(projectData)
      .select();

    if (error) throw error;

    res.status(201).json({
      msg: "Project successfully created",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "An error occurred while creating the project",
    });
  }
});

// PUT update a project
app.put("/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const projectData = req.body;

    const { data, error } = await db
      .from("projects")
      .update(projectData)
      .eq("id", id)
      .select();

    if (error) throw error;

    res.json({
      msg: "Project successfully updated",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "An error occurred while updating the project",
    });
  }
});

// DELETE a project
app.delete("/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await db.from("projects").delete().eq("id", id);

    if (error) throw error;

    res.json({
      msg: "Project successfully deleted",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "An error occurred while deleting the project",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
