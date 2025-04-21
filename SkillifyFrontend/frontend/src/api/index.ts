// src/api/index.ts
import { User } from "../models/user";
import { INewRequest, IRequest, Request } from "../models/request";
import { ISkill } from "../models/ISkill";
import axios from "axios";
import { INewUser, IUser } from "../models/IUser";

const baseurl = "https://skillify-development.up.railway.app";

// Function to fetch the list of skills
export const fetchSkills = async () => {
  try {
    const response = await axios.get<ISkill[]>(`${baseurl}/api/skills`);
    console.log("Skills:", response.data);
    return response.data; // Return the list of skills
  } catch (error) {
    console.error("Error fetching skills:", error);
    throw error;
  }
};

// Function to fetch the list of users based on skill
export const fetchUsersBySkill = async (skill: string) => {
  try {
    const response = await axios.get<IUser[]>(`${baseurl}/api/users/skill`, {
      headers: {
        skill: skill,
      },
    });
    return response.data; // Return the list of users
  } catch (error) {
    console.error("Error fetching users by skill:", error);
    throw error;
  }
};

// Function to submit a request
export const submitRequest = async (requestData: INewRequest) => {
  try {
    console.log("Submitting request:", requestData);
    const response = await axios.post<IRequest>(
      `${baseurl}/api/requests/new`,
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
          sender: requestData.createdBy,
          receiver: requestData.createdFor,
          title: requestData.title,
          description: requestData.description,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error submitting request:", error);
    throw error;
  }
};

export const fetchUser = async (username: string) => {
  try {
    const response = await axios.get(`${baseurl}/api/user`, {
      headers: {
        username: username,
      },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const createUser = async (user: INewUser) => {
  try {
    console.log("Creating user:", user.username);
    const response = await axios.post<IUser>(`${baseurl}/api/users/new`, null, {
      headers: {
        username: user.username,
        email: user.email,
        name: user.name,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateUser = async (user: IUser) => {
  try {
    const response = await axios.put<IUser>(`${baseurl}/api/users`, user, {
      headers: {
        "Content-Type": "application/json",
        username: user.username,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Function to fetch all requests that a user made
export const fetchMyRequests = async (username: string) => {
  try {
    const response = await axios.get<IRequest[]>(
      `${baseurl}/api/requests/sent`,
      {
        headers: {
          username: username,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching requests:", error);
    throw error;
  }
};

export const fetchRequestsForMe = async (username: string) => {
  try {
    const response = await axios.get<IRequest[]>(
      `${baseurl}/api/requests/received`,
      {
        headers: {
          username: username,
        },
      }
    );
    return response.data;
    // return dummyActivities;
  } catch (error) {
    console.error("Error fetching requests:", error);
    throw error;
  }
};

export const updateRequestStatus = async (
  request_id: string,
  newStatus: string
) => {
  try {
    let endpoint = "";
    console.log("Updating request status:", request_id, newStatus);
    if (newStatus === "accept") {
      endpoint = `${baseurl}/api/requests/accept`;
    } else if (newStatus === "deny") {
      endpoint = `${baseurl}/api/requests/deny`;
    }

    const response = await axios.put<IRequest>(
      endpoint,
      {},
      {
        headers: {
          request_id: request_id,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating request status:", error);
    throw error;
  }
};
