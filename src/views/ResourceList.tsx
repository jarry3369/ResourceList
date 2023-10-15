import React, { useRef } from "react";
import styled from "styled-components";
import { TypedIcon } from "typed-design-system";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
} from "@chakra-ui/react";

import useResources from "../hooks/useResources";
import { ViewerConsumer } from "../contexts/viewer";

const ResourceList = () => {
  const {
    resources,
    addURL,
    addImages,
    modifyingResourceName,
    removeResource,
  } = useResources();

  const nameRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);

  const saveImgFile = () => {
    const files = imgRef.current?.files;
    if (files) addImages(files);
  };

  return (
    <ViewerConsumer>
      {({ state, actions }) => {
        const { viewerTarget } = state;
        const { setViewerTarget } = actions;
        return (
          <Wrapper>
            <Header>
              <Popover
                initialFocusRef={urlRef}
                placement="bottom-start"
                onClose={() => {
                  if (urlRef.current?.value) {
                    addURL(urlRef.current.value);
                    urlRef.current.value = "";
                  }
                }}
              >
                {({ onClose }) => (
                  <>
                    <PopoverTrigger>
                      <Button key="url-input">URL 추가</Button>
                    </PopoverTrigger>
                    <PopoverContent w={260}>
                      <PopoverBody padding={"5px"}>
                        <input
                          id="url-input"
                          ref={urlRef}
                          onKeyUp={(e) => e.key === "Enter" && onClose()}
                        />
                      </PopoverBody>
                    </PopoverContent>
                  </>
                )}
              </Popover>

              <Button key="image-input" htmlFor="image-input">
                이미지 추가
              </Button>
              <input
                ref={imgRef}
                id="image-input"
                type="file"
                multiple
                accept=".jpg,.png"
                onChange={saveImgFile}
                style={{ display: "none" }}
              />
            </Header>

            <ResourcesWrapper>
              {[...resources].reverse().map((resource, index) => {
                const active: boolean = viewerTarget?.key === resource.key;
                return (
                  <ResourceCard
                    key={resource.key}
                    onClick={() => {
                      setViewerTarget(resource);
                    }}
                    active={active}
                  >
                    <div id="label-area">
                      <span id="label">{resource?.name} </span>
                      <input
                        defaultValue={resource?.name}
                        ref={nameRef}
                        id={`${resource.key}-name-input`}
                        onBlur={(e) => {
                          if (e.target.value === "") return;
                          modifyingResourceName(
                            resource.key,
                            e.target.value,
                            (obj) => setViewerTarget(obj)
                          );
                        }}
                        onKeyUp={(e) =>
                          e.key === "Enter" && e.currentTarget.blur()
                        }
                      />
                    </div>
                    <div id="icon-action-area">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          document
                            .getElementById(`${resource.key}-name-input`)
                            ?.focus();
                        }}
                      >
                        <TypedIcon icon="edit_19" />
                      </div>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          removeResource(resource?.key, () => {
                            if (active) setViewerTarget(null);
                          });
                        }}
                      >
                        <TypedIcon icon="trash_19" />
                      </div>
                    </div>
                  </ResourceCard>
                );
              })}
            </ResourcesWrapper>
          </Wrapper>
        );
      }}
    </ViewerConsumer>
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

const Button = styled.label`
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

const ResourceCard = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: column;

  flex-shrink: 0;
  align-items: flex-end;
  justify-content: space-between;

  height: 90px;

  padding: 12px;
  border-radius: 10px;
  background-color: #fff;

  ${({ active }) =>
    active && {
      border: `1px solid #38A5E1`,
    }}

  cursor: pointer;

  & > #label-area {
    width: 100%;

    display: flex;
    flex-direction: row;

    align-items: center;
    justify-content: start;

    word-wrap: break-word !important;
    word-break: break-all !important;

    display: -webkit-inline-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;

    overflow: hidden;

    & > input {
      width: 0px;
    }
  }

  & > #label {
    width: 100%;
    text-align: start;

    word-wrap: break-word !important;
    word-break: break-all !important;

    display: -webkit-inline-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;

    overflow: hidden;

    font-size: 14px;
    font-weight: 400;
    line-height: 16.41px;
  }

  & > #icon-action-area {
    display: flex;
    justify-content: end;

    gap: 8px;

    & > .tds-icon {
      cursor: pointer;
    }
  }

  & > #label-area:focus-within {
    & > input {
      width: 100%;
    }
    & > #label {
      display: none;
    }
  }
`;
