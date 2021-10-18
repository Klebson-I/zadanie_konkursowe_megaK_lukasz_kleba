import { uiSelectors } from "./uiSelectors.js";

//downloading and display completed tasks
let tasks;

(async function loadList(){
    const res=await fetch('/list/completed',{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },        
    })
    const data =await res.json();
    tasks=data.map(task=>task.task);
    createList(tasks);
})();

function createList(tasks){
    if(tasks.length){
        for(const task of tasks){
            const li=document.createElement('li');
            li.innerText=task;
            uiSelectors.listOfCompletedTasks.append(li);
        }
    }
    else{
        const li=document.createElement('li');
        li.innerText="There are no completed tasks in your list !";
        uiSelectors.listOfCompletedTasks.append(li);
    }
}

