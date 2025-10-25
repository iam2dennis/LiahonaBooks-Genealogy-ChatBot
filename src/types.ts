
export enum GenealogyWebsite {
  ANCESTRY = "Ancestry.com",
  FAMILY_SEARCH = "FamilySearch.org",
  MY_HERITAGE = "MyHeritage.com",
  FIND_MY_PAST = "Findmypast.com",
  TWENTY_THREE_AND_ME = "23andMe",
}

export enum AnswerStyle {
  DETAILED = "Detailed Explanation",
  STEP_BY_STEP = "Step-by-step",
}

export interface FormData {
  website: GenealogyWebsite;
  answerStyle: AnswerStyle;
  question: string;
}

export type AppStep = 'welcome' | 'form' | 'loading' | 'response';