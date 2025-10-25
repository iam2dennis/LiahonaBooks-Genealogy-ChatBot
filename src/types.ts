export enum GenealogyWebsite {
  ANCESTRY = "Ancestry.com",
  FAMILY_SEARCH = "FamilySearch.org",
  MY_HERITAGE = "MyHeritage",
  FIND_MY_PAST = "Findmypast",
}

export enum AnswerStyle {
  STEP_BY_STEP = "Step-by-step Guide",
  DETAILED = "Detailed Explanation",
}

export type FormData = {
  website: GenealogyWebsite;
  answerStyle: AnswerStyle;
  question: string;
};

export type AppStep = 'welcome' | 'form' | 'loading' | 'response';
