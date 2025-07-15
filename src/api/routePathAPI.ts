export const fetchRoutePath = async (routeId: string) => {
  const url =
    routeId === "R_ALL"
      ? "http://localhost:4000/api/route/all"
      : `http://localhost:4000/api/route/${routeId}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(
        `RoutePathAPI: ${url} ${response.status} ${response.statusText}`
      );
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
