### Viewer 에 보여질 viewerTagert 을 useContext를 통해 global 상태로 관리

```typescript
type TViewerTarget = {
  key: string;
  name: string;
  src: string;
};

interface IViewerContext {
  state: { viewerTarget: TViewerTarget | null };
  actions: {
    setViewerTarget: Dispatch<SetStateAction<TViewerTarget | null>>;
  };
}

// ...

const ViewerContext = createContext<IViewerContext>(...)
```

### 리소스 등록 validation 구현

```javascript
function validate() {
  return new Promise((resolve, reject) => {
    setTimeout(
      // 딜레이 이후 20%확률로 true를 리턴하도록 하는 콜백
      () => resolve(20 >= Math.floor(Math.random() * 100)),
      // 300ms ~ 1000ms 만큼 랜덤 딜레이
      Math.floor(Math.random() * 701) + 300
    );
  });

  const addURL = async (url: string) => {
    // ...
    // validate() 이후 성공 실패 분기
    const v = await validate();
    if (v)
      return toast({
        title: `URL is failed to upload`,
        status: "error",
      });

    // ... success here
  };

  const addImages = (files: FileList) => {
    const valide: Array<File> = [];

    // ...

    // forEach로 callback을 한번에 던지고 각각 이미지가 validate()가
    // 완료되길 기다렸다 이후 성공 실패 분기
    valide.forEach(async (file) => {
      const v = await validate();
      if (v)
        return toast({
          title: `${file.name} is failed to upload`,
          status: "error",
        });

      // ... success here
    });
  };
}
```

### URL 업로드 구현

```javascript
const addURL = async (url: string) => {
  // 제대로 schema 를 붙힌 url 인지 유효성 검사
  if (!(url.startsWith("https://") || url.startsWith("http://")))
    return toast({
      title: `url must contain a schema ( https:// or http:// ).`,
      status: "error",
    });

  let target_url: string = url;

  if (url.includes("/watch?v=")) {
    target_url = `https://www.youtube.com/embed/${url.split("/watch?v=")[1]}`;
  }

  // 공유하기 버튼으로 생성된 url 경우
  if (url.includes("youtu.be/")) {
    target_url = `https://www.youtube.com/embed/${
      url.split("youtu.be/")[1].split("?")[0]
    }`;
  }

  console.log(target_url);

  // validate() 의 리턴 여부에 따라 업로드 성공/실패
  const v = await validate();
  if (v)
    return toast({
      title: `URL is failed to upload`,
      status: "error",
    });

  setResources((prev) =>
    prev.concat({
      name: url,
      key: crypto.randomUUID(),
      src: target_url,
    })
  );

  toast({
    title: `URL is uploaded`,
    status: "success",
  });
};
```

### Image 업로드 구현

```javascript
const addImages = (files: FileList) => {
    if (!files) return;
    const valide: Array<File> = [];

    // 파일형식 validate
    const validate_image = (target: File): boolean => {
      const { type } = target;
      const [cat, ext] = type.split("/");

      return cat === "image" && ["png", "jpg"].includes(ext);
    };

    // validate_image 를 통과한 파일만 valide 배열에 추가
    for (let i = 0; i < files.length; i++) {
      if (validate_image(files[i])) {
        valide.push(files[i]);
      } else {
        alert(`${files[i].name} is not allowed`);
      }
    }

    // valid 배열의 file들을 각각 FileReader API를 통해 변환 후
    // resources 배열에 추가
    valide.forEach(async (file) => {
      const v = await validate();
      if (v)
        return toast({
          title: `${file.name} is failed to upload`,
          status: "error",
        });

      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setResources((prev) =>
          prev.concat({
            name: file.name,
            key: crypto.randomUUID(),
            src: reader.result as string,
          })
        );

        toast({
          title: `${file.name} is uploaded`,
          status: "success",
        });
      };
    });
  };
```

### resource 의 수정 / 삭제 구현

```javascript
// array.map 과 array.filter 이용해서 구현
const modifyingResourceName = (
  key: string,
  name: string,
  callback?: (newObj: TViewerTarget | null) => void
) => {
  let newObj: TViewerTarget | null = null;
  setResources((prev) => {
    return prev.map((p) => {
      if (p.key === key) {
        newObj = { ...p, name };
        return newObj;
      } else return p;
    });
  });
  callback && callback(newObj);
  //  (obj) => setViewerTarget(obj)
};

const removeResource = (key: string, callback?: Function) => {
  setResources((prev) => prev.filter((r) => r?.key !== key));
  callback && callback();
  // 현재 뷰어에 활성화 되여있는 리소스가 삭제되면 뷰어 닫기
  // () => { if (active) setViewerTarget(null); }
};
```
