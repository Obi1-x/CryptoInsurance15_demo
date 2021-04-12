class Storage {

    // to store 1 string to local storage
    storeItem(item, keyName) {
        // Check if any items in ls
        localStorage.setItem(keyName, item);
    }

    // to get 1 object stored to local storage
    getItemsFromStorage(keyName) {
        let dataList;
        if (localStorage.getItem(keyName) === null) {
            dataList = '';
            return dataList;
        } else {
            dataList = JSON.parse(localStorage.getItem(keyName));
        }
        return dataList;
    }

    // to store 1 object to local storage
    storeItemObject(item, keyName) {
        // Check if any items in ls
        // if (localStorage.getItem(keyName) === null) {
        //   localStorage.setItem(keyName, JSON.stringify(item));
        // } else { localStorage.setItem(keyName, JSON.stringify(item)); }
        localStorage.setItem(keyName, JSON.stringify(item));
    }

    // to get 1 object stored to local storage
    getItemsFromStorageObject(keyName) {
        let dataList;
        if (localStorage.getItem(keyName) === null) {
            return null;
        } else {
            dataList = JSON.parse(localStorage.getItem(keyName));
        }
        return dataList;
    }

    // to store 1 object data or append object data to array data in local storage
    storeItemArray(item, keyName) {
        let dataList;
        // Check if any items in ls
        if (localStorage.getItem(keyName) === null) {
            dataList = [];
            // Push new item
            if (item.length >= 1) { dataList = [...item]; }
            if (item.length === 0) { dataList.push(item); }

            // Set ls
            localStorage.setItem(keyName, JSON.stringify(dataList));
        } else {
            // Get what is already in ls
            dataList = JSON.parse(localStorage.getItem(keyName));

            // Push new item
            if (item.length >= 1) { dataList = [...item]; }
            if (item.length === 0) { dataList.push(item); }
            // Reset ls
            localStorage.setItem(keyName, JSON.stringify(dataList));
        }
    }

    // to get arrays of datas stored in in local storage
    getItemsFromStorageArray(keyName) {
        let dataList;
        if (localStorage.getItem(keyName) === null) {
            dataList = []; return dataList;
        } else { dataList = JSON.parse(localStorage.getItem(keyName)); }
        return dataList;
    }
}
// module.exports = NoteStorage;
export default Storage;
