export const fetchBusStopByRoute = async (routeId: string) => {
  try {
    const res = await fetch(
      `http://localhost:4000/api/bus-stop/${routeId}/busstops`
    );
    if (!res.ok) {
      throw new Error("Failed to fetch bus stops by route");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
