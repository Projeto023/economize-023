import axiosInstance from "../config/axiosConfig";

export const createGroup = async ({
  userId,
  groupName,
}: {
  userId: number;
  groupName: string;
}) => {
  try {
    const response = await axiosInstance.post(
      `/api/v1/group?user.id=${userId}`,
      {
        name: groupName,
      }
    );
    return response.data.records;
  } catch (error) {
    console.error("Error inviting user to group:", error);
    throw error;
  }
};
