export const formatearHora = (hora24) => {
  if (!hora24) return "";
  const [hora, minutos] = hora24.split(":");
  let h = parseInt(hora, 10);
  const periodo = h >= 12 ? "PM" : "AM";
  h = h % 12;
  h = h === 0 ? 12 : h;
  return `${h}:${minutos} ${periodo}`;
};