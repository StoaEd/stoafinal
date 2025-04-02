"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";

export default function ProjectCreator() {
  const [projects, setProjects] = useState<{ id: string; name: string; description: string; url?: string; type: string }[]>([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [projectType, setProjectType] = useState<"coding" | "manager">("coding");
  const [editingProject, setEditingProject] = useState<{ id: string; name: string; description: string } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Real-time sync with Firestore
    const unsubscribe = onSnapshot(collection(db, "projects"), (snapshot) => {
      const projectsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() as { name: string; description: string; url?: string; type: string } }));
      setProjects(projectsData);
    });

    return () => unsubscribe();
  }, []);

  const createProject = async () => {
    if (!newProjectName.trim() || !newProjectDescription.trim()) return;

    let projectUrl = "";
    if (projectType === "coding") {
      projectUrl = "https://idx.google.com/new/blank"; // Coding-related project URL
      window.open(projectUrl, "_blank");
    }

    saveProject(newProjectName, newProjectDescription, projectUrl, projectType);
    setNewProjectName("");
    setNewProjectDescription("");
  };

  const saveProject = async (name: string, description: string, url: string, type: string) => {
    try {
      const docRef = await addDoc(collection(db, "projects"), { name, description, url, type });
      setProjects([...projects, { id: docRef.id, name, description, url, type }]);
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const updateProject = async (id: string, name: string, description: string) => {
    try {
      await updateDoc(doc(db, "projects", id), { name, description });
      setProjects(projects.map((proj) => (proj.id === id ? { ...proj, name, description } : proj)));
      setEditingProject(null);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await deleteDoc(doc(db, "projects", id));
      setProjects(projects.filter((proj) => proj.id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <div className="p-12 max-w-6xl mx-auto space-y-8 bg-black text-white shadow-xl rounded-lg w-full min-h-screen">
      <h1 className="text-4xl font-bold text-center">Project Creator</h1>

      {/* Project Type Selection */}
      <div className="border-t border-gray-700 pt-6 w-2/3 mx-auto">
        <h2 className="text-3xl font-bold">Create Project</h2>
        <div className="space-y-4">
          <select
            value={projectType}
            onChange={(e) => setProjectType(e.target.value as "coding" | "manager")}
            className="p-4 w-full bg-gray-900 text-white rounded-lg"
          >
            <option value="coding">Coding Project</option>
            <option value="manager">Project Manager</option>
          </select>

          <Input
            className="border p-4 rounded-lg w-full text-xl bg-gray-900 text-white"
            placeholder="Enter project name..."
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
          <Input
            className="border p-4 rounded-lg w-full text-xl bg-gray-900 text-white"
            placeholder="Enter project description..."
            value={newProjectDescription}
            onChange={(e) => setNewProjectDescription(e.target.value)}
          />
          <Button onClick={createProject} className="w-full bg-purple-500 text-white py-4 rounded-lg text-xl">
            Create Project
          </Button>
        </div>
      </div>

      {/* Display Projects */}
      <div className="border-t border-gray-700 pt-6 w-2/3 mx-auto">
        <h2 className="text-3xl font-bold">Your Projects</h2>
        <ul className="space-y-4">
          {projects.map((proj) => (
            <li key={proj.id} className="border p-6 rounded-lg bg-gray-900 shadow-lg text-xl">
              {editingProject?.id === proj.id ? (
                <>
                  <Input
                    value={editingProject.name}
                    onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                  />
                  <Input
                    value={editingProject.description}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  />
                  <Button onClick={() => updateProject(editingProject.id, editingProject.name, editingProject.description)} className="bg-blue-500">
                    Save
                  </Button>
                </>
              ) : (
                <>
                  <div>
                    <strong className="text-white">{proj.name}</strong>: {proj.description}
                    {proj.type === "coding" && (
                      <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline ml-2">
                        Open Project
                      </a>
                    )}
                  </div>
                  <Button onClick={() => setEditingProject(proj)} className="ml-4 bg-yellow-500">
                    Edit
                  </Button>
                  <Button onClick={() => deleteProject(proj.id)} className="ml-4 bg-red-500">
                    Delete
                  </Button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
