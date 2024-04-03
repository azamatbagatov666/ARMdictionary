const languageState = useLanguageState();
import { useLanguageState } from '~/composables/states/language.state';



export const sLineLang = computed(() => {
    switch (languageState.value) {
      case "eng":
        return {
          searching: "Search a word.",
          keyboardButton: "Armenian Keyboard",
          randomButton: "Random Word",
          searchTip: "Use *  for multiple selections and ? for single character.",
        };
      case "am":
        return {
          searching: "Փնտռցէք բառ մը:",
          keyboardButton: "Հայերէն Ստեղնաշար",
          randomButton: "Պատահական Բառ",
          searchTip: "Կարելի է օգտագործել * բազմաթիւ տառերու խուզարկումի, իսկ ? տառի մը համար:",
  
        };
      case "tr":
        return {
          searching: "Bir sözcük ara.",
          keyboardButton: "Ermenice Klavye",
          randomButton: "Rastgele Sözcük",
          searchTip: "Aramalarınızda birden fazla harf için  *  ve tek bir harf için  ?  kullanabilirsiniz.",
  
        };
      default:
        return {
          searching: "Bir sözcük ara.",
          keyboardButton: "Ermenice Klavye",
          randomButton: "Rastgele Sözcük",
          searchTip: "Aramalarınızda birden fazla harf için  *  ve tek bir harf için  ?  kullanabilirsiniz.",
  
        };
    }
  });
  