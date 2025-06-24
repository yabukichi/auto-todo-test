class TodoApp {
  constructor() {
    this.todoInput = document.getElementById('todoInput');
    this.addBtn = document.getElementById('addBtn');
    this.todoList = document.getElementById('todoList');
    this.todos = [];
    
    this.init();
  }
  
  init() {
    this.addBtn.addEventListener('click', () => this.addTodo());
    this.todoInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.addTodo();
      }
    });
    
    this.loadTodos();
  }
  
  async loadTodos() {
    try {
      const response = await fetch('/api/todos');
      this.todos = await response.json();
      this.renderTodos();
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  }
  
  async addTodo() {
    const text = this.todoInput.value.trim();
    if (!text) return;
    
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      
      if (response.ok) {
        this.todoInput.value = '';
        this.loadTodos();
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  }
  
  async toggleTodo(id, completed) {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed }),
      });
      
      if (response.ok) {
        this.loadTodos();
      }
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  }
  
  async updateTodo(id, text) {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      
      if (response.ok) {
        this.loadTodos();
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  }
  
  async deleteTodo(id) {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        this.loadTodos();
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  }
  
  renderTodos() {
    this.todoList.innerHTML = '';
    
    this.todos.forEach(todo => {
      const li = document.createElement('li');
      li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
      li.innerHTML = `
        <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
        <span class="todo-text">${this.escapeHtml(todo.text)}</span>
        <div class="todo-actions">
          <button class="edit-btn">編集</button>
          <button class="delete-btn">削除</button>
        </div>
      `;
      
      const checkbox = li.querySelector('.todo-checkbox');
      const editBtn = li.querySelector('.edit-btn');
      const deleteBtn = li.querySelector('.delete-btn');
      
      checkbox.addEventListener('change', () => {
        this.toggleTodo(todo.id, checkbox.checked);
      });
      
      editBtn.addEventListener('click', () => {
        this.editTodo(li, todo);
      });
      
      deleteBtn.addEventListener('click', () => {
        if (confirm('このタスクを削除しますか？')) {
          this.deleteTodo(todo.id);
        }
      });
      
      this.todoList.appendChild(li);
    });
  }
  
  editTodo(li, todo) {
    const textSpan = li.querySelector('.todo-text');
    const actionsDiv = li.querySelector('.todo-actions');
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'edit-input';
    input.value = todo.text;
    
    const saveBtn = document.createElement('button');
    saveBtn.className = 'save-btn';
    saveBtn.textContent = '保存';
    
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'cancel-btn';
    cancelBtn.textContent = 'キャンセル';
    
    textSpan.replaceWith(input);
    actionsDiv.innerHTML = '';
    actionsDiv.appendChild(saveBtn);
    actionsDiv.appendChild(cancelBtn);
    
    input.focus();
    input.select();
    
    const save = () => {
      const newText = input.value.trim();
      if (newText && newText !== todo.text) {
        this.updateTodo(todo.id, newText);
      } else {
        this.loadTodos();
      }
    };
    
    const cancel = () => {
      this.loadTodos();
    };
    
    saveBtn.addEventListener('click', save);
    cancelBtn.addEventListener('click', cancel);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        save();
      } else if (e.key === 'Escape') {
        cancel();
      }
    });
  }
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new TodoApp();
});