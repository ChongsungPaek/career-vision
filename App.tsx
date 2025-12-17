
import React, { useState, useCallback, useMemo } from 'react';
import { QUESTIONS, TYPE_DESCRIPTIONS } from './constants';
import { RiasecScores, RiasecType, AnalysisResult, UserProfile, StorageRecord } from './types';
import SurveyStep from './components/SurveyStep';
import VisualResults from './components/VisualResults';
import ProfileForm from './components/ProfileForm';
import AdminDashboard from './components/AdminDashboard';
import { analyzeCareerResults } from './services/geminiService';
import { dbService } from './services/dbService';

type AppState = 'intro' | 'survey' | 'analyzing' | 'profile_entry' | 'result';

const typeLabels: Record<RiasecType, string> = {
  [RiasecType.REALISTIC]: "실재형 (R)",
  [RiasecType.INVESTIGATIVE]: "탐구형 (I)",
  [RiasecType.ARTISTIC]: "예술형 (A)",
  [RiasecType.SOCIAL]: "사회형 (S)",
  [RiasecType.ENTERPRISING]: "진취형 (E)",
  [RiasecType.CONVENTIONAL]: "관습형 (C)",
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isError, setIsError] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const startSurvey = () => {
    setState('survey');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setUserProfile(null);
  };

  const handleAnswerSelect = useCallback(async (value: number) => {
    const questionId = QUESTIONS[currentQuestionIndex].id;
    const nextAnswers: Record<number, number> = { ...answers, [questionId]: value };
    setAnswers(nextAnswers);

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setState('analyzing');
      try {
        const scores: RiasecScores = {
          [RiasecType.REALISTIC]: 0,
          [RiasecType.INVESTIGATIVE]: 0,
          [RiasecType.ARTISTIC]: 0,
          [RiasecType.SOCIAL]: 0,
          [RiasecType.ENTERPRISING]: 0,
          [RiasecType.CONVENTIONAL]: 0,
        };

        const countPerType: Record<string, number> = {};

        QUESTIONS.forEach(q => {
          const val = nextAnswers[q.id];
          if (typeof val === 'number') {
            scores[q.type] += val;
          }
          countPerType[q.type] = (countPerType[q.type] || 0) + 1;
        });

        Object.keys(scores).forEach(type => {
          const typedKey = type as RiasecType;
          if (countPerType[typedKey]) {
            scores[typedKey] = scores[typedKey] / countPerType[typedKey];
          }
        });

        const result = await analyzeCareerResults(scores);
        setAnalysis(result);
        setState('profile_entry');
      } catch (error) {
        console.error("Analysis failed:", error);
        setIsError(true);
        setState('intro');
      }
    }
  }, [answers, currentQuestionIndex]);

  const handleProfileSubmit = (profile: UserProfile) => {
    setUserProfile(profile);
    
    // Save to "Data File" (localStorage)
    if (analysis && scores) {
      const record: StorageRecord = {
        ...profile,
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        riasecCode: analysis.topTwoCode,
        scores: scores
      };
      dbService.saveRecord(record);
    }
    
    setState('result');
  };

  const scores = useMemo(() => {
    if (!answers || Object.keys(answers).length === 0) return null;
    const s: RiasecScores = {
      [RiasecType.REALISTIC]: 0,
      [RiasecType.INVESTIGATIVE]: 0,
      [RiasecType.ARTISTIC]: 0,
      [RiasecType.SOCIAL]: 0,
      [RiasecType.ENTERPRISING]: 0,
      [RiasecType.CONVENTIONAL]: 0,
    };
    const counts: Record<string, number> = {};
    Object.entries(answers).forEach(([id, val]) => {
      const q = QUESTIONS.find(q => q.id === parseInt(id));
      if (q) {
        s[q.type] += (val as number);
        counts[q.type] = (counts[q.type] || 0) + 1;
      }
    });
    Object.keys(s).forEach(k => {
      if (counts[k]) s[k as RiasecType] /= counts[k];
    });
    return s;
  }, [answers]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-50">
      {isAdminOpen && <AdminDashboard onClose={() => setIsAdminOpen(false)} />}
      
      {/* Header */}
      <header className="w-full bg-white border-b border-slate-200 py-4 px-6 flex justify-between items-center sticky top-0 z-50 print:hidden">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">CareerVision AI</h1>
        </div>
        <button onClick={() => setIsAdminOpen(true)} className="text-xs text-slate-400 font-bold hover:text-slate-600 uppercase tracking-tighter">Admin</button>
      </header>

      <main className="flex-1 w-full max-w-4xl px-4 py-8 md:py-12">
        {state === 'intro' && (
          <div className="text-center space-y-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold mb-2">
              Holland RIASEC 기반 정밀 직업 상담
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
              당신의 잠재력을 <br /> 
              <span className="text-blue-600">데이터로 발견하세요.</span>
            </h2>
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm max-w-2xl mx-auto">
              <p className="text-lg md:text-xl text-slate-700 leading-relaxed text-center">
                이 설문은 존 홀랜드(John Holland)의 RIASEC 이론에 따라, 커리어 관련 흥미를 
                <span className="font-bold text-blue-600"> 실재형, 탐구형, 예술형, 사회형, 기업형, 관습형</span>으로 
                분류하고 적절한 직업을 추천합니다.
              </p>
            </div>
            {isError && (
              <p className="text-red-500 font-medium">분석 중 오류가 발생했습니다. 다시 시도해 주세요.</p>
            )}
            <button
              onClick={startSurvey}
              className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xl font-bold shadow-xl shadow-blue-200 transition-all hover:-translate-y-1 active:scale-95"
            >
              커리어 테스트 시작하기
            </button>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-12">
                {(Object.entries(typeLabels) as [RiasecType, string][]).map(([type, label]) => (
                    <div 
                      key={type} 
                      className="group relative p-4 border border-slate-200 rounded-xl bg-white text-sm font-bold text-slate-700 shadow-sm hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-all cursor-default text-center"
                    >
                        {label}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-3 bg-slate-800 text-white text-xs font-normal rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 shadow-2xl text-left leading-relaxed scale-95 group-hover:scale-100 origin-bottom">
                            {TYPE_DESCRIPTIONS[type]}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800" />
                        </div>
                    </div>
                ))}
            </div>
          </div>
        )}

        {state === 'survey' && (
          <SurveyStep
            question={QUESTIONS[currentQuestionIndex]}
            currentIndex={currentQuestionIndex + 1}
            totalQuestions={QUESTIONS.length}
            value={answers[QUESTIONS[currentQuestionIndex].id] || null}
            onSelect={handleAnswerSelect}
            progress={(currentQuestionIndex / QUESTIONS.length) * 100}
          />
        )}

        {state === 'analyzing' && (
          <div className="flex flex-col items-center justify-center py-24 space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-slate-800">심층 커리어 분석 중...</h3>
              <p className="text-slate-500">RIASEC 데이터와 AI를 결합하여 최적의 직업군을 찾고 있습니다.</p>
            </div>
          </div>
        )}

        {state === 'profile_entry' && (
          <ProfileForm onSubmit={handleProfileSubmit} />
        )}

        {state === 'result' && analysis && scores && userProfile && (
          <div className="space-y-10 pb-20 animate-in fade-in duration-1000">
            {/* Report Header for Print */}
            <section className="hidden print:block border-b-2 border-slate-900 pb-6 mb-8">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 mb-2 uppercase">Career Analysis Official Report</h1>
                  <p className="text-slate-500 font-bold">Generated by CareerVision AI Specialist</p>
                </div>
                <div className="text-right text-sm">
                  <p><strong>발급 번호:</strong> {crypto.randomUUID().slice(0,8).toUpperCase()}</p>
                  <p><strong>발급 일시:</strong> {new Date().toLocaleString()}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-8 bg-slate-100 p-4 rounded-xl border border-slate-200">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Candidate Name</p>
                  <p className="text-lg font-black text-slate-900">{userProfile.name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Email Address</p>
                  <p className="text-slate-900 font-bold">{userProfile.email}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Phone Number</p>
                  <p className="text-slate-900 font-bold">{userProfile.phone}</p>
                </div>
              </div>
            </section>

            <section className="text-center space-y-4 print:text-left">
              <div className="text-sm font-bold text-blue-600 uppercase tracking-widest print:text-slate-400">Assessment Report</div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">
                {userProfile.name}님은 <span className="text-blue-600 underline decoration-blue-200 underline-offset-8">"{analysis.topTwoCode}"</span> 유형의 인재입니다
              </h2>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <VisualResults scores={scores} />
              
              <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm space-y-4 print:shadow-none print:border-none print:p-0">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-8 bg-blue-600 rounded-full print:bg-slate-300" />
                  종합 성향 분석
                </h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  {analysis.summary}
                </p>
                <div className="pt-4 border-t border-slate-100">
                    <p className="text-sm font-bold text-slate-400 mb-2 uppercase">Core Traits</p>
                    <div className="flex flex-wrap gap-2">
                        {analysis.topTwoCode.split('').map((char, idx) => {
                            const foundType = Object.values(RiasecType).find(type => type[0] === char);
                            return (
                                <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-bold">
                                    {foundType ? typeLabels[foundType as RiasecType] : char}
                                </span>
                            );
                        })}
                    </div>
                </div>
              </div>
            </div>

            <section className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <svg className="w-6 h-6 text-yellow-500 print:hidden" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                추천 직업 Top 3
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:grid-cols-1">
                {analysis.recommendations.map((job, idx) => (
                  <div key={idx} className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 print:shadow-none print:border-slate-200">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 font-black text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors print:bg-slate-100 print:text-slate-800">
                      {idx + 1}
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-3">{job.title}</h4>
                    <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                      {job.reason}
                    </p>
                    <div className="space-y-4 pt-4 border-t border-slate-50">
                      <div>
                        <p className="text-xs font-bold text-slate-400 mb-2">업무 루틴</p>
                        <p className="text-sm text-slate-700">
                          {job.dailyLife}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {job.skillsNeeded.map((skill, sIdx) => (
                          <span key={sIdx} className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative print:bg-white print:text-slate-900 print:border-2 print:border-slate-900">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 opacity-20 blur-[100px] -mr-32 -mt-32 print:hidden" />
                <div className="relative z-10 space-y-6">
                    <h3 className="text-2xl font-bold flex items-center gap-3">
                        <svg className="w-7 h-7 text-blue-400 print:text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        전문가 제언
                    </h3>
                    <p className="text-blue-100 text-lg leading-relaxed italic print:text-slate-700">
                        "{analysis.careerAdvice}"
                    </p>
                    <div className="pt-6 print:hidden">
                        <button 
                            onClick={() => window.print()}
                            className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors"
                        >
                            결과 리포트 PDF 다운로드 (인쇄)
                        </button>
                    </div>
                </div>
            </section>

            <div className="text-center print:hidden">
              <button
                onClick={startSurvey}
                className="text-slate-400 font-semibold hover:text-slate-600 transition-colors"
              >
                테스트 다시 시작하기
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-100 bg-white py-8 print:hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-400 font-medium">
            © 2024 CareerVision AI. Powered by Holland RIASEC Algorithm & Gemini AI.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
