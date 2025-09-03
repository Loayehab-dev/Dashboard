// document.getElementById("btn").addEventListener("click", async()=> {
//     //Get data from API
//     const response =  await fetch("https://jsonplaceholder.typicode.com/users");
//     //Convert to JSON
//     const users = await response.json();
   
//     //position to add data
// let list=document.querySelector(".list")
//     //reset old data
//     list.innerHTML='';
//     //get data from API
//     users.forEach(user => {
//         let li = document.createElement("li")
//         li.innerHTML = `
//       <h2>  ${user.name}</h2>
//       <p> [${user.email}]</p>`;
//         list.appendChild(li)
//     }); 
// });
document.getElementById("postform").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const body = document.getElementById("body").value;
  const id = 1;
  try {
    //send data to server
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify({
        title: title,
        body: body,
        userId: id
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
    const user = await response.json();
    document.getElementById("result").innerHTML = `
    <h2> ${user.title}</h2>
    <p> ${user.body}</p>
    <small> User ID: ${user.id}</small>
    `;
    console.log(user);
  } catch (error) {
    document.getElementById(
      "result"
    ).innerHTML = `<p style="color:red;"> An error occurred</p> ${error.message}`;
  }
});