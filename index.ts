interface ITodoList {
    id: number,
    name: string,
    completed: boolean,
}

class TodoList implements ITodoList {
    id: number;
    name: string;
    completed: boolean;
    constructor(id: number, name: string, completed: boolean) {
        this.id = id;
        this.name = name
        this.completed = completed
    }
}

class TodoLists {
    todolist: TodoList[];
    constructor() {
        let saveWork = localStorage.getItem("listWork")
        this.todolist = saveWork ? JSON.parse(saveWork) : []
    }

    createJob(name: string, completed: boolean) {
        const id = this.todolist.length > 0 ? this.todolist[this.todolist.length - 1].id + 1 : 1;
        const newFeedback = new TodoList(id, name, completed);
        this.todolist.push(newFeedback);
        this.saveToLocalStorage(); // Lưu vào localStorage
    }

    updateJob(id: number, completed: boolean) {
        const jobToUpdate = this.todolist.find(job => job.id === id);
        if (jobToUpdate) {
            jobToUpdate.completed = completed;
            this.saveToLocalStorage();
            return true; // Trả về true nếu cập nhật thành công
        }
        return false; // Trả về false nếu không tìm thấy công việc
    }

    deleteJob(id: number) {
        if (confirm("Bạn có chắc chắn muốn xóa không?")) {
            this.todolist = this.todolist.filter(work => work.id !== id);
            this.saveToLocalStorage();
            renderWork();
        }
    }

    private saveToLocalStorage(): void {
        localStorage.setItem("listWork", JSON.stringify(this.todolist));
    }

    getAllWork(): TodoList[] {
        return this.todolist
    }
}

let listWorks = new TodoLists();
let listGroup = document.querySelector(".list-group") as HTMLElement
let addWork = document.getElementById("add") as HTMLButtonElement
let inputWork = document.getElementById("inputWork") as HTMLInputElement
let inputError = document.getElementById("inputError") as HTMLElement

function deleteWork(id: number) {
    listWorks.deleteJob(id);
}

const renderWork = () => {
    const listWork = listWorks.getAllWork();
    const feedBackHTML = listWork.map((todolist: TodoList) => {
        return `
            <div class="list-group-item d-flex align-items-center">
                <input class="form-check-input" type="checkbox" id="work-${todolist.id}" ${todolist.completed ? 'checked' : ''}>
                <label class="form-check-label flex-grow-1" for="work-${todolist.id}">
                    ${todolist.name}
                </label>
                <span class="icons">
                    <i class="fas fa-edit me-2"></i>
                    <button onclick="deleteWork(${todolist.id})"><i class="fas fa-trash"></i></button>
                </span>
            </div>
        `;
    })

    const feedbackHTML = feedBackHTML.join("");
    listGroup.innerHTML = feedbackHTML;
}

renderWork();

addWork.addEventListener("click", () => {
    if (!inputWork.value) {
        inputError.style.display = "block"
    } else {
        inputError.style.display = "none";
        const name = inputWork.value;
        const completed = false;

        listWorks.createJob(name, completed);
        renderWork();
        window.location.reload();
        inputWork.value = "";
    }

})

const checkboxes = document.querySelectorAll('.form-check-input');
checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('click', (event) => {
        const checkboxId = (event.target as HTMLInputElement).id.split('-')[1];
        const completed = (event.target as HTMLInputElement).checked;

        // Cập nhật trạng thái hoàn thành của công việc
        listWorks.updateJob(parseInt(checkboxId), completed);

        // Thay đổi kiểu chữ của tên công việc
        const label = document.querySelector(`label[for="work-${checkboxId}"]`) as HTMLLabelElement;
        if (completed) {
            label.classList.add('completed');
        } else {
            label.classList.remove('completed');
        }
    });
});