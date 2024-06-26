import React, { useState, useEffect } from "react";
import { getDatabase, ref, push } from "firebase/database";
import { useParams, useNavigate } from "react-router-dom";
import { getData } from "../../db/realtimeDatabase";
// Import Bootstrap CSS in your main file if not already imported
// import 'bootstrap/dist/css/bootstrap.min.css';

const AddProjectForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    users: [{ userId: "", role: "" }], // Start with one empty user-role pair
  });
  const [availableUsers, setAvailableUsers] = useState([]);
  const [roles] = useState(["Project Owner", "Scrum Master", "Development Team Member"]);
  const navigate = useNavigate();


  useEffect(() => {
    // Fetch available users
    fetch("https://smrpo-acd88-default-rtdb.europe-west1.firebasedatabase.app/users.json")
        .then(res => res.json())
        .then((users) => {
          const usersArray = Object.keys(users).map(key => ({
            id: key,
            ...users[key]
          }));
          console.log(usersArray);
          return usersArray;
        })
      .then(setAvailableUsers);
  }, []);

  const handleUserChange = (index, value) => {
    const newUsers = [...formData.users];
    newUsers[index].userId = value;
    setFormData({ ...formData, users: newUsers });
  };

  const handleRoleChange = (index, value) => {
    const newUsers = [...formData.users];
    newUsers[index].role = value;
    setFormData({ ...formData, users: newUsers });
  };

  const addAnotherUser = () => {
    setFormData({
      ...formData,
      users: [...formData.users, { userId: "", role: "" }],
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validation function
  const validateRoles = () => {
    // Adjust role counts based on your application's rules
    const roleAssignments = { PO: 0, KBM: 0, DOM: 0 };

    formData.users.forEach(user => {
      if (user.role === "Project Owner") roleAssignments.PO += 1;
      if (user.role === "Scrum Master") roleAssignments.KBM += 1;
      if (user.role === "Development Team Member") roleAssignments.DOM += 1;
    });

    // Validate unique roles (PO and KBM) and ensure DOM role can have multiples
    const isValidPO = roleAssignments.PO === 1; // Exactly one PO
    const isValidKBM = roleAssignments.KBM == 1; // At most one KBM
    const isValidDOM = roleAssignments.DOM > 0;
    // No need to validate DOM explicitly unless you have a minimum number required

    return isValidPO && isValidKBM && isValidDOM;
  };

  const checkProjectName = async (newName) => {
    try {
      // Fetch all projects data
      const projectsSnapshot = await getData('/projects');
      const projectsData = Object.values(projectsSnapshot);

      // Check if the new name is already taken
      const nameExists = projectsData.some(project => project.name === newName);

      console.log(newName)
      console.log(nameExists)
      return nameExists
      
    } catch (error) {
      console.error('Error checking or updating project name:', error);
      // Handle error (e.g., display an error message to the user)
    }
  };




  const handleSubmit = async (e) => {
    
    e.preventDefault();

    if (!validateRoles()) {
      alert("Please ensure the roles are correctly assigned according to the rules.");
      return;
    }

    try {
      const nameExists = await checkProjectName(formData.name);
      if (nameExists) {
        alert("Project name is already taken.");
        return;
      }

      // Prepare project data with users formatted correctly
      const projectData = {
        name: formData.name,
        description: formData.description,
        users: formData.users.reduce((acc, user) => {
          acc[user.userId] = (acc[user.userId] || []).concat(user.role);
          return acc;
        }, {})
      };

      const db = getDatabase();
      push(ref(db, 'projects'), projectData)
        .then(() => {
          alert("Project added successfully");
          navigate("/home");
        })
        .catch((error) => {
          console.error("Failed to add project:", error);
          alert("Failed to add project: " + error.message);
        });

    } catch (error) {
      console.error("Error while handling project submission:", error);
      alert("Error while handling project submission. Please try again.");
    }
};





  return (
    <div className="container mt-5">
      <h1 className="mb-4">Add Project</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="projectName" className="form-label">Project Name:</label>
          <input
            type="text"
            className="form-control"
            id="projectName"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Project Description:</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        {formData.users.map((userRole, index) => (
          <div key={index} className="mb-3">
            <select className="form-select mb-2" value={userRole.userId} onChange={(e) => handleUserChange(index, e.target.value)}>
              <option value="">Select a User</option>
              {availableUsers.map((user) => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
            <select className="form-select" value={userRole.role} onChange={(e) => handleRoleChange(index, e.target.value)}>
              <option value="">Select Role</option>
              {roles.map((role, roleIndex) => (
                <option key={roleIndex} value={role}>{role}</option>
              ))}
            </select>
          </div>
        ))}
        <div className="mb-3">
          <button type="button" className="btn btn-primary me-2" style={{backgroundColor:"#f0f0f0", color:"black", border: "1px solid black", marginRight: "20px"}} onClick={addAnotherUser}>Add Another User</button>
          <button type="submit" className="btn btn-success">Add Project</button>
        </div>
      </form>
    </div>
  );
};

export default AddProjectForm;

