import React from "react";
import styled from "styled-components";
import { TypedIcon } from "typed-design-system";

const ResourceList = () => {
  const actions: { label: string }[] = [
    { label: "URL 추가" },
    { label: "이미지 추가" },
  ];

  return (
    <Wrapper>
      <Header>
        {actions.map((content) => {
          return <Button>{content.label}</Button>;
        })}
      </Header>
      <ResourcesWrapper>
        {[].map((resources, index) => {
          return (
            <ResourceCard>
              {index + 1}
              <div id="icon-action-area">
                <TypedIcon icon="edit_19" />
                <TypedIcon icon="trash_19" />
              </div>
            </ResourceCard>
          );
        })}
      </ResourcesWrapper>
    </Wrapper>
  );
};

export default ResourceList;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  min-width: 280px;
  max-width: 280px;

  height: 100%;

  background-color: #f7f7f7;
  border-right: 1px solid #c4c4c4;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;

  gap: 10px;
  padding: 10px;

  background-color: #fff;
  box-shadow: 0px 2px 5px 0px #0000001a;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;

  padding: 8px 0;

  background-color: #fff;

  border: 1px solid #e5e5e5;
  border-radius: 5px;

  cursor: pointer;
`;

const ResourcesWrapper = styled.div`
  display: flex;
  flex-direction: column;

  height: 100%;

  gap: 10px;
  padding: 10px;

  overflow: scroll;
`;

const ResourceCard = styled.div`
  border-radius: 10px;
  background-color: #fff;
  padding: 12px;

  & > #icon-action-area {
    display: flex;
    justify-content: end;

    gap: 8px;

    margin-top: 25px;

    & > .tds-icon {
      cursor: pointer;
    }
  }
`;
