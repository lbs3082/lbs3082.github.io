import { useEffect, type ReactNode } from "react";
import { Bar } from "@/components/charts/bar";
import { BarChart } from "@/components/charts/bar-chart";
import { BarXAxis } from "@/components/charts/bar-x-axis";
import { Grid } from "@/components/charts/grid";
import { Ring } from "@/components/charts/ring";
import { RingChart } from "@/components/charts/ring-chart";
import { ChartTooltip } from "@/components/charts/tooltip";

const BLUE = "#183fb8";
const BLUE_SOFT = "#9fb0e6";
const RUST = "#9c3c25";

// 포트폴리오와 자기소개서에 적은 수치만 씁니다.
const chatbot = [
  { name: "조정 전 13개", value: 13 },
  { name: "조정 후 19개", value: 19 },
];
const documents = [
  { name: "1차 50개", value: 50 },
  { name: "2차 300개", value: 300 },
  { name: "3차 1,000개", value: 1000 },
];
const accuracy = [
  { label: "정답률", value: 94, maxValue: 100, color: BLUE },
  { label: "목표", value: 80, maxValue: 100, color: BLUE_SOFT },
];

function Card({ kicker, title, note, children }: { kicker: string; title: string; note: string; children: ReactNode }) {
  return (
    <section className="flex flex-col rounded-xl border border-[#d1d1c7] bg-white p-5">
      <p className="text-[12px] font-semibold tracking-wide text-[#183fb8]">{kicker}</p>
      <h2 className="mt-1 text-[17px] font-semibold leading-snug tracking-tight text-[#20241f]">{title}</h2>
      <div className="mt-3 flex-1">{children}</div>
      <p className="mt-3 text-[13px] leading-relaxed text-[#5a5d55]">{note}</p>
    </section>
  );
}

function Tile({ value, unit, label, source }: { value: string; unit?: string; label: string; source: string }) {
  return (
    <div className="rounded-xl border border-[#d1d1c7] bg-white px-5 py-4">
      <p className="text-[30px] font-medium leading-tight tracking-tight text-[#183fb8]">
        {value}
        {unit ? <span className="ml-0.5 text-[16px]">{unit}</span> : null}
      </p>
      <p className="mt-1 text-[14px] leading-snug text-[#20241f]">{label}</p>
      <p className="mt-1 text-[12px] text-[#5a5d55]">{source}</p>
    </div>
  );
}

export default function App() {
  // 바깥 페이지(iframe 부모)에 높이를 알려 스크롤 막대 없이 보이게 합니다.
  useEffect(() => {
    const report = () => window.parent?.postMessage({ type: "dash-height", height: Math.ceil(document.getElementById("root")?.getBoundingClientRect().height ?? 0) + 2 }, "*");
    const observer = new ResizeObserver(report);
    observer.observe(document.body);
    report();
    return () => observer.disconnect();
  }, []);

  return (
    <main className="mx-auto grid max-w-[1360px] gap-4 p-1">
      <div className="grid gap-4 md:grid-cols-3">
        <Card
          kicker="RM 대시보드 · 직접 테스트"
          title="챗봇 프롬프트 조정 전후"
          note="같은 질문 20개 중 기대한 내용이 들어간 답변 수. 13개에서 19개로 늘었습니다."
        >
          <BarChart data={chatbot} xDataKey="name" aspectRatio="4 / 3" barGap={0.45} margin={{ top: 16, right: 12, bottom: 32, left: 12 }}>
            <Grid horizontal numTicksRows={4} />
            <Bar dataKey="value" fill={BLUE} lineCap={6} />
            <BarXAxis showAllLabels />
            <ChartTooltip showDatePill={false} />
          </BarChart>
        </Card>

        <Card
          kicker="아이케미스트 일경험 · RAG 평가"
          title="최종용 질문 답변 정답률"
          note="문서 1,000개 기준, Hit Rate(Hit@5) 지표로 평가. 약 94%로 목표 80%를 넘었습니다."
        >
          <div className="relative mx-auto aspect-square w-full max-w-[260px]">
            <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center text-center">
              <div>
                <p className="text-[34px] font-medium leading-none tracking-tight text-[#183fb8]">
                  약 94<span className="text-[18px]">%</span>
                </p>
                <p className="mt-1.5 text-[12px] text-[#5a5d55]">목표 80%</p>
              </div>
            </div>
            <RingChart data={accuracy} strokeWidth={16} ringGap={8} baseInnerRadius={62}>
              <Ring index={0} color={BLUE} />
              <Ring index={1} color={BLUE_SOFT} />
            </RingChart>
          </div>
        </Card>

        <Card
          kicker="아이케미스트 일경험 · 평가 문서"
          title="평가 문서를 늘린 과정"
          note="50개에서 정답률 100%가 나와 300개로, PM 의견에 따라 1,000개로 늘렸습니다."
        >
          <BarChart data={documents} xDataKey="name" aspectRatio="4 / 3" barGap={0.4} margin={{ top: 16, right: 12, bottom: 32, left: 12 }}>
            <Grid horizontal numTicksRows={4} />
            <Bar dataKey="value" fill={RUST} lineCap={6} />
            <BarXAxis showAllLabels />
            <ChartTooltip showDatePill={false} />
          </BarChart>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <Tile value="70" unit="개" label="평가 질문 (목표 70개)" source="아이케미스트 일경험 · 팀 KPI" />
        <Tile value="1,000" unit="개" label="가상 기업 10곳의 평가 문서" source="아이케미스트 일경험" />
        <Tile value="0.8899" label="거래 연결 복원 AUC (팀 결과)" source="이상거래 탐지 · GNN·GAE" />
        <Tile value="3" unit="회" label="팀장을 맡은 교육과정 프로젝트" source="이상거래 탐지 · 세컨드뱅킹 · 4호선 수요 예측" />
      </div>
    </main>
  );
}
