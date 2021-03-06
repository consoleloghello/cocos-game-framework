import { Mi18n_en } from "./Mi18n_en";
import { Mi18n_zh } from "./Mi18n_zh";
import { L } from "./L";
import { G } from "./G";


const { ccclass, property, executeInEditMode, requireComponent } = cc._decorator
/** 语言类型 */
enum TYPE { english, chinese }
const C = {
    DATA: [Mi18n_en, Mi18n_zh],     // 数据对应
    EDITOR_TYPE: TYPE.english,      // 编辑器语言
    DEFAULT_KEY: 'enter-a-key',     // 默认key
}

/**
 * [M] 国际化-多语言
 * - 修改对应配置文件中的内容，key-value格式
 * - [用法] 将此组件挂载在对应的Label所在节点下，修改key
 * - [用法] 静态接口get_text()
 */
@ccclass
@executeInEditMode
@requireComponent(cc.Label)
export class Mi18n extends cc.Component {

    /** 初始化本地存储 */
    static init_local() { L.language = C.EDITOR_TYPE }

    /**
     * 获取key对应的value并组合成为字符串
     * @param key
     * @param param
     */
    static text(key: string, ...param: any[]): string {
        let type = L.language === null ? C.EDITOR_TYPE : L.language
        let value = C.DATA[type][key]
        if (value === undefined) {
            value = key
            cc.warn(`@${Mi18n.name}: get a not exist key, key=${key}`)
        }
        return G.fake_template_string(value, ...param)
    }

    onLoad() {
        this.update_label()
    }

    update() {
        if (this.preview) {
            this.preview = false
            this.update_label()
        }
    }

    /** key；无法使用notify() */
    @property({ tooltip: '字符串key', multiline: true })
    key: string = C.DEFAULT_KEY

    /** 参数 */
    @property({ tooltip: '字符串参数', type: cc.String })
    param: any[] = []

    /** 预览（点击后刷新编辑器） */
    @property({ tooltip: '预览1次；预览完毕后置于false' })
    preview: boolean = false

    /**
     * 更新label
     * - 目前仅支持cc.Label组件
     * @param label node中的cc.Label组件
     */
    update_label() {
        this.node.getComponent(cc.Label).string = Mi18n.text(this.key, ...this.param)
    }
}