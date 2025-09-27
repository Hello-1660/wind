const builder = require('electron-builder');
const Platform = builder.Platform;

// 构建配置
async function build() {
    try {
        await builder.build({
            targets: Platform.current().createTarget(),
            config: {
                // 使用 package.json 中的配置
            }
        });
        console.log('构建成功！');
    } catch (error) {
        console.error('构建失败:', error);
    }
}

build();