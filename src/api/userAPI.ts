export interface UserData {
  id: string;
  name: string;
  email: string;
  tel: string;
  password: string;
}

// Call backend
export async function fetchUsers(): Promise<UserData[]> {
  const response = await fetch("http://localhost:4000/api/users");
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  const data = await response.json();

  // Map backend response to match frontend UserData
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((user: any) => ({
    id: user.user_id,
    name: user.user_name,
    email: user.user_email,
    tel: user.user_tel,
    password: user.user_password || "", // Optional chaining for password
  }));
}
  