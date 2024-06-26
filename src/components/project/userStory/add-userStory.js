import React, {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {addData, getData} from "../../../db/realtimeDatabase";
import "./add-userStory.css";
const AddUserStory = () => {
    const navigate = useNavigate();
    const {projectId} = useParams();
    const [priority] = useState(["Must Have", "Could Have", "Should Have", "Won't have this time"]);
    const [businessValue] = useState(["1", "2", "3","4", "5", "6","7", "8", "9","10"]);
    const [status] = useState(["Unrealised", "Realised_Unassigned", "Realised_Assigned"]);
     const [formData, setFormData] = useState({
        userStoryName: "",
        projectId: projectId,
        description: "",
        test: "",
        priority: "Must Have",
        businessValue: "1",
        status: "Unrealised",
         time_estimate: 0,
         notes:""
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: name === "time_estimate" ? parseInt(value, 10) || 0 : value
        }));
    };
    const handleAddTask = () => {
        navigate(`/projects/add-task/${projectId}`);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userStoryData = {
            userStoryName: formData.userStoryName,
            projectId: formData.projectId,
            description: formData.description,
            test: formData.test,
            priority: formData.priority,
            businessValue: formData.businessValue,
            status: formData.status,
            time_estimate: formData.time_estimate,
            notes: formData.notes
        };

        const existingUserStories = await getData("/userStory");

        // Check for duplicate userStoryName
        let duplicateFound = false;
        if (existingUserStories) {
            for (const key in existingUserStories) {
                if (existingUserStories[key].projectId === userStoryData.projectId && existingUserStories[key].userStoryName === userStoryData.userStoryName) {
                    duplicateFound = true;
                    break;
                }
            }
        }

        if (duplicateFound) {
            alert("User story with this name already exists");
        } else {
            try {
                const storyId = await addData("/userStory", userStoryData);
                alert("Story added successfully");
                navigate(`/project/${projectId}`);

            } catch (error) {
                console.error("Error adding new story:", error);
                alert("Failed to add story");
            }
        }
    };


    return (
        <div className="container">
            <div className="card">
                <h4 className="card-title">Add Story</h4>
                <form onSubmit={handleSubmit}>
                    <div className="form-group1">
                        <label htmlFor="userStoryName">Story Name:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="userStoryName"
                            name="userStoryName"
                            value={formData.userStoryName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group1">
                        <label htmlFor="description">Description:</label>
                        <textarea
                            className="form-control"
                            name="description"
                            id="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>

                    <div className="form-group1">
                        <label htmlFor="test">Test:</label>
                        <textarea
                            className="form-control"
                            name="test"
                            id="test"
                            value={formData.test}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>
                    <div className="child">
                        <label htmlFor="priority">Priority:</label>
                        <select
                            className="form-control"
                            name="priority"
                            id="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            required
                        >
                            {priority.map((value, index) => (
                                <option key={index} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="child">
                        <label htmlFor="businessValue">Business Value:</label>
                        <select
                            className="form-control"
                            name="businessValue"
                            id="businessValue"
                            value={formData.businessValue}
                            onChange={handleChange}
                            required
                        >
                            {businessValue.map((value, index) => (
                                <option key={index} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="child">
                        <button className=" form-control btn btn-primary mr-3 btn-secondary" onClick={handleAddTask}>
                            Add task
                            <i className="fa-solid fa-plus"></i>
                        </button>
                    </div>
                    <div className="form-group2">
                        <label htmlFor="time_estimate">Time Estimate:</label>
                        <div className="input-wrapper">
                            <input
                                className="form-control"
                                name="time_estimate"
                                id="time_estimate"
                                value={formData.time_estimate}
                                onChange={handleChange}
                            />
                            <span className="pts-label">pts</span>
                        </div>
                    </div>

                    <div className="button-wrapper">
                        <button className="btn btn-primary mr-3 add-button">Add Story</button>
                        <button className="btn btn-danger delete-button">Delete</button>
                    </div>
                </form>
            </div>
        </div>
    );



}

export default AddUserStory;