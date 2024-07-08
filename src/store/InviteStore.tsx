import axios from "axios";

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
    const response = await axios.post(
      `http://localhost:8080/api/v1/group/invite?user.id=${userId}`,
      {
        email,
        groupId,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error inviting user to group:", error);
    throw error;
  }
};
