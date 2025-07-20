interface SearchHistoryState {
  history: string[];
}

export const useSearchHistoryStore = defineStore("searchHistory", () => {
  const state = reactive<SearchHistoryState>({
    history: [],
  });

  const readInitial = () => {
    const searchHistory = localStorage.getItem('searchHistory');
    if (searchHistory) {
        state.history = JSON.parse(searchHistory);
    }
  }

  const addHistory = (newString: string): void => {
    if (!state.history.includes(newString)) {
      if (state.history.length < 25) {
        state.history.push(newString);
      } else {
        state.history.shift();
        state.history.push(newString);
      }

      saveToLocalStorage();
    }
  };

  const removeHistory = (): void => {
    state.history = [];
    saveToLocalStorage();
  };

  const saveToLocalStorage = (): void => {
    localStorage.setItem("searchHistory", JSON.stringify(state.history));
  };

  return {
    state,
    addHistory,
    removeHistory,
    readInitial
  };
});
