export const searchHistory = () => {
   
    const isClient = process.client;
    let theHistory: string[] = isClient
      ? JSON.parse(localStorage.getItem('searchHistory') || '[]')
      : [];

    const addHistory = (newString: string): void => {

        if (!theHistory.includes(newString)) {

        if (theHistory.length < 25) {
            theHistory.push(newString);
        }
        else {
            theHistory.shift();
            theHistory.push(newString);
        }

        saveToLocalStorage();
    }
    };

    const removeHistory = (): void => {
        theHistory = [];
        saveToLocalStorage();
    };

    const saveToLocalStorage = (): void => {
        if (theHistory.length == 0) {
            localStorage.setItem("searchHistory", "");
            return;
        }
        localStorage.setItem("searchHistory", JSON.stringify(theHistory));
    };

    return {
        theHistory,
        addHistory,
        removeHistory
    };
};
