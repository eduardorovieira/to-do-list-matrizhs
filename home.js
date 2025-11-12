function inicializeAll(formId, taskId, listId) {
    //aqui eu seleciono os elementos do HTL usando seus respectivos IDs, transformo em variáveis e uso as variáveis no final do código para "chamar" os elementos, então eu nã preciso criar vários blocos repetidos de código para cada seção.
    
    const form = document.querySelector(formId);
    const task = document.querySelector(taskId);
    const list = document.querySelector(listId);


//essa função configura o event listener para o form e cria o item da lista de tarefas.
    function addTask(event) {
        event.preventDefault();

        const newTask = task.value.trim();

        if (newTask == '') {
            return; // esse return est impedindo que tarefas vazias sejam adicionadas à lista, caso haja uma tentativa de adicionar uma tarefa sem texto, a função retorna do começo e fica aguardando uma nova entrada com dados válidos.
        }
        const taskItem = document.createElement('li');

    taskItem.innerHTML = `<span>${newTask}</span> <button class="remove-btn">🗑️</button><button class="completed-btn">✅</button>`;

    list.insertBefore(taskItem, list.firstChild);
    task.value = '';
    task.focus();

    }

    function manageTask(event) {

        if(event.target.classList.contains('remove-btn')) {
            const taskItem = event.target.parentElement.remove();

            return;

        }

        if(event.target.classList.contains('completed-btn')){
            const completedButton = event.target;
            const listItem = completedButton.parentElement; //li que tem o botão (filho).
            const list = listItem.parentElement; //lista que contem o li (filho).
            const textSpan = listItem.querySelector('span');

            textSpan.classList.toggle('completed');
            if (textSpan.classList.contains('completed')) {
                completedButton.innerHTML = '♻️';
                list.appendChild(listItem);
            } else {
                completedButton.innerHTML = '✅';
                list.insertBefore(listItem, list.firstChild);
            }
        }        
    };
    //esse comando fica monitorando o envio do form, para impedir que a página recarregue e que a tarefa seja adicionada na lista.
    list.addEventListener('click', manageTask);
    form.addEventListener('submit', addTask);
};

inicializeAll('#form-now', '#task-now', '#list-now');
inicializeAll('#form-schedule', '#task-schedule', '#list-schedule');
inicializeAll('#form-not-urgent', '#task-not-urgent', '#list-not-urgent');
inicializeAll('#form-not-important', '#task-not-important', '#list-not-important');

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const scrollScreen = 80;
    const  meadiaQueryMobile = window.matchMedia('min-width: 650px');

    function handleScroll() {
        if (meadiaQueryMobile.matches && window.scrollY > scrollScreen) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    }
window.addEventListener ('scroll', scrollScreen);
meadiaQueryMobile.addEventListener('change', handleScroll);
});
