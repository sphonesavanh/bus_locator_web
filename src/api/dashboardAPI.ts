export const fetchDashboardSummary = async () => {
  const res = await fetch("http://localhost:4000/api/dashboard");
  return res.json();
}

export const fetchBusDetails = async () => {
  const res = await fetch("http://localhost:4000/api/busDash");
  return res.json();
}

export const fetchDriverDetails = async () => {
  const res = await fetch("http://localhost:4000/api/driverDash");
  return res.json();
}