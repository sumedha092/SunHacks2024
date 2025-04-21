import { useState, FormEvent } from "react";
import { useRouter } from "next/router";

// Simulate the current logged-in user ID
const currentUserId = "user_123"; // Replace with your actual logged-in user ID

const PostActivity: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [requestType, setRequestType] = useState<string>("micro-assistance");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();
  const { username } = router.query;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Activity data object
    const activityData = {
      title,
      description,
      requestType,
      createdBy: currentUserId,
      acceptedBy: null,
      status: "open",
    };

    try {
      console.log("Activity posted:", activityData);
      setTitle("");
      setDescription("");
      setRequestType("micro-assistance");
      setSuccessMessage("Activity posted successfully!");

      setTimeout(() => {
        router.push("/activities"); // Redirect to the activities list page
      }, 2000);
    } catch (error) {
      console.error("Error posting activity:", error);
    }
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <div
        className="card shadow-lg border-0"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Post a New Activity</h2>
          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Activity Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="form-control"
                placeholder="Enter activity title"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="form-control"
                rows={4}
                placeholder="Describe the activity..."
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="requestType" className="form-label">
                Request Type
              </label>
              <select
                id="requestType"
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                required
                className="form-select"
              >
                <option value="micro-assistance">Micro Assistance</option>
                <option value="skill-swap">Skill Swap</option>
              </select>
            </div>
            <div className="d-flex justify-content-center">
              <button type="submit" className="btn btn-primary w-100">
                Post Activity
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostActivity;
