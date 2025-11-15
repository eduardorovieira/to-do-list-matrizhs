//escopo global aqui
const removeBTN = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z"/></svg>`;

const marcadoBTN = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>`;

const marcarBTN = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>`;

function dragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.id);
}

function salvarDadosNoNavegador() {
    const allTasks = [];

    document.querySelectorAll('li').forEach(item=> {
        const textoTarefa = item.querySelector('span');
        const parentArticle = item.closest('article');

        allTasks.push ({
            id: item.id,
            text: textoTarefa.textContent,
            category: parentArticle ? parentArticle.id : null,
            isCompleted: textoTarefa.classList.contains('completed')
        });
    });

    const dataString = JSON.stringify(allTasks);
    localStorage.setItem('eisenhowerTasks', dataString)
}

function retornaTarefasDoLocalStorage () {
    const data = localStorage.getItem('eisenhowerTasks');

    if (!data) {
        return false; //ou seja, não existem dados para que essa função me retone
    }

    const tasks = JSON.parse(data);
    tasks.forEach(task => {

        const listaDestino = document.querySelector(`#${task.category} ol`);

        if (listaDestino) {
            const taskItem = document.createElement('li');
            taskItem.id = task.id;
            taskItem.setAttribute("draggable", "true");
            taskItem.addEventListener('dragstart', dragStart);

            let completedClass = task.isCompleted ? 'completed' : '';
            let completedIcon = task.isCompleted ? `${marcadoBTN}`: `${marcarBTN}`;

            const removeIcon = `${removeBTN}`;

            taskItem.innerHTML = `<span class="${completedClass}">${task.text}</span> 
            <button class=" completed-btn">${completedIcon}</button>
            <button class="remove-btn">${removeIcon}</button>`;

            listaDestino.insertBefore(taskItem, listaDestino.firstChild);
        }
    });
    return true;
}
    
function inicializeAll(formId, inputId, taskId) {
    //aqui eu seleciono os elementos do HTL usando seus respectivos IDs, transformo em variáveis e uso as variáveis no final do código para "chamar" os elementos, então eu nã preciso criar vários blocos repetidos de código para cada seção.

    const form = document.querySelector(formId);
    const taskInput = document.querySelector(inputId);
    const task = document.querySelector(taskId);
    const taskArea = document.querySelectorAll(".task-area");

    taskArea.forEach((area) => {
        area.addEventListener("dragover", dragOver);
        area.addEventListener("drop", dragDrop);
    });

    function dragOver(e) {
        e.preventDefault();
    }

    function dragDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.toggle("drag-over");

        const taskIndex = e.dataTransfer.getData("text/plain");
        const draggedItem = document.getElementById(taskIndex);
        const destinatoionList = e.currentTarget.querySelector("ol");

        if (destinatoionList) {
            destinatoionList.insertBefore(draggedItem, destinatoionList.firstChild);
            salvarDadosNoNavegador();
        }
    }

    //essa função configura o event listener para o form e cria o item da lista de tarefas.
    function addTask(event) {
        event.preventDefault();

        const newTask = taskInput.value.trim();

        if (newTask == "") {
            return; // esse return est impedindo que tarefas vazias sejam adicionadas à lista, caso haja uma tentativa de adicionar uma tarefa sem texto, a função retorna do começo e fica aguardando uma nova entrada com dados válidos.
        }
        const taskItem = document.createElement("li");

        taskItem.innerHTML = `<span>${newTask}</span> 
        <button class=" completed-btn">${marcarBTN}</button>
        <button class="remove-btn">${removeBTN}</button>`;

        taskItem.setAttribute("draggable", "true");
        taskItem.id = "task-" + Date.now();
        taskItem.addEventListener("dragstart", dragStart);

        task.insertBefore(taskItem, task.firstChild);
        taskInput.value = "";
        taskInput.focus();
        salvarDadosNoNavegador();
    }

    function manageTask(event) {

        const removeButton = event.target.closest(".remove-btn");

        if (removeButton) {
            removeButton.parentElement.remove();
            salvarDadosNoNavegador();
            return;
        }


        const completedButton = event.target.closest(".completed-btn");
        if (completedButton) {
            const listItem = completedButton.parentElement; //li que tem o botão (filho).
            const list = listItem.parentElement; //lista que contem o li (filho).
            const textSpan = listItem.querySelector("span");

            textSpan.classList.toggle("completed");
            if (textSpan.classList.contains("completed")) {
                completedButton.innerHTML = `${marcadoBTN}`;
                list.appendChild(listItem);
                salvarDadosNoNavegador();
            } else {
                completedButton.innerHTML = `${marcarBTN}`;
                list.insertBefore(listItem, list.firstChild);
                salvarDadosNoNavegador();
            }
        }
    }
    //esse comando fica monitorando o envio do form, para impedir que a página recarregue e que a tarefa seja adicionada na lista.
    task.addEventListener("click", manageTask);
    form.addEventListener("submit", addTask);
    }



document.addEventListener ('DOMContentLoaded', () => {
    const taskLoaded = retornaTarefasDoLocalStorage();

    if (taskLoaded) {
        console.log ('Tarefas restauradas');
    }
})

inicializeAll("#form-now", "#task-now", "#list-now");
inicializeAll("#form-schedule", "#task-schedule", "#list-schedule");
inicializeAll("#form-not-urgent", "#task-not-urgent", "#list-not-urgent");
inicializeAll("#form-not-important", "#task-not-important", "#list-not-important");
