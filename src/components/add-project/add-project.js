import React, { useState } from "react";

const AddProjectForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    users: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const projectData = {
      ...formData,
      created_at: new Date().toISOString(), // Add the creation date
    };

    try {
      const response = await fetch(
        "http://localhost:3001/api/projects/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(projectData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
      } else {
        const errorData = await response.json();
        alert(errorData.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <h1>Add Project</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Project Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <br />
        <br />
        <label htmlFor="description">Project Description:</label>
        <br />
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>
        <br />
        <br />
        <label htmlFor="users">Users:</label>
        <input
          type="text"
          id="users"
          name="users"
          value={formData.users}
          onChange={handleChange}
          required
        />
        <br />
        <br />
        <button type="submit">Add Project</button>
      </form>
    </div>
  );
};

export default AddProjectForm;
