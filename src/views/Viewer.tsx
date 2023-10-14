import React, { useContext } from "react";
import styled from "styled-components";
import { TypedIcon } from "typed-design-system";
import { ViewerConsumer } from "../contexts/viewer";

const Viewer = () => {
  return (
    <ViewerConsumer>
      {({ state, actions }) => {
        const { viewerTarget } = state;
        const { setViewerTarget } = actions;

        return viewerTarget ? (
          <Wrapper key={`${viewerTarget.key}-wrapper`}>
            <Header>
              <span className="title">{viewerTarget.name}</span>
              <div
                onClick={() => {
                  setViewerTarget(null);
                }}
              >
                <TypedIcon icon="close_19" style={{ cursor: "pointer" }} />
              </div>
            </Header>
            <iframe
              width="100%"
              height="100%"
              frameBorder={0}
              marginWidth={0}
              marginHeight={0}
              src={viewerTarget.src}
            />
          </Wrapper>
        ) : null;
      }}
    </ViewerConsumer>
  );
};

export default Viewer;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
`;

const Header = styled.div`
  display: flex;

  align-items: center;
  justify-content: space-between;

  width: 100%;

  gap: 10px;
  padding: 16px;

  z-index: 2;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.1);

  & > .title {
    width: 100%;

    word-wrap: break-word;
    word-break: break-all;

    display: -webkit-inline-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;

    overflow: hidden;
  }
`;
