const apiBaseUrl = `${process.env.VITE_API_URL}/api/v1`
const formHeaders = {
  "Content-Type": "application/x-www-form-urlencoded",
}

const getAccessToken = async () => {
  const response = await fetch(`${apiBaseUrl}/login/access-token`, {
    method: "POST",
    headers: formHeaders,
    body: new URLSearchParams({
      username: process.env.FIRST_SUPERUSER!,
      password: process.env.FIRST_SUPERUSER_PASSWORD!,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to log in as the first superuser")
  }

  const data = await response.json()
  return data.access_token as string
}

export const createUser = async ({
  email,
  password,
}: {
  email: string
  password: string
}) => {
  const accessToken = await getAccessToken()
  const response = await fetch(`${apiBaseUrl}/users/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      full_name: "Test User",
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to create user: ${response.status}`)
  }

  return await response.json()
}
