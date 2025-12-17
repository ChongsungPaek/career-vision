
import { RiasecType, Question } from './types';

export const QUESTIONS: Question[] = [
  // Realistic
  { id: 1, text: "기계나 장비를 수리하는 것을 좋아한다.", type: RiasecType.REALISTIC },
  { id: 2, text: "야외에서 몸을 움직이며 일하는 것을 선호한다.", type: RiasecType.REALISTIC },
  { id: 3, text: "복잡한 도구나 전자기기를 다루는 데 능숙하다.", type: RiasecType.REALISTIC },
  { id: 4, text: "구체적이고 실질적인 결과물을 만드는 것이 즐겁다.", type: RiasecType.REALISTIC },
  { id: 5, text: "식물이나 동물을 돌보는 활동에 관심이 많다.", type: RiasecType.REALISTIC },
  
  // Investigative
  { id: 6, text: "수학이나 과학 문제를 해결하는 과정을 즐긴다.", type: RiasecType.INVESTIGATIVE },
  { id: 7, text: "현상의 원인을 분석하고 연구하는 것을 좋아한다.", type: RiasecType.INVESTIGATIVE },
  { id: 8, text: "복잡한 데이터를 해석하고 패턴을 찾는 일에 몰입한다.", type: RiasecType.INVESTIGATIVE },
  { id: 9, text: "새로운 지식을 습득하고 탐구하는 활동이 즐겁다.", type: RiasecType.INVESTIGATIVE },
  { id: 10, text: "추상적인 아이디어를 논리적으로 검증하는 것을 좋아한다.", type: RiasecType.INVESTIGATIVE },

  // Artistic
  { id: 11, text: "창의적인 글쓰기나 예술 활동에 관심이 많다.", type: RiasecType.ARTISTIC },
  { id: 12, text: "자유롭고 형식에 얽매이지 않는 환경을 선호한다.", type: RiasecType.ARTISTIC },
  { id: 13, text: "새롭고 독특한 아이디어를 생각해내는 것이 즐겁다.", type: RiasecType.ARTISTIC },
  { id: 14, text: "음악, 미술, 연기 등 예술적 자기표현이 중요하다.", type: RiasecType.ARTISTIC },
  { id: 15, text: "심미적인 아름다움을 추구하고 디자인하는 것을 좋아한다.", type: RiasecType.ARTISTIC },

  // Social
  { id: 16, text: "다른 사람들을 가르치거나 도와주는 일이 보람차다.", type: RiasecType.SOCIAL },
  { id: 17, text: "사람들의 고민을 듣고 상담해주는 것을 잘한다.", type: RiasecType.SOCIAL },
  { id: 18, text: "팀워크를 통해 공동의 목표를 달성하는 것을 좋아한다.", type: RiasecType.SOCIAL },
  { id: 19, text: "사회적 문제를 해결하거나 봉사하는 활동에 관심이 많다.", type: RiasecType.SOCIAL },
  { id: 20, text: "낯선 사람들과 대화하고 관계를 맺는 것이 즐겁다.", type: RiasecType.SOCIAL },

  // Enterprising
  { id: 21, text: "다른 사람들을 설득하거나 리드하는 것을 좋아한다.", type: RiasecType.ENTERPRISING },
  { id: 22, text: "목표를 설정하고 비즈니스 성과를 내는 과정이 즐겁다.", type: RiasecType.ENTERPRISING },
  { id: 23, text: "위험을 감수하더라도 새로운 프로젝트를 추진하고 싶다.", type: RiasecType.ENTERPRISING },
  { id: 24, text: "대중 앞에서 발표하거나 협상하는 것에 자신감이 있다.", type: RiasecType.ENTERPRISING },
  { id: 25, text: "성공과 명예, 경제적 성취를 중요하게 생각한다.", type: RiasecType.ENTERPRISING },

  // Conventional
  { id: 26, text: "데이터를 정확하게 정리하고 기록하는 것을 잘한다.", type: RiasecType.CONVENTIONAL },
  { id: 27, text: "정해진 규칙과 절차에 따라 일하는 것이 편안하다.", type: RiasecType.CONVENTIONAL },
  { id: 28, text: "세부 사항을 꼼꼼하게 점검하고 관리하는 것을 좋아한다.", type: RiasecType.CONVENTIONAL },
  { id: 29, text: "사무적인 업무나 회계, 행정 일에 능숙하다.", type: RiasecType.CONVENTIONAL },
  { id: 30, text: "체계적이고 정돈된 업무 환경을 선호한다.", type: RiasecType.CONVENTIONAL },
];

export const TYPE_DESCRIPTIONS = {
  [RiasecType.REALISTIC]: "실재형: 현장 중심적이며 도구와 기계를 잘 다루는 성향",
  [RiasecType.INVESTIGATIVE]: "탐구형: 분석적이고 지적 호기심이 많으며 연구를 선호하는 성향",
  [RiasecType.ARTISTIC]: "예술형: 창의적이고 예술적 표현을 중시하며 개성이 뚜렷한 성향",
  [RiasecType.SOCIAL]: "사회형: 타인을 돕고 가르치며 대인 관계를 중시하는 성향",
  [RiasecType.ENTERPRISING]: "진취형: 리더십과 설득력이 있으며 경제적 성취를 지향하는 성향",
  [RiasecType.CONVENTIONAL]: "관습형: 체계적이고 꼼꼼하며 사무적인 업무에 능숙한 성향",
};
