/**
 * Check if item is a string in the list.
 * @param item
 */
export function isTypeString(item) {
  return typeof item === 'string';
}

/**
 * Select item to save in localStorage
 * @param historyIdentifier
 * @param selected - item selected from list
 */
export function saveHistory(historyIdentifier: string, historyListMaxNumber: number, selected, searchKeyword: string) {
  if (historyIdentifier) {
    // check if selected item exists in historyList
    const historyList = this.getHistory(historyIdentifier);

    if (!historyList.some((item) => !this.isTypeString(item)
      ? item[searchKeyword] == selected[searchKeyword] : item == selected)) {
      saveHistoryToLocalStorage(historyIdentifier, [selected, ...historyList]);

      // check if items don't exceed max allowed number
      if (historyList.length >= historyListMaxNumber) {
        historyList.splice(historyList.length - 1, 1);
        saveHistoryToLocalStorage(historyIdentifier, [selected, ...historyList]);
      }
    } else {
      // if selected item exists in historyList swap to top in array
      if (!this.isTypeString(selected)) {
        // object logic
        const copiedHistoryList = historyList.slice(); // copy original historyList array
        const selectedIndex = copiedHistoryList.map((item) => item[searchKeyword]).indexOf(selected[searchKeyword]);
        copiedHistoryList.splice(selectedIndex, 1);
        copiedHistoryList.splice(0, 0, selected);
        saveHistoryToLocalStorage(historyIdentifier, [...copiedHistoryList]);
      } else {
        // string logic
        const copiedHistoryList = historyList.slice(); // copy original historyList array
        copiedHistoryList.splice(historyList.indexOf(selected), 1);
        copiedHistoryList.splice(0, 0, selected);
        saveHistoryToLocalStorage(historyIdentifier, [...copiedHistoryList]);
      }
    }
  }

  return this.getHistory(historyIdentifier);
}

/**
 * Save item in localStorage
 * @param historyIdentifier
 * @param selected
 */
function saveHistoryToLocalStorage(historyIdentifier: string, selected) {
  window.localStorage.setItem(
    `${historyIdentifier}`,
    JSON.stringify(selected)
  );
}

/**
 * Remove item from localStorage
 * @param historyIdentifier
 * @param index
 * @param e event
 */
export function removeHistoryItem(historyIdentifier: string, index) {
  let history = this.getHistory(historyIdentifier);
  let historyList = history.filter((v, i) => i !== index);
  saveHistoryToLocalStorage(historyIdentifier, historyList);

  if (historyList.length == 0) {
    return this.resetHistoryList(historyIdentifier);
  }

  return this.getHistory(historyIdentifier);
}

/**
 * Reset localStorage
 * @param e event
 */
export function resetHistoryList(historyIdentifier: string) {
  window.localStorage.removeItem(`${historyIdentifier}`);
  return [];
}

/**
 * Retrieve component search history
 * @param historyIdentifier
 */
export function getHistory(historyIdentifier: string): string[] {
  let history = window.localStorage.getItem(`${historyIdentifier}`);

  try {
    return history ? JSON.parse(history) : [];
  }
  catch {
    return [];
  }
}
