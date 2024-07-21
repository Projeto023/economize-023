import axiosInstance from "../config/axiosConfig";

export const inviteToGroup = async ({
  email,
  groupId,
  userId,
}: {
  email: string;
  groupId: number;
  userId: number;
}) => {
  try {
    const response = await axiosInstance.post(
      `/api/v1/group/invite?user.id=${userId}`,
      {
        email,
        groupId,
      }
    );
    return response.data.records;
  } catch (error) {
    console.error("Error inviting user to group:", error);
    throw error;
  }
};
