# 숫자 대시보드 소스 (Bklit UI)

`portfolio-v2/dash/`에 들어가는 대시보드의 소스입니다. Bklit UI 차트(React + Tailwind 4, shadcn 레지스트리 `@bklit`)를 씁니다.

수치를 바꾸려면 `src/App.tsx` 위쪽의 `chatbot`, `documents`, `accuracy`와 아래쪽 `Tile` 값을 고친 뒤 빌드합니다.

    npm install
    npm run build

빌드 결과 `dist/`의 `index.html`과 `assets/`를 `portfolio-v2/dash/`에 덮어씁니다. OneDrive 동기화 폴더 안에서 `npm install`을 하면 파일이 많아 느리므로, 이 폴더를 다른 곳에 복사해 빌드하는 편이 낫습니다.
