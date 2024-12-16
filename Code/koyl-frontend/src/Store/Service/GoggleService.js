const GoogleService = async (access_token) => {
  try {
    const response = await fetch(process.env.REACT_APP_GOGGLE_SERVICE_URL, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user info");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error; // Propagate the error further if needed
  }
};

export { GoogleService };
