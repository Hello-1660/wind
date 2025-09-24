document.addEventListener('DOMContentLoaded', async () => {
    // 获取数据模型
    const config = await window.electronAPI.getSettingModel()
    // 获取便签数据
    const todoList = await window.electronAPI.getTodoList()

    // 渲染配置
    const body = document.body
    const showTodoList = document.querySelector('#todoList')
    const input = document.querySelectorAll('input')
    const deleteItemList = document.querySelectorAll('#delete_item')
    const showStatusItemList = document.querySelectorAll('.show_status_item')
    const todoTimeDay = document.querySelector('.todo_time_day')
    const todoTimeMonth = document.querySelector('.todo_time_month')
    const todoContentTitle = document.querySelector('.todo_content_title')
    const todoContentStatus = document.querySelector('.todo_content_status')
    const todoTheme = document.querySelector('#todo_theme')
    const todoContent = document.querySelector('#todo_content')
    const addRemind = document.querySelector('#add_remind')
    const addAddress = document.querySelector('#add_address')
    const addStatus = document.querySelector('#add_status')
    const status = document.querySelector('#status')
    

    setConfig()
    showTodo()


    addStatus.addEventListener('mouseenter', () => {
        status.classList.remove('none')
    })


    if (status) {
        status.addEventListener('mouseleave', () => {
            status.classList.add('none')
        })

        status.addEventListener('mouseover', (e) => { 
            status.classList.remove('none')
        })
    }

    if (deleteItemList) {
        deleteItemList.forEach(item => {
            item.addEventListener('click', () => {
                item.parentNode.remove()
            })
        })
    }


    
    // 便签数据回显
    function showTodo() {
        if (!todoList) return

        const list = todoList.todos
        
        if (!list || list.length === 0) return

        list.forEach(item => { 
            const createTime = new Date(item.createdTime)
            const day = createTime.getDate()
            const month = createTime.getMonth() + 1 + '月'
            const year = createTime.getFullYear()
        
            const todo = document.createElement('div')
            todo.className = 'todo'

            todo.innerHTML = `
                <div class="todo_time">
                    <div class="todo_time_day">
                        ${day}
                    </div>

                    <div class="todo_time_month">
                        ${month}
                    </div>
                </div>

                <div class="todo_content">
                    <div class="todo_content_title">${item.theme || item.content || '无主题'}</div>
                    <div class="todo_content_status">${item.status}</div>
                </div>`


            todo.setAttribute('id', item.id)
            todo.setAttribute('createTime', item.createTime)  
            todo.setAttribute('theme', item.theme)
            todo.setAttribute('content', item.content)  
            todo.setAttribute('deadline', item.deadline)
            todo.setAttribute('remindTime', item.remindTime)
            todo.setAttribute('priority', item.priority)
            todo.setAttribute('location', item.location)


            const timeNode = todo.querySelector('.todo_time')

            timeNode.addEventListener('mouseenter', () => { 
                timeNode.innerHTML = `
                <div class="todo_time_year none">
                        ${year}
                </div>`
            })
            
            timeNode.addEventListener('mouseleave', () => {
                timeNode.innerHTML = `
                <div class="todo_time_day">
                    ${day}
                </div>

                <div class="todo_time_month">
                    ${month}
                </div>`
            })
    
            showTodoList.appendChild(todo)
        })
    }




    // 渲染配置
    function setConfig() {
        if (!config) return

        // 通用配置
        body.style.fontSize = config.ui.fontSize + 'px'
        body.style.fontFamily = config.ui.font
        body.style.color = config.ui.fontColor
        body.style.backgroundColor = config.ui.bgc


        input.forEach(item => {
            // 按钮属性
            if (item.type === 'button') {
                item.style.backgroundColor = config.ui.btnBgColor
                item.style.borderColor = config.ui.btnBorderColor
                item.style.color = config.ui.btnFontColor
                item.style.fontSize = config.ui.btnFontSize + 'px'
            }

            // 文本框属性
            if (item.type === 'text') {
                item.style.backgroundColor = config.ui.textBgColor
                item.style.borderColor = config.ui.textBorderColor
                item.style.color = config.ui.textFontColor
                item.style.fontSize = config.ui.textFontSize + 'px'
                item.style.height = +config.ui.textFontSize + 5 + 'px'
            }
        })


        // 多行文本框
        todoContent.style.backgroundColor = config.ui.textBgColor
        todoContent.style.borderColor = config.ui.textBorderColor
        todoContent.style.color = config.ui.textFontColor
        todoContent.style.fontSize = config.ui.textFontSize + 'px'
    }
})