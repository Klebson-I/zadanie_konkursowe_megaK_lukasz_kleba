// Twój kod
import {uiSelectors} from './uiSelectors.js';

//main arr of tasks on user side
let taskArr=[];
//html elements, mostly a li 
let taskHTMLElements=[];


//function to get tasks after reach main site
(async function loadPage(){
    const res=await fetch('/list/getList',{
        method:"GET",
        headers:{
            "Content-Type":"application/json",
        }
    });
    const data=await res.json();
    if(data.length)await loadElements(data);
})();
//create elements
async function loadElements(data){
    for(const element of data){
        console.log(element);
        await createTaskElement(element.task,element.isCompleted);
    }
}

//class of task
class Task{
    constructor(task,isCompleted=false){
        this.task=task;
        this.isCompleted=isCompleted;
        this.li=null;
        this.button=null;
        this.checkBox=null;
        this.label=null;
        this.createNewTask(task);
    }
    //create a html elements of task
    createNewTask(task){
        this.li=document.createElement('li');
        if(this.isCompleted)this.li.classList.add('completed');
        const div=document.createElement('div');
        div.classList.add('view');
        this.checkBox=document.createElement('input');
        this.checkBox.classList.add('toggle');
        this.checkBox.setAttribute('type','checkbox');
        this.label=document.createElement('label');
        this.label.innerText=task;
        this.button=document.createElement('button');
        this.button.classList.add('destroy');
        div.appendChild(this.checkBox);
        div.appendChild(this.label);
        div.appendChild(this.button);
        this.li.append(div);
        uiSelectors.entireList.appendChild(this.li);
        this.addListeners();
        taskHTMLElements.push(this.li);
    }
    //add listeners of task html element
    addListeners(){
        this.button.addEventListener('click',()=>{
            this.removeElement();
        })
        this.checkBox.addEventListener('click',()=>{
            this.toggleClassOfList();
        })
    }
    //remove task
    async removeElement(){
        const copyOfTaskArr=taskArr.map(element=>element.task);
        const index=copyOfTaskArr.indexOf(this.task);
        console.log(index);
        taskArr.splice(index,1);
        console.log(this.li);
        this.li.remove();
        await updateServerData();
    }
    //change task to completed or no
    async toggleClassOfList(){
        this.li.classList.toggle("completed");
        this.isCompleted=!this.isCompleted;
        const index=this.checkIndex(this.task);
        this.isCompleted?taskArr[index].isCompleted=true:taskArr[index].isCompleted=false;
        await updateServerData();
        console.log(taskArr);
    }
    //function that finds index of this element in taskArr
    checkIndex(){
        let i=0;
        for(let task of taskArr){
            if(task.task==this.task){
                return i;
            }else{
                i++;
            }
        }
    }
}


//it gets value to create task
uiSelectors.newToDoInput.addEventListener('change',(e)=>{
    createTaskElement(e.target.value);
    e.target.value="";
})

//create task object based on Task class
async function createTaskElement(name,isCompleted=false){
    try{
        const arrOfTaskNames=taskArr.length?taskArr.map(element=>element.task):[];
        if(!arrOfTaskNames.includes(name)){
            const task=new Task(name,isCompleted);
            taskArr.push({task:task.task,isCompleted});
            await updateServerData();
        }else{
            alert("There is note like that");
        }
    }
    catch(e){
        console.log(e);
    }
}

//update server list of tasks
async function updateServerData(){
    try{
        const res=await fetch('/list/create',{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify(taskArr),
        })
        const data=await res.json();
        updateNumberOfTasks(data.numberOfTasks);
    }
    catch(e){
        console.log(e);
    }
}

//update number of left tasks
function updateNumberOfTasks (number) { 
    uiSelectors.numberOfTasksElement.innerText=number;
}

//delete all completed tasks
uiSelectors.clearCompleted.addEventListener('click',()=>{
    deleteAllCompletedTasks();
})
async function deleteAllCompletedTasks(){
    try{
        const newArr=taskArr.filter(element=>{if(!element.isCompleted)return element});
        console.log(newArr);
        taskArr=[...newArr];
        taskHTMLElements.forEach(element=>{
            if(element.classList.contains('completed')){
                element.remove();
            }
        })
        const newHtmlArr=taskHTMLElements.filter(element=>{if(!element.classList.contains("completed"))return element});
        taskHTMLElements=[...newHtmlArr];
        await updateServerData();
    }
    catch(e){
        console.log(e);
    }
    
}




//niestety nie znalazłem jaki display ma element footer więc nie wiem do czego miałby wrócić
// function footerDisplay(){
//     if(taskArr.length){
//         uiSelectors.footer.style.display="block";
//     }else{
//         uiSelectors.footer.style.display="none";
//     }
// }
