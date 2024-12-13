const opentaskformbtn = document.querySelector("#open-task-form-btn")
const taskForm = document.querySelector("#task-form")
const closeTaskFormBtn = document.querySelector("#close-task-form-btn")
const confirmCloseDialog = document.querySelector("#confirm-close-dialog")
const titleInput = document.querySelector("#title-input")
const dateInput = document.querySelector("#date-input")
const descriptionInput = document.querySelector("#description-input")
const discardBtn = document.querySelector("#discard-btn")
const addOrUpdateTaskBtn = document.querySelector("#add-or-update-task-btn")
const tasksContainer = document.querySelector("#tasks-container")

const taskData = JSON.parse(localStorage.getItem("data")) || [];
let currentTask = {}

const removeSpecialChars = (val) => {
    return val.trim().replace(/[^A-Za-z0-9\-\s]/g, '')
  }

const reset = () => {
    titleInput.value = "";
    dateInput.value= "";
    descriptionInput.value= "";
    taskForm.classList.toggle("hidden")
}

opentaskformbtn.addEventListener("click", () => {
    taskForm.classList.toggle("hidden")
})

closeTaskFormBtn.addEventListener("click", () => {
    const formInputsContainValues = titleInput.value || dateInput.value || descriptionInput.value
    if(formInputsContainValues) {
        confirmCloseDialog.showModal()
    } else {
        reset()
    }
})

discardBtn.addEventListener("click",() => {
    reset()
})

const addOrUpdateTask = () => {
    // il va checker si l'item.id de l'array taskData est égale à celui de current task si c'est le cas il renvoi l'index, sinon - 1
    if(!titleInput.value.trim()){
        alert("Please provide a title");
        return;
      }
    const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);
    console.log(dataArrIndex)
    const taskObj = {
        id: titleInput.value.toLowerCase().split(" ").join("-")+Date.now(),
        title: removeSpecialChars(titleInput.value),
        date: dateInput.value,
        description: removeSpecialChars(descriptionInput.value)
    }
    
  if (dataArrIndex === -1) {
    taskData.unshift(taskObj);
  } else {
    taskData[dataArrIndex] = taskObj;
  }
    localStorage.setItem("data", JSON.stringify(taskData));
    updateTaskContainer()
    reset()

}

const updateTaskContainer = () => {
    tasksContainer.innerHTML = "";
    taskData.forEach(
        ({id,title,date,description}) => {
        tasksContainer.innerHTML += `
            <div class="task" id="${id}">
                <p><strong>Title: </strong>${title}</p>
                <p><strong>Date: </strong>${date}</p/>
                <p><strong>Description: </strong>${description}</p>
                <button onclick="editTask(this)" type="button" class="btn">Edit</button>
                <button onclick="deleteTask(this)" type="button" class="btn">Delete</button>
            </div>
        `
        }
    );
};

const deleteTask = (buttonElt) => {
    const dataArrIndex = taskData.findIndex((item) => item.id === buttonElt.parentElement.id
    );
    
    buttonElt.parentElement.remove();
    taskData.splice(dataArrIndex, 1);
    localStorage.setItem("data",JSON.stringify(taskData))
  }

const editTask = (buttonElt) => {
    const dataArrIndex = taskData.findIndex((item) => item.id === buttonElt.parentElement.id)
    currentTask = taskData[dataArrIndex]

    titleInput.value = currentTask.title
    dateInput.value = currentTask.date
    descriptionInput.value = currentTask.description

    taskForm.classList.toggle("hidden")

    addOrUpdateTaskBtn.innerHTML = "update Task"
}

if(taskData.length) {
    updateTaskContainer()
}

taskForm.addEventListener("submit", (e) => {
    e.preventDefault()
    addOrUpdateTask()
})

