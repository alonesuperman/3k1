const configStorageKey = "GAME_3K1";
const historyStorageKey = "HISTORY_LIST";
const dataKey = "__data__";
const timeKey = "lastSaveTime";

// 私有方法
const orginalLoad = () => {
    let result = localStorage.getItem(configStorageKey);
    if (result) {
        try {
            result = JSON.parse(result);
            if (!result.hasOwnProperty(timeKey) || !result.hasOwnProperty(dataKey)) {
                throw new Error("发现非法数据，已自动销毁")
            }
        } catch (error) {
            console.error(error);
            result = null
        }
    }
    if (!result) {
        result = {
            [timeKey]: null,
            [dataKey]: null,
        }
    }
    return result;
}
const orginalSave = configs => {
    const obj = {
        [timeKey]: Date.now(),
        [dataKey]: configs,
    };
    localStorage.setItem(configStorageKey, JSON.stringify(obj));
}

export default class Storage {
    /**
     * @description 储存配置
     * @param {Object} configs - 必填。要储存的配置信息
     * @param {Boolean} quiet - 选填。默认为false。是否启用安静模式，即发生数据覆盖不提醒用户
     */
    static save(configs, quiet = false) {
        const oldData = orginalLoad();
        if (!quiet && oldData[dataKey]) {
            const choice = confirm("发现有旧存档，是否覆盖");
            if (choice) {
                orginalSave(configs);
                return true;
            } else {
                // TODO: 回到旧存档
                return false;
            }
        }
        orginalSave(configs);
        return true;
    }
    static saveHistory(history) {
        localStorage.setItem(historyStorageKey, JSON.stringify(history));
    }
    static cleanHistory() {
        localStorage.removeItem(historyStorageKey);
    }

    static load() {
        return (orginalLoad())[dataKey];
    }
    static loadHistory() {
        let result = localStorage.getItem(historyStorageKey);
        try {
            if (result) {
                result = JSON.parse(result);
            } else {
                result = [];
            }
        } catch (error) {
            result = [];
        }
        return result;
    }
}
