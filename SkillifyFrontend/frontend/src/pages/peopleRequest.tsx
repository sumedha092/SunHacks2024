// pages/peopleRequest.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { fetchRequestsForMe, updateRequestStatus } from "../api"; // Import your API function
import { IRequest, Request } from "../models/request";
import Link from "next/link";

const PeopleRequest: React.FC = () => {
  const [activities, setActivities] = useState<IRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { username } = router.query;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userActivities: IRequest[] = await fetchRequestsForMe(
            username as string
          ); // Fetch activities for the logged-in user
          setActivities(userActivities);
        } catch (error) {
          console.error("Error fetching activities:", error);
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/auth"); // Redirect to login page if not authenticated
      }
    });

    return () => unsubscribe();
  }, [router, username]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateRequestStatus(id, newStatus);
      setActivities((prevActivities) =>
        prevActivities.map((activity) =>
          activity._id === id ? { ...activity, status: newStatus } : activity
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div
      className="container-fluid vh-100 d-flex flex-column"
      style={{ backgroundColor: "#ffffff" }}
    >
      <h2
        className="text-center mb-4 mt-4"
        style={{ fontSize: "2rem", fontWeight: "bold", color: "#343a40" }}
      >
        Requests To Me
      </h2>
      <div className="row justify-content-center flex-grow-1">
        {activities.length === 0 ? (
          <div className="col text-center">
            <div className="alert alert-info" role="alert">
              No activities posted yet.
            </div>
          </div>
        ) : (
          activities.map((activity) => (
            <div className="col-md-3 mb-4" key={activity._id}>
              <div
                className="card border-0 shadow-sm"
                style={{ height: "30%" }}
              >
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-primary font-weight-bold mb-2">
                    {activity.title}
                  </h5>
                  <p className="card-text" style={{ flexGrow: 1 }}>
                    {activity.description}
                  </p>
                  <p className="card-text">
                    <small className="text-muted">
                      Status: {activity.status}
                    </small>
                  </p>
                  <select
                    className="form-select mt-auto"
                    value={activity.status}
                    onChange={(e) =>
                      handleStatusChange(activity._id, e.target.value)
                    }
                  >
                    <option value="accept">Accept</option>
                    <option value="deny">Deny</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="text-center mt-4 mb-4">
        <Link
          href={{
            pathname: "/dashboard",
            query: { username: username as string },
          }}
          className="btn btn-secondary"
        >
          Go Back
        </Link>
      </div>
    </div>
  );
};

export default PeopleRequest;
