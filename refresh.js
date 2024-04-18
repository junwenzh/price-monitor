setInterval(
  () => {
    fetch('http://localhost:8084/api/refresh');
  },
  1000 * 60 * 60 * 24
);
