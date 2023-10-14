import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";

interface IViewerContext {
  state: { viewerTarget: TViewerTarget | null };
  actions: {
    setViewerTarget: Dispatch<SetStateAction<TViewerTarget | null>>;
  };
}

const ViewerContext = createContext<IViewerContext>({
  state: { viewerTarget: null },
  actions: {
    setViewerTarget: () => {},
  },
});

function ViewerProvider({ children }: { children: ReactNode }) {
  const [viewerTarget, setViewerTarget] = useState<TViewerTarget | null>(null);

  const value = {
    state: { viewerTarget },
    actions: { setViewerTarget },
  };

  return (
    <ViewerContext.Provider value={value}>{children}</ViewerContext.Provider>
  );
}

const { Consumer: ViewerConsumer } = ViewerContext;

export { ViewerProvider, ViewerConsumer };

export default ViewerContext;
