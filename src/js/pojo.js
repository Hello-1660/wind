// 配置文件
const WIND_CONFIG = {
    // 默认配置
    default: {
        ui: {
            // 界面配置
            // 通用
            bgc: '#fff',                  // 背景色
            font: 'Microsoft YaHei',        // 字体
            fontSize: 12,                   // 字体大小
            fontColor: '#000',            // 字体颜色 

            // 按钮
            btnBorderColor: '#000',       // 按钮边框颜色
            btnBgColor: '#fff',           // 按钮背景颜色
            btnFontColor: '#000',         // 按钮字体颜色
            btnFontSize: 12,                // 按钮字体大小

            // 文本框
            textBorderColor: '#000',      // 文本框边框颜色
            textBgColor: '#fff',          // 文本框背景颜色
            textFontColor: '#000',        // 文本框字体颜色
            textFontSize: 12,               // 文本框字体大小

            // 时间
            timeFontColor: '#000',        // 时间字体颜色
            timeFontSize: 12,               // 时间字体大小

            // 日期
            dateFontColor: '#000',        // 日期字体颜色
            dateFontSize: 12,               // 日期字体大小
            dateFormat: 'yyyy-MM-dd',       // 日期格式
            dateContent: 'center',          // 日期内容自定义

            // 提示
            tipStyle: 'default'             // 提示样式
        },
        Interaction: {
            // 交互
            addTodo: ['w', 'a'],            // 添加任务
            showTodo: ['w', 's'],           // 展示任务
            updateTodo: ['w', 'u'],         // 更新任务

            // 事件到期时间提醒
            isRemind: true,                 // 是否提醒 

            // 开机自启
            isAutoStart: true               // 是否开机自启
        }
    }
}


// 待办对象
const TODO = class TODO {
    constructor(id, type, title, content, outTime, status, isRemind, remind) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.content = content;
        this.outTime = outTime;
        this.status = status;
        this.status = status;
        this.isRemind = isRemind;
        this.remind = remind;
    }


    toString() {
        return `
        id: ${this.id}, 
        type: ${this.type}, 
        title: ${this.title}, 
        content: ${this.content}, 
        outTime: ${this.outTime}, 
        status: ${this.status}, 
        isRemind: ${this.isRemind}, 
        remind: ${this.remind}`
    }

    toJson() {
        return JSON.stringify(this)
    }
}