 function myfun(malk) {
  // Default options are marked with *
  console.log(malk)
  async function postData(url ,  data = {}) {
  const response = await fetch(url, {
    method: "PUT",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  });
  return response.json();
}

postData("SuaItem", { answer: malk })

.then((data) => {
  console.log(data); // JSON data parsed by `data.json()` call
});
}
