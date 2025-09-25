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
    const addStop = document.querySelector('#add_stop')
    const addAddress = document.querySelector('#add_address')
    const addStatus = document.querySelector('#add_status')
    const addIndex = document.querySelector('#add_index')
    const status = document.querySelector('#status')
    const showStatus = document.querySelector('#show_status')



    // 提醒时间计数
    let remindTimeCount = 0
    // 截至时间计数
    let deadlineTimeCount = 0
    // 地点计数
    let addressCount = 0
    // 优先级计数
    let priorityCount = 0

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


    // 添加提醒
    if (addRemind) {
        addRemind.addEventListener('click', () => {
            status.classList.add('none')

            if (remindTimeCount >= 1) return

            // 创建时间输入框
            const timeInput = document.createElement('input')
            timeInput.type = 'datetime-local'
            timeInput.className = 'remind_time_input'

            // 获取当前时间
            const now = new Date()
            const year = now.getFullYear()
            const month = String(now.getMonth + 1).padStart(2, '0')
            const day = String(now.getDate()).padStart(2, '0')
            const hour = String(now.getHours()).padStart(2, '0')
            const minute = String(now.getMinutes()).padStart(2, '0')
            timeInput.value = `${year}-${month}-${day}T${hour}:${minute}`

            // 确认按钮
            const confirmBtn = document.createElement('button')
            confirmBtn.textContent = '确认'
            confirmBtn.className = 'confirm_btn'


            // 创建容器
            const remindBox = document.createElement('div')
            remindBox.className = 'show_status_item'
            remindBox.appendChild(timeInput)
            remindBox.appendChild(confirmBtn)


            // 添加确认按钮点击事件
            confirmBtn.addEventListener('click', () => {
                const remindTime = timeInput.value

                if (!remindTime) {
                    remindBox.remove()
                    remindTimeCount--
                    return
                }

                const date = remindTime.split('T')[0]
                const time = remindTime.split('T')[1]

                remindBox.innerHTML = `
                    <div id="delete_item">×</div>
                    <div id="status_item">提醒时间 ${date} ${time}</div>
                `

                // 删除事件
                const deleteItem = remindBox.querySelector('#delete_item')
                if (deleteItem) {
                    deleteItem.addEventListener('click', () => {
                        remindBox.remove()
                        remindTimeCount--
                    })
                }
            })

            showStatus.appendChild(remindBox)
            remindTimeCount++
        })
    }

    // 添加截止时间
    if (addStop) {
        addStop.addEventListener('click', () => {
            status.classList.add('none')

            if (deadlineTimeCount >= 1) return

            // 创建时间输入框
            const timeInput = document.createElement('input')
            timeInput.type = 'datetime-local'
            timeInput.className = 'stop_time_input'

            // 获取当前时间
            const now = new Date()
            const year = now.getFullYear()
            const month = String(now.getMonth + 1).padStart(2, '0')
            const day = String(now.getDate()).padStart(2, '0')
            const hour = String(now.getHours()).padStart(2, '0')
            const minute = String(now.getMinutes()).padStart(2, '0')
            timeInput.value = `${year}-${month}-${day}T${hour}:${minute}`

            // 确认按钮
            const confirmBtn = document.createElement('button')
            confirmBtn.textContent = '确认'
            confirmBtn.className = 'confirm_btn'


            // 创建容器
            const stopBox = document.createElement('div')
            stopBox.className = 'show_status_item'
            stopBox.appendChild(timeInput)
            stopBox.appendChild(confirmBtn)


            // 添加确认按钮点击事件
            confirmBtn.addEventListener('click', () => {
                const stopTime = timeInput.value

                if (!stopTime) {
                    stopBox.remove()
                    deadlineTimeCount--
                    return
                }

                const date = stopTime.split('T')[0]
                const time = stopTime.split('T')[1]

                stopBox.innerHTML = `
                    <div id="delete_item">×</div>
                    <div id="status_item">截止时间 ${date} ${time}</div>
                `

                // 删除事件
                const deleteItem = stopBox.querySelector('#delete_item')
                if (deleteItem) {
                    deleteItem.addEventListener('click', () => {
                        stopBox.remove()
                        deadlineTimeCount--
                    })
                }
            })

            showStatus.appendChild(stopBox)
            deadlineTimeCount++
        })
    }

    // 添加地点
    if (addAddress) {
        addAddress.addEventListener('click', () => {
            status.classList.add('none')

            if (addressCount >= 5) return

            // 创建地点输入框
            const addressInput = document.createElement('input')
            addressInput.type = 'text'
            addressInput.className = 'address_input'

            // 确认按钮
            const confirmBtn = document.createElement('button')
            confirmBtn.textContent = '确认'
            confirmBtn.className = 'confirm_btn'


            // 创建容器
            const addressBox = document.createElement('div')
            addressBox.className = 'show_status_item'
            addressBox.appendChild(addressInput)
            addressBox.appendChild(confirmBtn)


            // 添加确认按钮点击事件
            confirmBtn.addEventListener('click', () => {
                const address = addressInput.value

                if (!address) {
                    addressBox.remove()
                    addressCount--
                    return
                }

                addressBox.innerHTML = `
                    <div id="delete_item">×</div>
                    <div id="status_item">地点 ${address}</div>
                `

                // 删除事件
                const deleteItem = addressBox.querySelector('#delete_item')
                if (deleteItem) {
                    deleteItem.addEventListener('click', () => {
                        addressBox.remove()
                        addressCount--
                    })
                }
            })

            showStatus.appendChild(addressBox)
            addressCount++
        })
    }

    // 添加优先级
    if (addIndex) {
        addIndex.addEventListener('click', () => {
            status.classList.add('none')

            if (priorityCount >= 1) return

            const priorityBox = document.createElement('div')
            priorityBox.className = 'show_status_item'
            priorityBox.innerHTML = `
                <div id="delete_item">×</div>
                <div id="status_item">高优先级</div>
            `
            // 删除事件
            const deleteItem = priorityBox.querySelector('#delete_item')
            if (deleteItem) {
                deleteItem.addEventListener('click', () => {
                    priorityBox.remove()
                    priorityCount--
                })
            }

            showStatus.appendChild(priorityBox)
            priorityCount++
        })
    }


    document.addEventListener('dblclick', getTodo)



    // 收集便签数据
    function getTodo() {
        if (!todoContent.value.trim()) return 



        const statusList = document.querySelectorAll('.show_status_item')


        let addressList = ''
        let addDeadline
        let addRemindList
        let addIndex

        statusList.forEach(item => {
            if (!item.querySelector('#status_item')) return

            const content = item.querySelector('#status_item').innerText

            if (content.slice(0, 2) == '截止') {
                const dateTimeStr = content.slice(5, content.length)
                const isoStr = dateTimeStr.replace(' ', 'T')
                addDeadline = isoStr + ':0'
            }

            if (content.slice(0, 2) == '提醒') {
                const dateTimeStr = content.slice(5, content.length)
                const isoStr = dateTimeStr.replace(' ', 'T')
                addRemindList = isoStr + ':0'
            }

            if (content.slice(0, 2) == '地点') {
                addressList += content.slice(2, content.length) + ','
            }

            if (content.slice(0, 4) == '高优先级') {
                addIndex = content.slice(0, content.length)
            }
        })



        const todo = {
            createdTime: new Date().toISOString(),
            content: todoContent.value,
            status: '待完成',
            deadline: '',
            remindTime: '',
            priority: '0',
            location: '',
        }

        if (todoTheme) todo.theme = todoTheme.value

        if (addDeadline) {
            const deadlineDate = new Date(addDeadline)
            if (!isNaN(deadlineDate.getTime())) {
                todo.deadline = deadlineDate.toISOString()
            }
        }

        if (addRemindList) {
            const remindDate = new Date(addRemindList)
            if (!isNaN(remindDate.getTime())) {
                todo.remindTime = remindDate.toISOString()
            }
        }

        todo.priority = (addIndex && addIndex !== '') ? "1" : "0"

        if (addressList) todo.location = addressList.slice(0, addressList.length - 1)

        window.electronAPI.sendAddTodo(todo)
        // 清除数据
        todoTheme.value = ''
        todoContent.value = ''

        // 删除状态便签
        while (showStatus.firstChild) {
            showStatus.removeChild(showStatus.firstChild)
        }

        
        // 回显待办
        const showTimeout = setInterval(() => {
            showTodo()
            clearTimeout(showTimeout)
        }, 800)
    }



    // 便签数据回显
    async function showTodo() {
        // 清空待办
        while (showTodoList.firstChild) {
            showTodoList.removeChild(showTodoList.firstChild)
        }


        const todoList = await window.electronAPI.getTodoList()

        if (!todoList) return

        const list = todoList.todos

        if (!list) return

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

            timeNode.addEventListener('click', () => {
                if (timeNode.getAttribute('showYear') === 'true') {
                    timeNode.setAttribute('showYear', 'false')
                    timeNode.innerHTML = `
                <div class="todo_time_day">
                    ${day}
                </div>

                <div class="todo_time_month">
                    ${month}
                </div>`

                } else {
                    timeNode.setAttribute('showYear', 'true')
                    timeNode.innerHTML = `
                <div class="todo_time_year">
                        ${year}
                </div>`

                }
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