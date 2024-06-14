fetch('http://localhost:8084/api/refresh')
.then(res => {
	console.log('refreshed', res)
})

setInterval(
  () => {
    fetch('http://localhost:8084/api/refresh');
  },
  1000 * 60 * 60 * 24
);
