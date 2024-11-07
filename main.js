let tasks =[];
let addBtn=document.getElementById("add-btn");
let inputBox=document.getElementById("input-box");
let taskList=document.querySelector(".task-list");
let delBtn=document.getElementById("del-btn");


delBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const taskItems = document.querySelectorAll('.task-item');
    const totalTasks = taskItems.length;
    let completedAnimations = 0;

    taskItems.forEach((task, index) => {
        task.classList.add('slide-out');
        task.addEventListener('animationend', () => {
            tasks.splice(index, 1);
            completedAnimations++;

            if (completedAnimations === totalTasks) {
                tasks.splice(0, tasks.length); 
                taskList.innerHTML = ''; 
                updateStats();
                updateTaskList();
                saveTasks();
            }
        });
    });
});

document.addEventListener('DOMContentLoaded',()=>{
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));

    if(storedTasks){
        storedTasks.forEach((task)=>tasks.push(task));
        updateTaskList();
        updateStats();
    }
});

const saveTasks =()=>{
    localStorage.setItem('tasks',JSON.stringify(tasks));
};

const addTask = ()=>{
    const text=inputBox.value.trim();

    if(text){
        tasks.push({text: text,completed: false});
        inputBox.value = '';
        updateTaskList();
        updateStats();
        saveTasks();

        const taskItems = document.querySelectorAll('.task-item');
        const newTaskItem = taskItems[taskItems.length - 1];
        newTaskItem.classList.add('new-task');
    }
};

const deleteTask = (index) => {
  const deleteTaskItem = taskList.children[index];
  deleteTaskItem.classList.add('slide-out');

  // Wait for the animation to finish before deleting the task
  deleteTaskItem.addEventListener('animationend', () => {
      tasks.splice(index,1);
      updateTaskList();
      updateStats();
      saveTasks();
  });
};


const editTask=(index)=>{
    inputBox.value=tasks[index].text;
    tasks.splice(index,1);
    updateTaskList();
    updateStats();
    saveTasks();
};

const updateStats = ()=>{
    let progress=document.getElementById('progress');
    let completeTask = tasks.filter((task)=>task.completed).length;
    let totalTask=tasks.length;

    let progressValue = (completeTask/totalTask)*100;
    progress.style.width=`${progressValue}%`;

    let number = document.getElementById('number');
    number.innerText = `${completeTask} / ${totalTask}`;
};

const toggleTaskCompleted = (index)=>{
    tasks[index].completed=!tasks[index].completed;
    updateTaskList();
    updateStats();
}

const updateTaskList = ()=>{
    taskList.innerHTML='';

    tasks.forEach((task,index)=>{
        const taskItem = document.createElement('div');
        taskItem.classList.add("task-item");
        if (task.completed) taskItem.classList.add("completed-item");
        taskItem.innerHTML=`
                <div class="task ${task.completed ? "completed":""}">
                    <input type="checkbox" class="check-box" ${task.completed ? "checked":""}>
                    <p>${task.text}</p>
                </div>
                <div class="icon">
                         <i class="bi bi-pencil-square" onclick="editTask(${index})" ${task.completed ? "style='opacity: 0.5;pointer-events: none;'":""}></i>
                         <i class="bi bi-trash3" onclick="deleteTask(${index})"></i>
                </div>`

            taskItem.addEventListener('change',()=>{toggleTaskCompleted(index)});
            taskList.append(taskItem);
            saveTasks();
    });
};


addBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    addTask();
});
