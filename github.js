// 공개 저장소의 구현을 읽어 정리했습니다. 원격 코드를 실행하지 않았습니다.
const githubWork = {
  id:'stock-ai-app', number:'10', scope:'github', title:'AI 주식 정보 앱', category:'GITHUB / DEVELOPMENT STUDY',
  organization:'공개 저장소 · stock-ai-app', role:'개인 담당 범위 자료에 미기재', period:'자료에 미기재',
  summary:'Streamlit으로 국내·미국 종목 검색, 주가·환율 차트, Gemini 기반 뉴스·영상 요약 기능을 구성한 공개 개발 작업입니다.',
  result:'종목 검색·차트·AI 요약의 연결 구조를 코드에서 확인', tags:['Python','Streamlit','SQLite','Plotly','Gemini API','yfinance'], metrics:[], figures:[],
  background:'공개 저장소 stock-ai-app에는 주식 정보 앱의 Python 코드와 종목 데이터베이스, 의존성 목록이 있습니다. AI_analyst.py에서는 국내·미국 종목 검색, 주가 차트, 뉴스·영상 요약, 환율 화면을 연결한 구성을 확인할 수 있습니다.',
  problem:'프로젝트를 시작한 배경과 해결하려던 사용자 문제는 자료에 미기재입니다. 코드에서는 한글 종목명, 미국 티커, 영문 회사명을 구분하고 각 입력에 맞는 조회 경로를 선택합니다.',
  myRole:'개인 담당 범위·협업 여부는 자료에 미기재입니다. 이 페이지는 공개 저장소에 포함된 구현을 기준으로 정리했으며, 파일 전체의 개발 기여도를 임의로 표시하지 않았습니다.',
  approach:['입력 형식을 구분해 국내 종목명은 SQLite에서 조회하고, 미국 티커와 회사명은 yfinance를 통해 확인하도록 구성했습니다.','yfinance로 조회한 주가를 Plotly 캔들 차트로 표시하고, 달러·엔화 환율은 기간을 선택해 조회하도록 구성했습니다.','DuckDuckGo 검색 결과의 제목·본문·링크를 Gemini에 전달하고, 요약과 참고 기사 링크를 화면에 함께 표시합니다.','영상 URL에서 yt-dlp로 오디오를 가져와 Gemini에 전달하고, 처리 상태를 확인한 뒤 요약을 표시하는 흐름이 포함되어 있습니다.','Streamlit session_state에 선택 종목과 뉴스 결과를 보관하고, 검색 결과 없음·데이터 없음·파일 처리 실패 등 예외 상황의 안내를 구성했습니다.'],
  outcome:'종목 입력 → 데이터 조회 → 차트 표시와 AI 요약이라는 연결 구조를 공개 코드에서 확인했습니다. app.py에는 블라인드 차트 게임도 포함되어 있습니다. 기능의 실제 실행 결과와 평가 수치, 사용 현황은 자료에 미기재입니다.',
  limit:'README와 프로젝트 화면 이미지가 없어 소스 코드만 검토했습니다. 로컬 실행 및 외부 API 동작은 검증하지 않았습니다. app.py와 AI_analyst.py에 서로 다른 화면·기능 구성이 있으므로 배포에 사용한 진입 파일, 개발 기간, 개인 담당 범위, 실제 실행 화면은 자료에 미기재입니다.',
  learning:'개발 과정에서 얻은 배움과 개선하고 싶은 점은 자료에 미기재입니다.',
  repository:'https://github.com/lbs3082/stock-ai-app',
  codeLinks:[['종목 검색과 화면 연결','AI_analyst.py#L58-L147'],['뉴스·영상 요약 처리','AI_analyst.py#L242-L374'],['주가·환율 화면','AI_analyst.py#L530-L728'],['의존성 목록','requirements.txt']]
};
const githubRevisionURL='https://github.com/lbs3082/stock-ai-app/blob/1e3fcb68ac3e1fd52c93c76cfe0d61eb669c170d';
projects.push(githubWork);
