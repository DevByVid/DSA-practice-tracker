const form= document.querySelector("form");
const tableBody= document.getElementById("tableBody");
const dateInput= document.getElementById("date");
const filterStatus = document.getElementById("filterStatus");
const totalCount =document.getElementById("totalCount");
const solvedCount = document.getElementById("solvedCount");
const unsolvedCount = document.getElementById("unsolvedCount");
const progressBar = document.getElementById("progressBar");
const darkModeBtn = document.getElementById("darkModeToggle");


//console.log(form);
let entries=JSON.parse(localStorage.getItem("dsaEntries"))||[];

document.addEventListener("DOMContentLoaded", function () {
  renderTable();
});


form.addEventListener("submit",function(event){
    event.preventDefault();
    console.log("Button clicked");

    const date=document.getElementById("date").value;
    const topic=document.getElementById("topic").value.trim();
    const problem=document.getElementById("problem").value.trim();
    const difficulty=document.getElementById("difficulty").value;
    const status=document.getElementById("status").value;

    if(topic===""||problem==="") return;
    const entry={
      date:date,
      topic:topic,
      problem:problem,
      difficulty:difficulty,
      status:status
    };
    entries.push(entry);
    localStorage.setItem("dsaEntries",JSON.stringify(entries));
    renderTable();
    
  form.reset();
  dateInput.value= new Date().toISOString().split("T")[0];
});
function renderTable(){
  tableBody.innerHTML = "";


  const selectedStatus= filterStatus.value;
    
  const filteredEntries=entries.filter(entry => selectedStatus === "All" || entry.status === selectedStatus);
  filteredEntries.forEach((entry, index) => {
    /*if(selectedStatus !=="All"&& entry.status !== selectedStatus){
      return;
    }*/
    const row=document.createElement("tr");
    row.innerHTML=`
    <td>${entry.date}</td>
    <td>${entry.topic}</td>
    <td>${entry.problem}</td>
    <td>${entry.difficulty}</td>
    <td>${entry.status}</td>
    <td><button class="delete-btn">Delete</button></td>
    `;
    if(entry.status==="Solved"){
      row.style.backgroundColor="#d4edda";
  }else{
    row.style.backgroundColor="#f8d7da";
  }
    tableBody.appendChild(row);


    const deleteBtn=row.querySelector(".delete-btn");

    deleteBtn.addEventListener("click",function(){
      const entryIndex =entries.indexOf(entry);
      entries.splice(entryIndex,1);
      localStorage.setItem("dsaEntries",JSON.stringify(entries));
      renderTable();
    });
    
  });
  totalCount.textContent=filteredEntries.length;
  solvedCount.textContent=filteredEntries.filter(e => e.status === "Solved").length;
  unsolvedCount.textContent=filteredEntries.filter(e => e.status === "Unsolved").length;
  

  let total=entries.length;
  let solved=entries.filter(e => e.status === "Solved").length;

  let percent=0;
  if(total>0){
    percent=Math.round((solved/total)*100);
  }

  progressBar.style.width=percent+"%";
  progressBar.textContent=percent+"%";
}

function updateProgress() {
    const total = entries.length;
    const solved = entries.filter(e => e.status === "Solved").length;
    const percent = total ? Math.round((solved / total) * 100) : 0;

    const progressBar = document.getElementById("progressBar");
    progressBar.style.width = percent + "%";
    progressBar.textContent = percent + "%";
}

function calculateStreak() {
    if(entries.length === 0) return 0;
    const sorted = entries.sort((a,b) => new Date(a.date) - new Date(b.date));
    let streak = 0;
    let today = new Date();
    for(let i = sorted.length-1; i >=0; i--) {
        let entryDate = new Date(sorted[i].date);
        let diff = (today - entryDate) / (1000*60*60*24);
        if(diff <= 1 && sorted[i].status === "Solved") {
            streak++;
            today = entryDate;
        } else break;
    }
    return streak;
}
darkModeBtn.addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");

    if(document.body.classList.contains("dark-mode")){
        darkModeBtn.textContent = "☀️ Light Mode";
    } else {
        darkModeBtn.textContent = "🌙 Dark Mode";
    }
});

updateProgress();
document.getElementById("streakCount").textContent = calculateStreak();
