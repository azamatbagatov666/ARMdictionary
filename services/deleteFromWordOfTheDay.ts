export const deleteFromWordOfTheDay = async (token: string, date: string) => {
  
  const formattedSelectedDate = () => {
    if (date != null) {
      const parts = date.split("/");
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
  };
  


    return fetch(
        "https://localhost:7109/DeleteFromWordOfTheDay",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token
          },
          body: JSON.stringify(formattedSelectedDate()),
        }
      );
}


